let myImage;
let x = 0, y = 0;
let xDir = 1, yDir = 2;
let bgColor; // Store the picked color here

function preload() {
  myImage = loadImage('Lugia.jpeg');
}

function setup() {
    if(window.innerWidth < 768){
createCanvas(windowWidth, windowHeight * 0.65);
  }else{
createCanvas(windowWidth, windowHeight);
  }
  // Pick the color from the very top-left pixel (0, 0) of your image
  // This ensures the canvas matches the image's own background color
  bgColor = myImage.get(0, 0); 
}

function draw() {
  // Use the color from the image
  background(bgColor); 

  // Optional: Lower the alpha in tint to "blend" it further
  tint(255, 200); 
  image(myImage, x, y, 200, 200);

  // Bundle of Joy
  x += xDir;
  y += yDir;
  if (x > width - 200 || x < 0) xDir *= -1;
  if (y > height - 200 || y < 0) yDir *= -1;
}