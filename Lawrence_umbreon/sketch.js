let myImage;
let myImage2;
let x = 0;
let y = 1;
let direction = 1;

function preload() {
  myImage2 = loadImage("Umbreon preview.png");
  myImage = loadImage("Shiny_Umbreon no BG.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(05);
}

function draw() {
  background(0, 0, 0, 100);

  ellipse(width, 10, 180, 170);
  fill(135, 206, 235);

  push();
  image(myImage, x, 200, 180, 180);
  x = mouseX;
  pop();

  image(myImage2, y, 215, 160, 160);

  if (x > 360) {
    direction = 0.02;
  } else if (x < 0) {
    direction = 0.02;
  }

  x = x + direction;
}
