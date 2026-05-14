function setup() {

    if(window.innerWidth < 768){
createCanvas(windowWidth, windowHeight * 0.65, WEBGL);
  }else{
createCanvas(windowWidth, windowHeight, WEBGL);
  }
}

function draw() {
  background(50, 104, 298);
  orbitControl(); // Enable mouse control
  
  // Use mouse position to control the overall rotation
  // Map mouseX from (0 to width) to a rotation range (-PI to PI)
  // let rotY = map(mouseX, 0, width, -PI, PI);
  // let rotX = map(mouseY, 0, height, -PI, PI);
  
 // rotateY(rotY);
 // rotateX(rotX);

  // Dome
  push();
  noFill();
  stroke(0);
  // Draw only the upper half of a sphere to look like a dome
  rotateX(PI); // Adjust orientation if needed
  sphere(150, 24, 16); 
  pop();

  // Shapes
  push();
  fill(255, 0, 0);
  noStroke();
  translate(0, 0, 0); // Position inside
  box(50); // Central shape
  pop();
  
  push();
  fill(0, 0, 255);
  translate(50, 50, 50);
  sphere(20); // Another one inside
  pop();
  
  //  Pyramid
  // cone() with 4 sides
  // push();
  // translate(-60, 50, 0); // Move it left and down
  // fill('sandybrown');
  // stroke(0);
  // cone(radius, height, detailX)
  // cone(40, 80, 4); 
  // pop();

  // Diamond
  // Place two cones base-to-base
  // push();
  // translate(60, 20, 0); // Move right
  // rotateY(frameCount * 0.02); // Make it spin
  // fill('cyan');
  // stroke(255);
  // Top cone
  // cone(30, 40, 4);
  // Bottom cone (flipped)
  // rotateX(PI);
  // cone(30, 40, 4);
  // pop();  
}