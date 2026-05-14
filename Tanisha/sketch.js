let birdImg;
let birdLeftImg;

let birds = [];

let o = 500/150+120;
function preload(){
  birdImg = loadImage('colorful bird.gif');
  birdLeftImg = loadImage('colorful bird-1.gif');
  
}

function setup() {
  if(window.innerWidth < 768){
createCanvas(windowWidth, windowHeight * 0.65);
  }else{
createCanvas(windowWidth, windowHeight);
  }  
  for(let i = 0; i < 10; i= i + 1){
    
    let t = random(0,4);
    let b = random(0,4);
    
    birds.push(new Bird(1200,200,t,b-90));
    
  }
  
}

function draw() {
  background(o*2,155,65,4);
  
  for(let i = 0; i < birds.length; i = i + 1){
    
    birds[i].display();
  }
    if(mouseIsPressed){
      let t = random(4,4);
      let b = random(4,-4);
      
      birds.push(new Bird(mouseX,mouseY,t,b));
      
      
    }
  
}
  
  class Bird {
    
    constructor(x,y,xs,ys){
      
      this.x=x;
      this.y=y;
      this.xs=xs;
      this.ys=ys;
       }
    
    display(){
      
    this.x=this.x-this.xs;
  this.y= this.y-this.ys;
  
  
    if (this.x<-680 || this.x > width) {
      this.xs=this.xs*800;
    }
    
    if(this.y<0 || this.y > height){
      this.ys=this.ys*800;
      
    }
      if(window.innerWidth <768){
 if(this.xs<0){
      image(birdImg,this.x,this.y, 200, 200);
    }else{
      image(birdLeftImg,this.x,this.y, 200, 200);
      
    }
      }else{
 if(this.xs<0){
      image(birdImg,this.x,this.y);
    }else{
      image(birdLeftImg,this.x,this.y);
      
    }
      }
   
      
    }
    
    
  }