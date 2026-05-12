let colors=
    
  ["tomato", "rebeccapurple", "papayawhip", "orange"];
  function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER); //so the rectangles are positioned by their center not the top left corner
  angleMode(DEGREES); //so our rotation is in degrees and not radians bc who knows radians off the top of their head
    
}
let mycolor = "tomato"

function draw() {
  
  
  background("tomato");

  for (let x = 0; x < 10; x++) {
    noStroke(); //removes outline from shapes
    //move the world coordinate system to have 0,0 in the center of the canvas
    translate(x*mouseX, 120); // you can do translate (x*mouseX,100);
    ellipse(0, 0, 100, 100); //draw the circle
    push(); //our first 'bookend'

    fill(0,255,0);
    if(frameCount % 50 == 0){
      mycolor = random(colors);
    }
    fill(mycolor);
    stroke(5);
    rect(-75, 0, 100, 70); //draw the first rectangle
    rotate(45); //rotate the world 45 deg
    rect(-75, 0, 100, 70); //draw the same rectangle
    rotate(45); //rotate the world 45 deg again
    rect(-75, 0, 100, 70); //draw the same rectangle
    rotate(45); //rotate the world 45 deg again
    rect(-75, 0, 100, 70); //draw the same rectangle
    rotate(45); //rotate the world 45 deg again
    rect(-75, 0, 100, 70); //draw the same rectangle
    rotate(45); //rotate the world 45 deg again
    rect(-75, 0, 100, 70); //draw the same rectangle
    rotate(45); //rotate the world 45 deg again
    rect(-75, 0, 100, 70); //draw the same rectangle
    rotate(45); //rotate the world 45 deg again
    rect(-75, 0, 100, 70); //draw the same rectangle
    fill(190, 340, 190);
    stroke(2);
    circle(2, 2, 135);
    fill(3);
    circle(5, 1, 13);
    circle(10, 11, 13);
    circle(15, 20, 13);
    circle(20, 30, 13);
    circle(25, 40, 13);
    circle(30, 50, 13);
    rotate(45);
    circle(5, 1, 13);
    circle(10, 11, 13);
    circle(15, 20, 13);
    circle(20, 30, 13);
    circle(25, 40, 13);
    circle(30, 50, 13);
    rotate(45);
    circle(5, 1, 13);
    circle(10, 11, 13);
    circle(15, 20, 13);
    circle(20, 30, 13);
    circle(25, 40, 13);
    circle(30, 50, 13);
    rotate(45);
    circle(5, 1, 13);
    circle(10, 11, 13);
    circle(15, 20, 13);
    circle(20, 30, 13);
    circle(25, 40, 13);
    circle(30, 50, 13);
    rotate(45);
    circle(5, 1, 13);
    circle(10, 11, 13);
    circle(15, 20, 13);
    circle(20, 30, 13);
    circle(25, 40, 13);
    circle(30, 50, 13);
    rotate(45);
    circle(5, 1, 13);
    circle(10, 11, 13);
    circle(15, 20, 13);
    circle(20, 30, 13);
    circle(25, 40, 13);
    circle(30, 50, 13);
    rotate(45);
    circle(5, 1, 13);
    circle(10, 11, 13);
    circle(15, 20, 13);
    circle(20, 30, 13);
    circle(25, 40, 13);
    circle(30, 50, 13);
    rotate(45);
    circle(5, 1, 13);
    circle(10, 11, 13);
    circle(15, 20, 13);
    circle(20, 30, 13);
    circle(25, 40, 13);
    circle(30, 50, 13);

    pop(); //bookend the transformations
  }
}
