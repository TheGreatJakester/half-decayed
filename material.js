LENGTH = 50;

simulation = {
    current : 0,
    paused: false,
    set currentTime(x){
        if(!this.paused || x == 0){
            this.current = x;
        }
    },
    get currentTime(){
        return this.current;
    },
    numberOfSamples : LENGTH*LENGTH,
    order: new Array(this.numberOfSamples),
    units: 'years',
    halfLife : 100,
    unitsPerSecond: 1,
    getSamples : function(){
        samples = new Array(this.numberOfSamples).fill(0)
        numberOfDecayedSamples = 
        Math.floor(
            this.numberOfSamples*
            Math.pow(
                .5,
                (this.currentTime*this.unitsPerSecond)/this.halfLife
            )
        )
        for(i=0;i<numberOfDecayedSamples;i++){
            samples[this.order[i]] = 1;
        }
        return samples;
    },
    reset : function(){
        this.currentTime = 0;
        //Make sure to run this atleast once before the first simulation goes
        for(i=0;i<this.numberOfSamples;i++){
            this.order[i] = i;
        }
        this.order.sort(function(){return Math.random()-.5;})
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
    startSimulation()
}

function drawFrame(){
    var samples = simulation.getSamples();
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
}

function updateElements(){
    //document.getElementById("decayProgress").value = simulation.currentTime*simulation.unitsPerSecond;
}

function startSimulation(){
    var start = (new Date()).getTime();
        drawFrame()
        updateElements()
    var finish = (new Date()).getTime();
    var delta = finish - start;
    var framesPerSecond = 30;
    simulation.currentTime += 1/framesPerSecond;
    var waitTime = 1000/framesPerSecond - delta;
    if(waitTime < 0){
        waitTime = 0;
    }
    setTimeout(function(){startSimulation()},waitTime)
}