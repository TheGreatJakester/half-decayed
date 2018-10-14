
function draw(){
    console.log("draw()")
    var materialWindow = document.getElementById("materialWindow");
    var context = materialWindow.getContext("2d");
    context.fillStyle = "#FF0000";
    context.fillRect(0,0,200,200);
}