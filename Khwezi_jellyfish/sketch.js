let img;

let myArray = [];

let x = 200;
let y = 200;
let directionX = 0;
//make sure your image code loads before the rest of your code

function preload() {
  jellyfishgif = loadImage("jellyfish-jelly.gif"); //pulls image
  
}

function setup() {
  if(window.innerWidth < 768){
createCanvas(windowWidth, windowHeight * 0.65);
  }else{
createCanvas(windowWidth, windowHeight);
  }
  for(let i = 0; i < 5; i++){
    myArray.push(new Jellies(random(width),random(height), 0, 0));
  }
  
}

function draw() {
  background("LightSkyBlue");
  //image(jellyfishgif, x, y, 80, 80);

  
//jellyfish1.body();
 for(let i = 0; i < 5; i++){
    myArray[i].body();
  }

}

class Jellies { //parameters for class variables//
constructor(x, y, xSpeed, ySpeed) {
  this.x = x;
  this.y = y;
  this.xSpeed = xSpeed;
  this.ySpeed = ySpeed;
}
  
body(){
  
push()
  // lerp code from class presentation
  if (mouseIsPressed) {
    this.x = lerp(this.x, 2 * this.x - mouseX, random(0.05));
    this.x = constrain(this.x, 50, width - 50);
    this.y = lerp(this.y, 2 * this.y - mouseY, random(0.05));
    this.y = constrain(this.y, 50, height - 50);
  } else {
    this.x = lerp(this.x, mouseX, random(0.008));
    this.y = lerp(this.y, mouseY, random(0.008));
 }pop()
    this.x += this.xSpeed; 

    if (this.x < 0 || this.x > width) {
      this.xSpeed *= -1; //reverse whatever xSpeed is
      //xSpeed = xSpeed * -1;
    }

    this.y += this.ySpeed;

    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1; //reverse whatever ySpeed is
    }
    image(jellyfishgif, this.x, this.y, 50, 50);
  //code from class
  
  

}
}