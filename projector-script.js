var WIDTH = 500;
var HEIGHT = 50;
const channelName = "private-into-university";
const permissionToCheerEvent = "client-permission-to-cheer";
let teams = [];

const pusher = new Pusher("6d5257a886da7d55512b", {
  cluster: "eu",
  encrypted: true,
  authEndpoint: "/auth",
  disableStats: true
});
const channel = pusher.subscribe(channelName);

channel.bind("client-team-register", ({ teamName }) => {
  console.log(`TEAMNAME:::::::: ${teamName}`);
  if (teams.indexOf(teamName) === -1) {
    teams.push(teamName);
  }
});

channel.bind("client-volume", ({ teamName, fill }) => {
  console.log(teamName, fill);
  const index = getTeamIndex(teamName);
  console.log("INDEX", index);
  let canvasContext = document
    .querySelectorAll(".team-row canvas")
    [index].getContext("2d");

  draw(canvasContext, fill);
});

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

function getTeamIndex(teamName) {
  return teams.indexOf(teamName);
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
