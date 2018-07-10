var WIDTH = 500;
var HEIGHT = 100;
const channelName = "private-into-university";
const permissionToCheerEvent = "client-permission-to-cheer";

const teamRow = document.querySelectorAll(".team-row");
let teams = {
  0: "",
  1: "",
  2: "",
  3: ""
};

const pusher = new Pusher("6d5257a886da7d55512b", {
  cluster: "eu",
  encrypted: true,
  authEndpoint:
    "http://into-university-auth-endpoint.herokuapp.com/pusher/auth",
  disableStats: true
});
const channel = pusher.subscribe(channelName);

channel.bind("client-team-register", ({ teamId, teamName }) => {
  console.log(`TEAMNAME:::::::: ${teamName}`);
  teams[teamId] = teamName;
  // Display team name
  teamRow[teamId].querySelector("h3").innerText = teamName;
});

channel.bind("client-character-update", ({ teamId, state }) => {
  var canvasDomObject = teamRow[teamId].querySelector(".team-logo");
  doDraw(state, canvasDomObject);
});

channel.bind("client-volume", ({ teamId, teamName, fill }) => {
  console.log(teamId, teamName, fill);
  let canvasContext = document
    .querySelectorAll(".team-row .meter")
    [teamId].getContext("2d");

  draw(canvasContext, fill);
});

function competitionTime() {
  channel.trigger("client-competition-time", {});
}

// To start competition for a team,
// call `permissionToCheer` with the
// position index of the chosen team
// in the `teams` array

function permissionToCheer(index) {
  const chosenTeam = teams[index];
  console.log(`CHOSEN TEAM ${chosenTeam}`);
  if (chosenTeam) {
    console.log("TRIGGER PERMISSION");
    const res = channel.trigger("client-permission-to-cheer", chosenTeam);
    console.log(`Successfully given permission? ${res}`);
  }
}

function draw(canvasContext, fill) {
  // clear the background
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  if (fill < 1.0) {
    canvasContext.fillStyle = "blue";
  } else {
    canvasContext.fillStyle = "green";
  }

  // draw a bar based on the current volume
  canvasContext.fillRect(0, 0, fill * WIDTH, HEIGHT);
}
