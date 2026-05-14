let angle = 15;
let direction = 0.5;
let season = 0; // 0 = spring, 1 = summer, 2 = fall, 3 = winter

function setup() {
    if(window.innerWidth < 768){
createCanvas(windowWidth, windowHeight * 0.65);
  }else{
createCanvas(windowWidth, windowHeight);
  }
  angleMode(DEGREES);
  frameRate(18);
}

function draw() {
 
  if (season == 0){ 
    background(200, 230, 255);
  }else if (season == 1){ 
    background(135, 206, 235);
  }else if (season == 2){ 
    background(255, 200, 150);
  }else{ 
    background(220);
  }

  
  let sunX = width * 0.85;
  let sunY = height * 0.15;

  noStroke();

  if (season == 0) fill(200, 170, 60, 40);
  else if (season == 1) fill(255, 220, 80, 40);
  else if (season == 2) fill(255, 200, 120, 40);
  else fill(240, 240, 240, 20);
  circle(sunX, sunY, 100);

  if (season == 0) fill(200, 170, 60, 80);
  else if (season == 1) fill(255, 220, 80, 80);
  else if (season == 2) fill(255, 200, 120, 80);
  else fill(240, 240, 240, 40);
  circle(sunX, sunY, 80);

  if (season == 0) fill(200, 170, 60);
  else if (season == 1) fill(255, 220, 80);
  else if (season == 2) fill(255, 200, 120);
  else fill(240, 240, 240, 80);
  circle(sunX, sunY, 60);


  if (season == 0) {
    //birds moving downward
    for (let i = 0; i < 15; i++) {
      let movement = 1 + (i * 0.2);
      let offsetY = i * 12;

      let birdX = (frameCount * movement * 1 + i * 60);
      let birdY = height * 0.10 + offsetY;

      stroke(0);
      strokeWeight(2);
      noFill();

      arc(birdX, birdY, 9, 9, 180, 350);
      arc(birdX + 10, birdY, 9, 9, 180, 350);
    }
    //birds moving upward
    
     for (let i = 0; i < 15; i++) {
      let movement = 1 + (i * 0.2);
      let offsetY = i * 12;

      let birdX = (frameCount * movement * 1 + i * 60) ;
      let birdY = height * 0.10 - offsetY;

      stroke(0);
      strokeWeight(2);
      noFill();

      arc(birdX, birdY, 9, 9, 180, 350);
      arc(birdX + 10, birdY, 9, 9, 180, 350);
    }
  }

  translate(width / 2, height);

  angle += direction;

  if (angle >= 45 || angle <= 5) {
    direction *= -1;
  }

  if (frameCount % 180 == 0) {
    season = (season + 1);
  }
  if(season == 4){
    season = 0;
  }

  branch(120, 20);
}

function branch(len, w) {
  strokeWeight(w);
  stroke(80, 50, 20);
  line(0, 0, 0, -len);

  if (len > 7) {
    translate(0, -len);

    push();
    rotate(angle);
    branch(len * 0.8, w * 0.6);
    pop();

    push();
    rotate(-angle);
    branch(len * 0.8, w * 0.6);

    if (len < 22) {
      noStroke();

      if (season == 0) {
        fill(120, 200, 120);
        ellipse(0, 0, 5, 4);
      } else if (season == 1) {
        fill(50, 150, 50);
        ellipse(0, 0, 6, 5);
      } else if (season == 2) {
        fill(random(200, 255), random(100, 150), 0);
        ellipse(0, 0, 5, 4);
      } else if (season == 3) {
        fill(255);
        ellipse(0, 0, 3, 3);
      }
    }

    pop();
  }
}

function mouseClicked() {
  redraw();
}