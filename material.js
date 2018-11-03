let LENGTH = 25;

simulation = {
    isotopes : [],
    startTime : (new Date()).getTime(),
    get currentTime(){
        if(!this.paused){
            return ((new Date()).getTime() - this.startTime);
        }
        else{
            return this.pausedTime;
        }
    },
    paused: true,
    pausedTime: 0,
    pause : function(toggle){
        if(toggle != undefined){
            if(toggle && !this.paused){
                this.pausedTime = this.currentTime;
                this.paused = true;
            }
            else if(this.paused){
                this.startTime = (new Date()).getTime() - this.pausedTime;
                this.pausedTime = 0;
                this.paused = false;
            }
        }
        else{
            this.pause(!this.paused)
        }
    },
    numberOfSamples : LENGTH*LENGTH,
    order: new Array(this.numberOfSamples),
    units: 'years',
    halfLife : 100,
    unitsPerTick: .001,
    get numberOfDecayedSamples(){
        return this.numberOfSamples - Math.floor(
            this.numberOfSamples*
            Math.pow(
                .5,
                ((this.currentTime)*this.unitsPerTick)/this.halfLife
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
    changeSpeed : function(unitsPerTick){
        this.currentTime = this.currentTime*this.unitsPerTick/unitsPerTick;
        this.unitsPerTick = unitsPerTick;
    },
    changeTime: function(ticks){
        this.startTime = (new Date()).getTime() - ticks;
    },
    reset : function(){
        this.startTime = (new Date()).getTime;
        this.pause(true);
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

function loadJSON(fileName,callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', fileName , true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
          }
    };
    xobj.send(null);
 }

function initMaterialWindow(){
    loadJSON("./Isotopes.txt",function(isotopes){
        simulation.isotopes = isotopes;
        isotopeDropDown = document.getElementById("isotopes");
        isotopes.forEach(isotope => {
            isotopeDropDown.innerHTML = isotopeDropDown.innerHTML + 
            "\n <option value=\""+isotope.name + "\">"+isotope.name+"</option>";
        });
    })
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
    document.getElementById("decayProgress").value = simulation.currentTime*simulation.unitsPerTick;
    document.getElementById("time").innerHTML = Math.floor(simulation.currentTime*simulation.unitsPerTick) + " " + simulation.units;
    document.getElementById("progress").innerHTML = simulation.numberOfDecayedSamples + "/" + simulation.numberOfSamples;
}

function startSimulation(){
    setInterval(function(){
        simulation.currentTime += 1/30;
        drawFrame()
        updateElements()
    },1000/30)
}