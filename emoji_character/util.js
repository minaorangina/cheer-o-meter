var dancing = false;
var reactToSound = false;
var myTeamId = -1;
var sendToProjector = true;

function toggleReactToSound(){
    if(reactToSound){
        document.getElementById("react-button").innerHTML = "React to sound off";
        reactToSound = false;
        setFace(state.restingFace);
    }else{
        document.getElementById("react-button").innerHTML = "React to sound on";
        reactToSound = true;
    }
}

function drawCharacter(state){
    if(sendToProjector){
        channel.trigger("client-character-update",{
            teamId:myTeamId,
            state
        });
    }
    doDraw(state,document.getElementById("character-canvas"));
}


//Runs when the code first starts
function volume(){
    return meter.volume * 10;
}

function setFace(face){
    faceState({face});
}

function repeat(count, fun){
    for(var i=0; i<count; i++){
        fun();
    }
}

var myTeamName = "";

function init(){
    var initObject = setup();
    myTeamName = initObject.teamName;
    defaultState.restingFace = initObject.restingFace;
    state.restingFace = initObject.restingFace;
    myTeamId = initObject.teamId;
    sendToProjector = initObject.sendToProjector;
    drawCharacter(state);
    setTimeout(task,currentTimeout);
}

function doDance(){
    dancing = true;
    danceControl();
}

function reset(){
    state = Object.assign({},defaultState);
    drawCharacter(state);
}

function leanLeft(){
    syncState({body:0});    
}

function leanRight(){
    syncState({body:2});
}

function leanMiddle(){
    syncState({body:1});
}

function armsSide(){
    syncState({arms:0});
}

function armsUp(){
    syncState({arms:3});
}

function armsMiddle(){
    syncState({arms:2});
}

function armsLow(){
    syncState({arms:1});
}

function putArmsDown(){
    if(state.arms > 0){
        syncState({arms:state.arms-1});
    }
}

function putArmsUp(){
    if(state.arms < 4){
        syncState({arms:state.arms+1});
    }
    
}

var currentTimeout = 250;

var taskQueue = [];
var taskPointer = -1;
var faceQueue = [];
var facePointer = -1;

var task = function(){
    if(taskPointer < taskQueue.length -1){
        taskPointer++;
        taskItem = taskQueue[taskPointer];
        update(taskItem);
    }else{
        dancing = false;
    }
    if(facePointer < faceQueue.length -1){
        facePointer++;
        faceItem = faceQueue[facePointer];
        update(faceItem);
    }else{
        if(reactToSound){
            faceControl();
        } 
    }
    setTimeout(task,currentTimeout);
};


function update(diff){
    state = Object.assign({},state,diff)
    drawCharacter(state)
}

function syncState(diff){
    taskQueue.push(diff);
}

function faceState(diff){
    faceQueue.push(diff);
}

var defaultState = {
    face: "😎",
    arms: 0,
    body: 1,
    offsetX: 0
}

var state = Object.assign({},defaultState);

init();