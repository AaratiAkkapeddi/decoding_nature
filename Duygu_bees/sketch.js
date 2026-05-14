let myImg;
let bees = []; 
let mycolor = "green";
function preload() {
  myImg = loadImage("fly.png"); 
}

function setup() {
    if(window.innerWidth < 768){
createCanvas(windowWidth, windowHeight * 0.65);
  }else{
createCanvas(windowWidth, windowHeight);
  }
  frameRate(10);

  // create 12 bees
  for (let i = 0; i < 20; i++) {
    bees.push(new Bee(random(width), random(height), myImg));
  }
}

function draw() {
  let colors = ["green", "lightgreen"];
  background(mycolor);
  if(frameCount % 10  == 0){
    mycolor = random(colors)
  }
  fill("orange");
  stroke(10);
 rect(20,50,100,100,50,50);
  

  for (let bee of bees) {
    bee.move();
    bee.display();
  }
}

class Bee {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.speed = random(1, 3);
  }

  move() {
    
    let targetX = mouseX;
    let targetY = mouseY;

    this.x = lerp(this.x, targetX, 0.01);
    this.y = lerp(this.y, targetY, 0.05);

    
    this.x += random(-1.5, 1.5);
    this.y += random(-1.5, 1.5);
  }

  display() {
    image(this.img, this.x - 30, this.y - 25, 80, 70);
  }
}
