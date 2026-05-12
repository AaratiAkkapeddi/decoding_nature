let sunColor = 255;
let sunDirection = -0.5;

let flock = [];
let birdImg;
let logoImg;

let wind = 0;

function preload() {
  birdImg = loadImage("Sparrow - 03.24.2026.png");
  logoImg = loadImage("LCH_Monogram_Logo_ 2026.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  for (let i = 0; i < 80; i++) {
    flock.push(new Bird());
  }
}

function draw() {
  background(135, 206, 235);

  // GLOBAL WIND (shared by everything)
  wind = map(noise(frameCount * 0.01), 0, 1, -0.1, 0.2);

  // Sun pulsing
  sunColor += sunDirection;
  if (sunColor <= 150 || sunColor >= 255) {
    sunDirection *= -1;
  }

  // Ground
  noStroke();
  fill(80, 180, 80);
  rect(0, height * 0.7, width, height * 0.3);

  // Sun (size fits logo exactly)
  let sunSize = map(sunColor, 150, 255, 110, 140);

  fill(sunColor, sunColor - 35, 100);
  ellipse(width - 100, 100, sunSize, sunSize);

  //  Logo perfectly aligned with sun
  imageMode(CENTER);
  image(logoImg, width - 100, height - 100, sunSize, sunSize);

  // Clouds move with wind
  let cloudOffset = frameCount * wind * 4;

  fill(200, 200, 300);
  ellipse(90 + cloudOffset, 0, 180, 140);
  ellipse(200 + cloudOffset, 20, 180, 150);
  ellipse(300 + cloudOffset, 20, 150, 95);
  ellipse(500 + cloudOffset, 0, 180, 140);
  ellipse(600 + cloudOffset, 20, 180, 95);

  // Tree
  drawBranch(width/2, height * 0.7, -PI / 2, 100);

  //  Birds
  for (let bird of flock) {
    bird.flock(flock);
    bird.update();
    bird.edges();
    bird.show();
  }
}

//  TREE
function drawBranch(x, y, angle, length) {
  let x2 = x + cos(angle) * length;
  let y2 = y + sin(angle) * length;

  stroke(80, 50, 20);
  strokeWeight(map(length, 10, 100, 1, 8));
  line(x, y, x2, y2);

  if (length > 10) {
    //  Wind-based sway (tips move more)
    let sway = wind * map(length, 10, 100, 0.5, 1.5);

    drawBranch(x2, y2, angle - 0.3 + sway, length * 0.7);
    drawBranch(x2, y2, angle + 0.3 + sway, length * 0.7);
  } else {
    drawBlossom(x2, y2);
  }
}

function drawBlossom(x, y) {
  noStroke();

  let r = map(mouseX, 0, width, 200, 255);
  let g = map(mouseY, 0, height, 100, 200);
  let b = map(mouseX, 0, width, 150, 255);

  fill(r, g, b, 200);

  for (let i = 0; i < 5; i++) {
    ellipse(x + random(-5, 5), y + random(-5, 5), 8, 8);
  }
}

function mousePressed() {
  drawBranch(mouseX, mouseY, -PI / 2, 100);
}

//  BIRDS
class Bird {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(1.5, 3));
    this.acceleration = createVector();

    this.maxForce = 0.05;
    this.maxSpeed = 3;
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }

  align(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }

    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }

    if (mouseIsPressed) {
      this.position.x = mouseX;
      this.position.y = mouseY;
    }

    return steering;
  }

  separation(boids) {
    let perceptionRadius = 40;
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }

    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(1.0);
    cohesion.mult(0.8);
    separation.mult(1.8);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);

    this.velocity.add(this.acceleration);

    //  Wind influence
    this.velocity.x += wind * 0.2;

    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    let angle = this.velocity.heading();

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    imageMode(CENTER);
    image(birdImg, 0, 0, 40, 40);

    pop();
  }
}
