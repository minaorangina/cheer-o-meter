
function setup(){
    var sendToProjector = true;
    var restingFace = "😎";

    return {restingFace, sendToProjector};
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