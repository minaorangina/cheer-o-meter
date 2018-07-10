const WIDTH = 500;
const HEIGHT = 150;
const SENSITIVITY = 0.0005;
let audioContext = null;
let canvasContext = null;
let mediaStreamSource = null;

let meter = null;
let rafID = null;
let fill = 0.0;
let hue = 0;
const channelName = "private-into-university";
const permissionToCheerEvent = "client-permission-to-cheer";

let resetButton, registerButton, teamNameTitle;
let timeoutId, intervalId;

let isCompetitionTime = false;
let isTeamRegistered = false;

const teamId = 0;
const teamName = "the-perfect-ones";

const pusher = new Pusher("6d5257a886da7d55512b", {
  cluster: "eu",
  encrypted: true,
  authEndpoint: "/auth",
  disableStats: true
});
const channel = pusher.subscribe(channelName);

// Bind to events
channel.bind("pusher:subscription_succeeded", getStarted);
channel.bind(permissionToCheerEvent, teamToCheer => {
  console.log("Received permission to cheer");
  if (teamToCheer === teamName) {
    console.log(`${teamName}'s time to cheer!`);
    reset();
    startCheering();
  }
});
channel.bind("client-competition-time", () => {
  reset();
  isCompetitionTime = true;
  document.querySelector("#customise-character").style.display = "none";
  document.querySelector("#cheering").style.display = "block";
});

function reset() {
  fill = 0;
  draw();
}

// Attached to button
function registerTeam(e) {
  if (teamName) {
    const res = channel.trigger("client-team-register", { teamId, teamName });
    if (res === true) {
      console.info(`${teamName}, you are now registered!`);
      isTeamRegistered = true;
      registerButton.innerText = "Team registered";
      registerButton.disabled = true;
      teamNameTitle.innerText = teamName;
    }
  }
}

// Triggered remotely by us
function startCheering() {
  // countdown?
  intervalId = setInterval(() => {
    const res = channel.trigger("client-volume", { teamId, teamName, fill });
    console.log(`Sending volume ${res}`);
  }, 200);

  timeoutId = setTimeout(stopCheering, 10000);
}

// disconnect entirely
function stopCheering() {
  console.log("unbound channel");
  channel.unbind(channelName);
  clearTimeout(timeoutId);
  clearInterval(intervalId);
}

/**************************
  NOTHING TO SEE HERE :)   
**************************/

function getStarted() {
  canvasContext = document.getElementById("meter").getContext("2d");
  resetButton = document.querySelector("#reset");
  registerButton = document.querySelector("#register");
  teamNameTitle = document.querySelector("#team-name");

  registerButton.addEventListener("click", registerTeam);
  resetButton.addEventListener("click", reset);
  setupMicrophone();
}

function onLevelChange(time) {
  const randomMultiplier = SENSITIVITY + Math.random() * 0.0001;
  fill += meter.volume * randomMultiplier;
  draw();
  rafID = window.requestAnimationFrame(onLevelChange);
}

function draw() {
  // clear the background
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  // if (fill < 1.0) {
  //   canvasContext.fillStyle = "blue";
  // } else {
  //   canvasContext.fillStyle = "green";
  // }

  // draw a bar based on the current volume
  canvasContext.fillStyle = "hsla(" + hue + ", 100%, 40%, 1)";
  const grad = canvasContext.createLinearGradient(0, 0, 0, 130);
  grad.addColorStop(0, "transparent");
  grad.addColorStop(1, "rgba(0,0,0,0.5)");
  canvasContext.fillStyle = grad;
  canvasContext.fillRect(0, 0, fill * WIDTH, HEIGHT);
}

function setupMicrophone() {
  // monkeypatch Web Audio
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  // grab an audio context
  audioContext = new AudioContext();

  // Attempt to get audio input
  try {
    // monkeypatch getUserMedia
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    // ask for an audio input
    navigator.getUserMedia(
      {
        audio: {
          mandatory: {
            googEchoCancellation: "false",
            googAutoGainControl: "false",
            googNoiseSuppression: "false",
            googHighpassFilter: "false"
          },
          optional: []
        }
      },
      onMicrophoneGranted,
      onMicrophoneDenied
    );
  } catch (e) {
    alert("getUserMedia threw exception :" + e);
  }
}

function onMicrophoneDenied() {
  alert("Stream generation failed.");
}

function onMicrophoneGranted(stream) {
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Create a new volume meter and connect it.
  meter = createAudioMeter(audioContext);
  mediaStreamSource.connect(meter);

  // kick off the visual updating
  onLevelChange();
}
