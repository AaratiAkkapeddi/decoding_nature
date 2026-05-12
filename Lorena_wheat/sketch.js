let angle = 8; //creating a variable for the angle

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES); //need to rotate
  
}

function draw() {
 
  background(30, 122, 214,7);
  translate(width/2, height/1.1);
  fill(255, 0, 0);
  
  branch(80); //the number is the starting length run the ccode that iv'e written in branch
}

function branch(len) {
 
  stroke(245, 199, 108, 9)
  strokeWeight(2);
  line(0, 0, 0, -len);

  if (len > 5) {
    translate(0, -len); //to move the line up in the X axise
    push(); //
    rotate(mouseX); //need angle degree mode right
    branch(len * 0.7); //everytime len runs the length is mutlipied by .60 to shrink size
    pop();
    push();
    rotate(-angle); //left branch angel of the left
    branch(len * 0.3);
    pop();
   
    }
   stroke(245, 199, 108,9)
  strokeWeight(2);
  line(0, 0, 0, -len);

  if (len > 5) {
    translate(0, -len); //to move the line up in the X axise
    push(); //
    rotate(angle); //need angle degree mode right
    branch(len * 0.7); //everytime len runs the length is mutlipied by .60 to shrink size
    pop();
    push();
    rotate(-mouseX); //left branch angel of the left
    branch(len * 0.3);
    pop();
   
    }
  
}
