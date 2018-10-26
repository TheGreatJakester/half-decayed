let LENGTH = 25;

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
    get numberOfDecayedSamples(){
        return this.numberOfSamples - Math.floor(
            this.numberOfSamples*
            Math.pow(
                .5,
                (this.currentTime*this.unitsPerSecond)/this.halfLife
            )
        );
    },
    getSamples : function(){
        samples = new Array(this.numberOfSamples).fill(0)
        for(i=0;i<this.numberOfDecayedSamples;i++){
            samples[this.order[i]] = 1;
        }
        return samples;
    },
    changeSpeed : function(unitsPerSecond){
        this.current = this.current*this.unitsPerSecond/unitsPerSecond;
        this.unitsPerSecond = unitsPerSecond;
    },
    reset : function(){
        this.currentTime = 0;
        this.halfLife = document.getElementById("halfLife").value;
        this.units = document.getElementById("units").value;
        //Make sure to run this atleast once before the first simulation goes
        for(i=0;i<this.numberOfSamples;i++){
            this.order[i] = i;
        }
        document.getElementById("decayProgress").max = 10*simulation.halfLife;
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
                context.fillStyle = "#111111" //red
            }
            else{
                context.fillStyle = "#0ea1b5" //Green
            }
            context.fillRect(i*(width/LENGTH),j*(height/LENGTH),(width/LENGTH),(height/LENGTH))
        }
    }    
}

function updateElements(){
    document.getElementById("decayProgress").value = simulation.currentTime*simulation.unitsPerSecond;
    document.getElementById("time").innerHTML = Math.floor(simulation.currentTime*simulation.unitsPerSecond) + " " + simulation.units;
    document.getElementById("progress").innerHTML = simulation.numberOfDecayedSamples + "/" + simulation.numberOfSamples;
}

function startSimulation(){
    setInterval(function(){
        simulation.currentTime += 1/30;
        drawFrame()
        updateElements()
    },1000/30)
}