function doDraw(state, canvas){
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var canvasCenterX = canvas.width / 2;
    var canvasCenterY = canvas.height / 2;

    var bodyWidth = 50;
    var bodyHeight = 100;
    var armWidth = 15;
    var armLength = 60;

    ctx.fillStyle = "#FBD043";
    ctx.strokeStyle = "#FBD043";

    ctx.save();

    if(state.body != 1){
        ctx.translate((canvasCenterX),(canvasCenterY + (bodyHeight/2)));
        if(state.body == 0){
            // Left
            ctx.rotate(degToRad(-22.5));
        }else if(state.body == 2){
            // Right
            ctx.rotate(degToRad(22.5));
        }
        ctx.translate(-canvasCenterX,-(canvasCenterY + (bodyHeight/2)));
    }
    
    // Draw body
    ctx.beginPath();

    ctx.rect(canvasCenterX - (bodyWidth/2), canvasCenterY - (bodyHeight/2), bodyWidth, bodyHeight);
    ctx.stroke();
    ctx.fill();

    ctx.restore();

    // Draw arms

    ctx.fillStyle = "#e8bf3c";
    ctx.strokeStyle = "#e8bf3c";

    ctx.font = '100px serif';
    ctx.textAlign = 'center';

    var leftArmRotationPointX = canvasCenterX - (bodyWidth/2);
    var leftArmRotationPointY = canvasCenterY - (bodyHeight/6);

    var rightArmRotationPointX = canvasCenterX + (bodyWidth/2);
    var rightArmRotationPointY = canvasCenterY - (bodyHeight/6);

    ctx.save();

    if(state.body != 1){
        ctx.translate((canvasCenterX),(canvasCenterY + (bodyHeight/2)));
        if(state.body == 0){
            // Left
            ctx.rotate(degToRad(-22.5));
        }else if(state.body == 2){
            // Right
            ctx.rotate(degToRad(22.5));
        }
        ctx.translate(-canvasCenterX,-(canvasCenterY + (bodyHeight/2)));
    }

    ctx.translate(leftArmRotationPointX,leftArmRotationPointY);
    if(state.arms == 1){
        // Left
        ctx.rotate(degToRad(45));
    }else if(state.arms == 2){
        // Right
        ctx.rotate(degToRad(90));
    }else if(state.arms == 3){
        // Right
        ctx.rotate(degToRad(135));
    }
    ctx.translate(-(leftArmRotationPointX),-(leftArmRotationPointY));
    

    //Left
    ctx.beginPath();
    ctx.rect(canvasCenterX - (bodyWidth/2) - armWidth/2, canvasCenterY - (bodyHeight/6), armWidth, armLength);
    ctx.stroke();
    ctx.fill();

    ctx.restore();
    ctx.save();

    if(state.body != 1){
        ctx.translate((canvasCenterX),(canvasCenterY + (bodyHeight/2)));
        if(state.body == 0){
            // Left
            ctx.rotate(degToRad(-22.5));
        }else if(state.body == 2){
            // Right
            ctx.rotate(degToRad(22.5));
        }
        ctx.translate(-canvasCenterX,-(canvasCenterY + (bodyHeight/2)));
    }

    ctx.translate(rightArmRotationPointX,rightArmRotationPointY);
    if(state.arms == 1){
        // Left
        ctx.rotate(degToRad(-45));
    }else if(state.arms == 2){
        // Right
        ctx.rotate(degToRad(-90));
    }else if(state.arms == 3){
        // Right
        ctx.rotate(degToRad(-135));
    }
    ctx.translate(-(rightArmRotationPointX),-(rightArmRotationPointY));

    //Right
    ctx.beginPath();
    ctx.rect(canvasCenterX + (bodyWidth/2) - armWidth/2, canvasCenterY - (bodyHeight/5), armWidth, armLength);
    ctx.stroke();
    ctx.fill();

    ctx.restore();


    ctx.save();

    if(state.body != 1){
        ctx.translate((canvasCenterX),(canvasCenterY + (bodyHeight/2)));
        if(state.body == 0){
            // Left
            ctx.rotate(degToRad(-22.5));
        }else if(state.body == 2){
            // Right
            ctx.rotate(degToRad(22.5));
        }
        ctx.translate(-canvasCenterX,-(canvasCenterY + (bodyHeight/2)));
    }

    // Draw face
    ctx.beginPath();
    ctx.fillText(state.face, canvasCenterX, canvasCenterY - (bodyHeight/2)+30);

    ctx.restore();

}

function degToRad(degree){
    return degree * Math.PI / 180;
}