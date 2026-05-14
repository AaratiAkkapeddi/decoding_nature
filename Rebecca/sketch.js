let y = 0;
let x = 0;

let rainDrops = [];

let drops = [];

let words = [
  "Neurodivergent",
  "Disabled",
  "LGBTQIA+",
  "Depressed",
  "Introvert",
  "Awkward",
  "Black",
  "Brown",
  "POC",
];

let words2 = [
  "Freedom",
  "Palestine",
  "Sudan",
  "DRC",
  "Haiti",
  "Justice For All",
  "Bodily Autonomy",
  "-RM",
];

let colorGradients = ["darkblue", "pink", "orange"];

let sunset = 0;

let rainSize;

let counter = 0;

function setup() {
  if(window.innerWidth < 768){
createCanvas(windowWidth, windowHeight * 0.65);
  }else{
createCanvas(windowWidth, windowHeight);
  }  translate(width / 2, height);
  angleMode(DEGREES);
  colorMode(HSB);

  for (let i = 0; i < 35; i++) {
    drops.push(new RainDrops());
  }
}

function draw() {
  background(220);
  /*Gradient background code*/

  let colorA = colorGradients[sunset][0];
  let colorB = colorGradients[sunset][1];


  let stripeCount = 30;

  let stripeHeight = height / stripeCount;

  for (let y = 0; y < height; y += stripeHeight) {
    noStroke(); 
    let fadeAmount = y / height;

    let colorA = color(240, 100, 50); 
    let colorB = color(30, 100, 100); 
    let betweenColor = lerpColor(colorA, colorB, fadeAmount);

    fill(betweenColor);
    rect(0, y, width, stripeHeight);
  }

  if (frameCount % 100 == 0) {
    sunset = sunset + 1;
  }
  if (sunset == 3) {
    sunset = 0;
  }
  /* end gradient background code*/

  for (let i = 0; i < 35; i++) {
    drops[i].fall();
    drops[i].show();
  }

  translate(width / 2, height); 
  branch(height/4, 5, 7);
  counter = 0;

}

class RainDrops {
  constructor() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.speed = random(2, 5);
    this.text = random(words2);
    this.size = random(7, 25);
  }
  fall() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-200, -100);
      this.x = random(width);
    }
  }
  show() {
    fill(123, 63, 0);
 
    fill("lightblue");
    noStroke();
    textSize(this.size);
    if(mouseX - pmouseX == 0){
      ellipse(this.x, this.y, 5, 5); //raindrop ellipse
    }else{
      text(this.text, this.x, this.y); //text raindrop

    }
  }
}

function branch(len, w, s) {
  stroke(0); 
  strokeWeight(s);
  line(0, 0, 0, -len);
  translate(0, -len);
  if (mouseIsPressed && counter < words.length && len > 17) {
    push();
    textAlign(CENTER);
    textSize(10.55);
    fill("yellow");
    rotate(90);
    text(words[counter], len / 2, -2);
    pop();
  }
  if (len < 15) {
    fill("green");
    ellipse(0, 0, len / 2, len / 3.5);
  }

  if (len > 7) {
    push();
    rotate(50);
    branch(len / 1.5, w / 1.5, s / 1.4); 
    pop();
    push();
    rotate(-50);
    branch(len / 1.5, w / 1.5, s / 1.4); 
    pop();
  }
  if (counter == words.length) {
    counter = 0;
  }
  counter = counter + 1;
}


//Special thanks to Aarati, Josue, & Cyprean <3