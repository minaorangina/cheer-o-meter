
function setup(){
    var teamId = 0;
    var sendToProjector = true;

    var teamName = "?";
    var restingFace = "😎";

    return {teamName, teamId, restingFace, sendToProjector};
}

function faceControl(){

    if(volume() < 3){
        setFace("😟")
    }else if(volume() < 5){
        setFace("😐")
    }else{
        setFace("😃")
    }

}

function danceControl(){
    repeat(3,()=>{
        leanLeft();
        leanRight();
        leanMiddle();
        
        armsSide();
        armsLow();
        armsMiddle();
        armsUp();
    });
}