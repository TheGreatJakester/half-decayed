function initMaterialWindow(){
    materialWindow = document.getElementById("materialWindow");
    width = materialWindow.width;
    height = materialWindow.height;
    context = materialWindow.getContext("2d");
    context.fillStyle = "#FF0000";
    //infinite loop start
    drawFrame(context)
}



LENGTH=150;
samples = [];
samples.length = LENGTH*LENGTH;


function drawFrame(context){
    var start = (new Date()).getTime();
    //drawing code
        samples[Math.floor(Math.random()*samples.length)] = 1;
        for(i=0;i<LENGTH;i++){
            for(j=0;j<LENGTH;j++){
                if(samples[i*LENGTH+j] == 1){
                    context.fillStyle = "#FF0000" //red
                }
                else{
                    context.fillStyle = "#00F00F" //Green
                }
                context.fillRect(i*(width/LENGTH),j*(height/LENGTH),(width/LENGTH),(height/LENGTH))
            }
        }

    //end drawing code
    var finish = (new Date()).getTime();
    var delta = finish - start;
    var framesPerSecond = 30;
    var waitTime = 1000/framesPerSecond - delta;
    if(waitTime < 0){
        waitTime = 0;
    }
    setTimeout(function(){drawFrame(context)},waitTime)
    
}