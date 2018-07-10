var audioContext = null;
var canvasContext = null;
var meter = null;
var WIDTH = 500;
var HEIGHT = 50;
const SENSITIVITY = 0.005;
let hue = 0;
var rafID = null;
var fill = 0.0;
const channelName = "private-into-university";
let registerButton, teamNameTitle;
let timeoutId, intervalId;
let isTeamRegistered = false;

const teamName = "the-perfect-ones";

const pusher = new Pusher("6d5257a886da7d55512b", {
  cluster: "eu",
  encrypted: true,
  authEndpoint: "/auth",
  disableStats: true
});
const channel = pusher.subscribe(channelName);
channel.bind("pusher:subscription_succeeded", getStarted);
channel.bind("client-permisson-to-cheer", teamToCheer => {
  if (teamToCheer === teamName) {
    startCheering();
  }
});

function init() {}

function getStarted() {
  canvasContext = document.getElementById("meter").getContext("2d");
  registerButton = document.querySelector("#register");
  teamNameTitle = document.querySelector("#team-name");

  // to add
  registerButton.addEventListener("click", registerTeam);

  setupMicrophone();
}

// Attached to button
function registerTeam(e) {
  if (teamName) {
    const res = channel.trigger("client-team-register", { teamName });
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
    const res = channel.trigger("client-volume", { teamName, fill });
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

function onLevelChange(time) {
  const randomMultiplier = SENSITIVITY + Math.random() * 0.0001;

  fill += meter.volume * randomMultiplier;

  draw();

  // set up the next visual callback
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
  // canvasContext.fillRect(25, 80, this.widths, 25);
  var grad = canvasContext.createLinearGradient(0, 0, 0, 130);
  grad.addColorStop(0, "transparent");
  grad.addColorStop(1, "rgba(0,0,0,0.5)");
  canvasContext.fillStyle = grad;
  // canvasContext.fillRect(25, 80, this.widths, 25);
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

var mediaStreamSource = null;

function onMicrophoneGranted(stream) {
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Create a new volume meter and connect it.
  meter = createAudioMeter(audioContext);
  mediaStreamSource.connect(meter);

  // kick off the visual updating
  onLevelChange();
}
