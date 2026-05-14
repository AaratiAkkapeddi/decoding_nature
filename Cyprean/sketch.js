let angle = 25;
let rootAngle = 30;

function setup() {
  if(window.innerWidth < 768){
createCanvas(windowWidth, windowHeight * 0.65);
  }else{
createCanvas(windowWidth, windowHeight);
  }
  

  angleMode(DEGREES);
  noLoop();
}

function draw() {
  background(213, 225, 244);

  angle = map(width, 400, 2000, 15, 45, true);
  rootAngle = map(width, 400, 2000, 20, 50, true);

  translate(width / 2, height / 1.4);

  push();
  stroke(68, 46, 9);

   if(window.innerWidth < 768){
  branch(height * 0.10);
  }else{
  branch(height * 0.12);
  }


  pop();

  push();
  stroke(68, 46, 9);
    if(window.innerWidth < 768){
  rootSystem(height * 0.07);
  }else{
  rootSystem(height * 0.07);
  }


  pop();

  noStroke();
  fill(54, 99, 9);
  textAlign(CENTER);
  textSize(width * 0.01 + 10);

  text("I am so “Moved” by You [the Mouse]", 0, height * 0.25);
}

function branch(len) {
  strokeWeight(map(len, 0, height * 0.16, 2, 14));

  line(0, 0, 0, -len);
  translate(0, -len);

  if (len > 4.5) {
    push();
    rotate(angle);
    branch(len * random(0.72, 0.85));

    pop();

    push();

    rotate(-angle);
    branch(len * random(0.72, 0.85));

    pop();
  } else {
    noStroke();
    fill(random(50, 100), random(150, 200), random(50, 100), 200);

    ellipse(0, 0, 4, 4);
  }
}

function rootSystem(len) {
  strokeWeight(map(len, 0, height * 0.13, 1, 20));

  line(0, 0, 0, len);

  translate(0, len);

  if (len > 11) {
    push();
    rotate(rootAngle);
    rootSystem(len * random(0.6, 0.8));
    pop();

    push();
    rotate(-rootAngle);
    rootSystem(len * random(0.6, 0.8));
    pop();
  }
}

function mouseMoved() {
  redraw();
}

function mouseClicked() {
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
