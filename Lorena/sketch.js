//created this variable to store my gifs
let fishyImg; //image
let twinfishImg; //image

// Array to hold all active fishes
let fishies = []; // the square brackets will hold our fishes. will use it later in the code

//using preload to upload our images or gifs into the code
function preload() {
  fishyImg = loadImage("fishy.gif"); //loaded gif
  twinfishImg = loadImage("twinfish.gif"); // loaded gif
  girl = loadImage("Finding Nemo Disney GIF.gif"); //loaded gif
}

//created the canvas in full window mode by using window Width and Height to take up fullscreen. usually createdCanvas function size is at 400x400
function setup() {
  if(window.innerWidth < 768){
createCanvas(windowWidth, windowHeight * 0.65);
  }else{
createCanvas(windowWidth, windowHeight);
  }
  //I needed to create this equation to use my loaded fish gifs and created their speed and random swimming in the code but also coming back to the screen and not disappearing
  for (let i = 0; i < 2; i = i + 1) {
    // Create 5 fishes, each starting at the center with a random x and y speed (0–2)
    let f = random(0, 2);//random variable is just random...here its speecd
    let t = random(0, 2);
    fishies.push(new Fish(200, 200, f, t));
  }
}

//Color background and
function draw() {
  background("darkblue");
  // Update and display each fish
  for (let i = 0; i < fishies.length; i = i + 1) {
    fishies[i].display();
  }

  //**CLICK ON THE MOUSE**//
 
  //MousePressed is used two ways. first way is when we press the mouse the image in preload pops up and stops screen using Darla. The second mousePressed action is that after clicking the mouse more fish appear
  if (mouseIsPressed) {
    image(girl, 0, 0, windowWidth, windowHeight);
    let f = random(-2, 2);
    let t = random(-2, 2);

    fishies.push(new Fish(mouseX, mouseY, f, t));
  }
}
// x, y: starting position | xs, ys: speed along each axis
class Fish {
  constructor(x, y, xs, ys) {
    this.x = x;
    this.y = y;
    this.xs = xs;
    this.ys = ys;
  }
  //Moves the fish and draws it; called every frame from draw()
  display() {
    // Move the fish by its speed values
    this.x = this.x + this.xs;
    this.y = this.y + this.ys;
    // If the fish hits the left or right edge frame, reverse horizontal direction
    if (this.x < 0 || this.x > width) {
      this.xs = this.xs * -1; // flipping the direction on the x axis when it hits the left edge or the right edge of the canvas
    }
    //same as above but now for the height
    if (this.y < 0 || this.y > height) {
      this.ys = this.ys * -1;
    }

    if (this.xs < 0) {
      image(fishyImg, this.x, this.y, 50, 50);
    } else {
      image(twinfishImg, this.x, this.y, 50, 50);
    }
  }
}
