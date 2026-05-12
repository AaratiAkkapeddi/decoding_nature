function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background("wheat");
 
  let d = map(mouseX, 0, width, 0, 2);//number you want to change, minuim and max of that number, min and max of the range you want to translate it to. 

  translate(width/2, height/2);
  scale(d);
  
  for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36);
fill('mediumseagreen')
    circle(100, 100, 100);
    pop();
  }
  for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36);
fill('pink')
    circle(80, 80, 80);
    pop();
  }
  for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36); 
fill('lightblue')
    circle(50, 50, 50);
    pop();
  }
  for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36);
fill('lightseagreen')
    circle(30, 30, 30);
    pop();
  }

  for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36);
fill('steelblue')
    circle(20, 20, 20);
    pop();
  }
  for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36); 
    fill('rgb(68,68,170)')
    circle(15, 15, 15);
    pop();
  }
  for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36); 
    fill("mediumseagreen")
    circle(100, 10, 10);
    pop();
  }
  
    for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36); 
    fill("green")
    circle(190, 10, 10);
    pop();
  }
  
  for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36); 
    fill("rgb(235,165,142)")
    circle(15, 5, 10);
    pop();
  }
    for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36); 
    fill("rgb(235,165,142)")
    circle(40, 40, 5);
    pop();
  }
      for (let i = 0; i < 10; i++) {
    push();
    rotate(i * 36); 
    fill("rgb(235,165,142)")
    circle(60, 40, 10);
    pop();
  }
}
