function initMaterialWindow(){
    materialWindow = document.getElementById("materialWindow");
    width = materialWindow.width;
    height = materialWindow.height;
    context = materialWindow.getContext("2d");
    context.fillStyle = "#FF0000";
    //infinite loop start
    drawFrame(context)
}



length=50;
samples = [];
samples.lenght = lenght*length;


function drawFrame(context){
    var start = (new Date()).getTime();
    //drawing code
        for(i=0;i<length;i++){
            for(j=0;j<length;i++){
                if(samples[i*length+j] == 1){
                    context.fillStyle = "#FF0000" //red
                }
                else{
                    context.fillStyle = "#0000FF" //Green
                }
                console.log('trying to draw a rect')
                context.fillRect(i*(width/length),j*(height/length),(width/length),(height/length))
            }
        }

    //end drawing code
    var finish = (new Date()).getTime();
    var delta = finish - start;
    var framesPerSecond = 30;
    var waitTime = delta - 1000/framesPerSecond;
    if(waitTime < 0){
        waitTime = 0;
    }
    setTimeout(function(){drawFrame(context)},waitTime)
    
}