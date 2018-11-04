let LENGTH = 100;

simulation = {
    isotopes : [],
    isotope : {
        name:"Carbon-14", 
		color:"#99efec",
		product:"Nitrogen-14", 
		productColor:"#067c78",
		halfLife:5730, 
		halfLifeUnits: "years",
		datingRange: "0-100,000"
    },
    startTime : (new Date()).getTime(),
    paused: true,
    pausedTime: 0,
    numberOfSamples : LENGTH*LENGTH,
    order: new Array(this.numberOfSamples),
    unitsPerTick: .001,
    get currentTime(){
        if(!this.paused){
            time = ((new Date()).getTime() - this.startTime);
            if(time < this.maxTime){
                return time;
            }
            else{
                return this.maxTime;
            }
        }
        else{
            return this.pausedTime;
        }
    },
    set currentTime(time){
        if(time >= this.maxTime){
            time = this.maxTime;
        }
        if(this.paused){
            this.pausedTime = time;
        }
        else if(!this.paused){
            this.startTime = (new Date()).getTime() - time;
        }
    },
    get numberOfDecayedSamples(){
        ans =  this.numberOfSamples - Math.ceil(
            this.numberOfSamples*
            Math.pow(.5,(this.currentTime*this.unitsPerTick)/this.isotope.halfLife)
        );
        return ans;
    },
    get maxTime(){
        return (this.isotope.halfLife * -2 * Math.log(LENGTH))/(Math.log(.5)*this.unitsPerTick);
    },
    pause : function(state){
        if(state != undefined){
            if(state && !this.paused){
                this.pausedTime = this.currentTime;
                this.paused = true;
            }
            else if(!state && this.paused){
                this.startTime = (new Date()).getTime() - this.pausedTime;
                this.paused = false;
            }
        }
        else{
            this.pause(!this.paused)
        }
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
    reset : function(isotopeName){
        //reset time and pause
        this.pause(true);
        this.currentTime = 0;

        if( //use presets
            typeof(isotopeName) != undefined &&
            this.isotopes.some(el=>el.name == isotopeName)
        ){
            this.isotope = this.isotopes.find(el=>el.name == isotopeName);
        }
        else{ //use settings
            this.isotope.halfLife = document.getElementById("halfLife").value;
            this.isotope.units = document.getElementById("units").value;
            //TODO make the rest defualt
        }

        //shuffle decay
        for(i=0;i<this.numberOfSamples;i++){
            this.order[i] = i;
        }

        //set length of simulation
        document.getElementById("decayProgress").max = this.maxTime*this.unitsPerTick;
        //set avalible speeds
        document.getElementById("speed").min=this.isotope.halfLife/12000;
        document.getElementById("speed").max=this.isotope.halfLife/1000;
        document.getElementById("speed").value=this.isotope.halfLife/8000;
        this.changeSpeed(this.isotope.halfLife/8000);
        //TODO, make a better random solution
        this.order.sort(function(){return Math.random()-.5;})
        this.order.sort(function(){return Math.random()-.5;})
    }
}

//deprecated?
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
        unitDropDown = document.getElementById("units");
        isotopes.forEach(isotope => {
            isotopeDropDown.innerHTML = isotopeDropDown.innerHTML + 
            "\n <button onclick=\"simulation.reset(this.value)\" value=\"" + isotope.name + "\">"+ isotope.name +"</button><br>";
        });

        units = ["seconds","hours","days"];
        units.concat(
            isotopes.map(el => el.half_life_units).filter((el,index,array)=> array.indexOf(el) == index)
        ).forEach(el => {
            unitDropDown.innerHTML = unitDropDown.innerHTML + 
            "\n <option value=\"" + el + "\">"+ el +"</option>";
        })

        
    })
    materialWindow = document.getElementById("materialWindow");
    width = materialWindow.width;
    height = materialWindow.height;
    context = materialWindow.getContext("2d");
    context.fillStyle = "#FF0000";
    //infinite loop start
    simulation.reset()
    startAnimation()
}

function drawFrame(){
    var samples = simulation.getSamples();
    for(i=0;i<LENGTH;i++){
        for(j=0;j<LENGTH;j++){
            if(samples[i*LENGTH+j] == 1){
                context.fillStyle = simulation.isotope.productColor;
            }
            else{
                context.fillStyle = simulation.isotope.color;
            }
            context.fillRect(i*(width/LENGTH),j*(height/LENGTH),(width/LENGTH),(height/LENGTH))
        }
    }    
}

function updateElements(){
    document.getElementById("decayProgress").value = simulation.currentTime*simulation.unitsPerTick;
    document.getElementById("time").innerHTML = (simulation.currentTime*simulation.unitsPerTick).toFixed(3) + " " + simulation.isotope.halfLifeUnits;
    document.getElementById("progress").innerHTML = 
        (simulation.numberOfSamples - simulation.numberOfDecayedSamples) 
        + " " + simulation.isotope.name + "<div style=\"width:20px;height:20px;background:" + simulation.isotope.color + ";\"></div>" +
        simulation.numberOfDecayedSamples + " " + simulation.isotope.product + "<div style=\"width:20px;height:20px;background:" + simulation.isotope.productColor + ";\"></div>";
}

function startAnimation(){
    setInterval(function(){
        drawFrame()
        updateElements()
    },1000/30)
}