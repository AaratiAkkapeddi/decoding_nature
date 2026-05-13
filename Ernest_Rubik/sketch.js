let cube = [];
let colorsList;

let cubeSize = 16;
let spacing = 22;

let rotX = 0;
let rotY = 0;

let cubeX = 0;
let cubeY = 0;

let clickCount = 0;

let animating = false;
let revealIndex = 0;

let revealPositions = [];
let revealColor;
let revealFace;

function setup(){

createCanvas(windowWidth,windowHeight,WEBGL);

colorsList = [
color(255,0,0),
color(255,165,0),
color(255,255,0),
color(0,155,72),
color(0,70,173),
color(255)
];

generateCube();

}

function draw(){

background(0); // BLACK BACKGROUND

lights();

cubeX = lerp(cubeX, mouseX-width/2, 0.08);
cubeY = lerp(cubeY, mouseY-height/2, 0.08);

translate(cubeX,cubeY);

rotateX(rotX);
rotateY(rotY);

rotX += .01;
rotY += .012;

drawCube();

if(animating && frameCount % 10 === 0){

revealNextCube();

}

}

function generateCube(){

cube = [];

for(let x=0;x<3;x++){

cube[x] = [];

for(let y=0;y<3;y++){

cube[x][y] = [];

for(let z=0;z<3;z++){

cube[x][y][z] = random(colorsList);

}

}

}

}

function drawCube(){

for(let x=0;x<3;x++){

for(let y=0;y<3;y++){

for(let z=0;z<3;z++){

push();

translate(
(x-1)*spacing,
(y-1)*spacing,
(z-1)*spacing
);

fill(cube[x][y][z]);

stroke(255); // WHITE EDGES
strokeWeight(2);

box(cubeSize);

pop();

}

}

}

}

function mousePressed(){

clickCount++;

if(clickCount % 9 === 0){

startEReveal();

}else{

generateCube();

}

}

function startEReveal(){

generateCube();

revealColor = random(colorsList);

revealFace = floor(random(6));

revealIndex = 0;

animating = true;

let pattern = [
[1,1,1],
[1,1,0],
[1,1,1]
];

revealPositions = [];

for(let x=0;x<3;x++){

for(let y=0;y<3;y++){

if(pattern[y][x] === 1){

revealPositions.push([x,y]);

}

}

}

}

function revealNextCube(){

if(revealIndex >= revealPositions.length){

animating = false;
return;

}

let pos = revealPositions[revealIndex];

let x = pos[0];
let y = pos[1];

if(revealFace === 0) cube[x][y][2] = revealColor;
if(revealFace === 1) cube[x][y][0] = revealColor;
if(revealFace === 2) cube[0][x][y] = revealColor;
if(revealFace === 3) cube[2][x][y] = revealColor;
if(revealFace === 4) cube[x][0][y] = revealColor;
if(revealFace === 5) cube[x][2][y] = revealColor;

revealIndex++;

}