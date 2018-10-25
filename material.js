LENGTH = 100;
currentTime = 0;

simulation = {
    numberOfSamples : LENGTH*LENGTH,
    order: new Array(this.numberOfSamples),
    units: 'years',
    halfLife : 100,
    unitsPerSecond: 1,
    getSamplesAt : function(seconds){
        samples = new Array(this.numberOfSamples).fill(0)
        numberOfDecayedSamples = 
        Math.floor(
            this.numberOfSamples*
            Math.pow(
                .5,
                (seconds*this.unitsPerSecond)/this.halfLife
            )
        )
        for(i=0;i<numberOfDecayedSamples;i++){
            samples[this.order[i]] = 1;
        }
        return samples;
    },
    reset : function(){
        //Make sure to run this atleast once before the first simulation goes
        for(i=0;i<this.numberOfSamples;i++){
            this.order[i] = i;
        }
        this.order.sort(Math.random)
    }
}

function initMaterialWindow(){
    materialWindow = document.getElementById("materialWindow");
    width = materialWindow.width;
    height = materialWindow.height;
    context = materialWindow.getContext("2d");
    context.fillStyle = "#FF0000";
    //infinite loop start
    simulation.reset()
    drawFrame(context)
}

function drawFrame(context){
    var start = (new Date()).getTime();
    //drawing code
        samples = simulation.getSamplesAt(currentTime)
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
    currentTime += 1/framesPerSecond;
    var waitTime = 1000/framesPerSecond - delta;
    if(waitTime < 0){
        waitTime = 0;
    }
    setTimeout(function(){drawFrame(context)},waitTime)    
}