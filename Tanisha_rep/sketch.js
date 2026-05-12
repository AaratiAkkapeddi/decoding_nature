let walkImg;

let girls = [];

let angle = 19;
let angleX = 16;

let mycolors = [
  "CornflowerBlue",
  "DarkCyan",
  "MediumSlateBlue",
  "MediumVioletRed",
  "RoyalBlue",
  "DarkSlateBlue",
  "MidnightBlue",
];

let currentColor = 0;

x = 400;

function preload() {
  walkImg = loadImage("sassygirl.gif");
}

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES); // switch to degrees form radians
  frameRate(7.5);
  
   for (let i = 0; i < 2; i = i + 1) {
    
  }
}

function draw() {
  background(mycolors[currentColor]);

  if (currentColor == 6) {
    currentColor = 0;
  } else {
    currentColor = currentColor + 1;
  }

  translate(290, height);
  fill("darkgreen");

  rect(-200, 0, 650, 650);
  ellipse(0, 0, 5, 5, 0);
  branch(99, 30); // run the code that I've written in branch
  fill("green");
  noStroke();
  arc(40, 102, 40, 50, 170, 0);
  arc(20, 102, 40, 50, 170, 0);
  arc(-10, 102, 40, 50, 170, 0);
  arc(-40, 102, 40, 50, 170, 0);
}

function branch(len, w) {
  //code to draw a single branch structure
  stroke("black");
  strokeWeight(w);
  line(0, 0, 0, -len);
  angle = random(15, mouseY * 8);
  angleX = random(35, 45);

  if (len > 10) {
    // the smaller the number is the more branches you would have
    translate(0, -len);
    push();
    rotate(angle); //angle of the right branch
    branch(len * 0.6, w * 0.6); // right branch- this number is the rate at which it shrinks
    pop();
    push();
    rotate(-angleX); //angle of the left branch
    branch(len * 0.9, w * 0.9); // left branch
    fill(angle * 12.52, 138, 238);
    noStroke();
    ellipse(0, -len, 3, 13);
    pop();

    for (let i = 1; i < girls.length; i = i + 1) {
    girls[i].display();
    
    }
  }
    image(walkImg, 200, 150, 100);
  
}
