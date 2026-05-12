// USE THE MOUSE TO ROTATE THE CIRCLES 

function setup() {
  createCanvas(windowWidth, windowHeight);//changes the window to fit the screen better
  angleMode(DEGREES);// allows rotate to change the angle of the shapes 
}

function draw() {
  background("darkturquoise");// fill("darkturquoise")
  translate(width/2, height/2);// this is to move the shapes to the center
  strokeWeight(3);// this changes the outline strength
  stroke("mediumslateblue");// this changes the outline colour
  gasket(200);// this calls the function 
}
//Professors Appollonia Code :) tysm
// this is the function which allows me to ascribe certain features and call them all at the same time
function gasket(size) {
  ellipse(0, 0, size, size); //main big circle
  ellipse(-18, 8, size / 7.35, size / 7.35); //circle in the middle
  ellipse(0, size / 3.3, size / 2.55, size / 2.55); //circle at the bottom
 
  // this If statement allows the mouseX function to rotate the circles outside of the main circle along its outline
  
  if (size > 50) {
    rotate(-mouseX);
    translate(size / 1.55, size / 4.5);
    gasket(size / 1.5);
  }
}
