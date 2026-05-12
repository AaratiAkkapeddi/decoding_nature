function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  // Dark galaxy background
  background(19, 24, 98);
  
  // 1. SCROLLING STARS (Behind the ellipse)
  randomSeed(99); 
  noStroke();
  fill(255, 255, 200, 180); 
  
  let scrollSpeed = 10; 

  for(let i = 0; i < 100; i++){
    // Calculate scrolling X position
    // (Initial random X + movement) % canvas width creates the horizontal loop
    let x =(random(width + frameCount * scrollSpeed) % width);
    //Calclulate scrolling X position with modulo to loop it
    // Renamed size to starSize to avoid function name conflicts
    let starSize = random(1, 3);
    // Calculate scrolling Y position with modulo to loop it
    let y = random(height);
    //(random(height) + frameCount * scrollSpeed) % height;
    
    ellipse(x, y, starSize, starSize);
  }
  
  // 2.  ELLIPSE
  for(let i = 0; i < 100; i++){
    // Dark gray gradient with transparency
    fill(20 + (i * 15), 150); 
    ellipse(i * 50, 200, 50, 50);
  }
}