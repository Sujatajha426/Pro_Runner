var canvas =document.getElementById('mygame');
var ctx= canvas.getContext("2d");
var score=0, highscore=0, frameNum=0, dx=2, holeframe=160, circleframe=240, powerframe=250, dxCircle=1.2;    
//holeframe and circel frame represents frame num for hole and moingcircles
//generate hole after every 160th frame and circle after 290th frame
var obstacles=[],circles=[],powerups=[];
var alive=true;

requestAnimationFrame(update);
//player
var block={
    h:320,
    y:370,
    side:50,
    color:"blue",
    drawBlock: function(){ 
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(40, this.y);
        ctx.lineTo(100, this.y);
        ctx.lineTo(70, this.h);
        ctx.fill();
       }
}
//boundary
var component={
    x:0,
    y:0,
    w:800,
    h:70,
    color:'black',
    drawBoundary: function(){
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.fillRect(this.x,this.y+370,this.w,this.h);
    }
}
//Hole obstacle
class hole {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.draw = function () {
            // ctx.fillStyle = "rgb(179,174,174)";
            ctx.fillStyle ="grey";
            if (y == 0) {
                this.y=0;
                ctx.fillRect(this.x, this.y, 70, 70);
            }
            else {
                this.y=370;
                ctx.fillRect(this.x, this.y, 70, 70);
            }
        };
    }
}
//Circular obstacle
function movingCircle(x,y){
    this.x=x;
    this.y=y;
    this.dy=1.5;
    this.circle=function(){
        ctx.fillStyle="red";
        ctx.beginPath();
        ctx.arc(this.x,this.y,25,0,(Math.PI/180)*360);
        ctx.fill();
    }
}
//Powerups
function drawpowerups(y,c){
    this.x=800;
    this.y=y;
    this.c=c;
    this.pdraw=function(){
        //console.log(this.c);
    ctx.fillStyle=this.c;
    ctx.fillRect(this.x,this.y,20,20);}
}
//Crash with hole
function crash(ob){
    if((ob.x>0 && ob.x<100 && ob.y==0 && block.y==70)||(ob.x>0 && ob.x<100 && ob.y==370 && block.y==370)){
    //console.log("Hole out");
    return true;
    }
}
//Crash with circle
function circleCrash(c){
    if((c.x>40 &&  c.x<100 && c.y>=95 && c.y<=125 &&block.y==70) || (c.x>40 &&  c.x<100 && c.y>=300 && c.y<=345 &&block.y==370)){
    // console.log("Circle out");
    return true;
    }
}

function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    frameNum++;
    block.drawBlock();
    component.drawBoundary();
    
    //chk crash with holes
    for (i = 0; i < obstacles.length; i += 1) {
        if (crash(obstacles[i])) {
            //console.log(alive);
            alive=false;
        }
    }
    //chk crash with circles
    for (i = 0; i < circles.length; i += 1) {
        if (circleCrash(circles[i])) {
            //console.log(alive);
            alive=false;
        }
    }
    //create holes
    if(frameNum==1 || (frameNum/holeframe)%1==0){     
        var pos=Math.round(Math.random());
        //console.log(pos);
        obstacles.push(new hole(800,pos));
    }
    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -dx;
        obstacles[i].draw();
    }
    //create circles
    if(frameNum==1 || (frameNum/circleframe)%1==0){
        circles.push(new movingCircle(800,300));
    }
    for (i = 0; i < circles.length; i += 1) {
        circles[i].y += -circles[i].dy;
        circles[i].x += -dxCircle;
        if(circles[i].y<95 || circles[i].y>345){
            circles[i].dy = -circles[i].dy;
        }
        circles[i].circle();
    }
    
    //create powerups
    if (score>400 && Math.random()< 0.15 && (frameNum/powerframe)%1==0) { //0.15 (15%) is probablity of genertaing powerup
        //console.log(powerups);
        var colour=['magenta','greenyellow'];
        var c=colour[Math.round(Math.random())];
        // console.log(colour[Math.round(Math.random())]);
        // console.log(typeof(colour[Math.round(Math.random())]));
        var position=Math.round(Math.random());
        if(position==1){
            powerups.push(new drawpowerups(350,c));
        }else{
            powerups.push(new drawpowerups(70,c));
        }
    }
   
    for (i = 0; i < powerups.length; i += 1) {
        //console.log(powerups);
        powerups[i].x += -2;
        powerups[i].pdraw();
        if(powerups[i].x<0){
            powerups.splice(i,1);
        }
        
    }
    for (i = 0; i < powerups.length; i += 1) {
        let p=powerups[i]
        //console.log('x position: ',p.x);
        if ((p.c=="magenta") && ((block.y==370 && p.y==350 && p.x>=40 && p.x<=100) || (block.y==70 && p.y==70 && p.x>=40 && p.x<=100))){
            //this powerup REDUCES THE SPEED (-1.5)
            //console.log('yay powerup');
            document.getElementById('power').play();
            powerups.splice(i,1);    
            dx -= 1.5;
            //console.log('dx: ',dx);
        }
        else if ((p.c=="greenyellow") && ((block.y==370 && p.y==350 && p.x>=40 && p.x<=100) || (block.y==70 && p.y==70 && p.x>=40 && p.x<=100))){
            //this INCREASES THE SCORE(20)
            //console.log('yay GREEN powerup');
            document.getElementById('power').play();
            powerups.splice(i,1);    
            score += 20;
            //console.log('score: ',score);
        }
    }
    //INCREASES SPEED WITH TIME
    if(score%400==0){
            dx +=1;
            dxCircle += 0.1;
            holeframe += -30;   //Holes will appear more frequently
            if(holeframe<60){
                holeframe=50;
            }
            circleframe +=20    //circles will appear more frequently
            if(circleframe<50){
                circleframe=50;  
            }
            //console.log("velocity increased to:  ",dx);
          }
          
    //calculate score
    score++;
    document.getElementById('score').textContent="Score: "+score;
   
        //Collision Detection
        if(!alive){
            document.getElementById('gameover').play();   
            document.getElementById('overlay').style.display="block";
            document.getElementById('urscore').textContent = 'Score:'+score;
        
  
        //retriving highscore value from local storage
        var highscore=localStorage.getItem('hscore');
        if(highscore!==null){
            if(score>highscore){
                //storing new highscore in local storage
                localStorage.setItem('hscore',score);
                document.getElementById('highscore').textContent='HighScore: '+score;
            }
        }
        else{
            localStorage.setItem('hscore',score);
            document.getElementById('highscore').textContent='HighScore: '+score;
        }
        console.log('ur score:',score);
        console.log('urhighscore:',localStorage.getItem('hscore'));
    }
    else{
    requestAnimationFrame(update);
    }
}
document.getElementById('highscore').textContent='HighScore: '+localStorage.getItem('hscore');

//event listeners
canvas.addEventListener('click',function(e){
    //console.log('click');
    if(block.y===370){
        document.getElementById("jump").play();
        block.y=70;
        block.h=120;
    }
    else{
        document.getElementById("jump").play();
        block.y=370;
        block.h=320;
    }
});
document.addEventListener('keydown',function(e){
    if(e.code=='Space'){
        if(block.y===370){
            document.getElementById("jump").play();
            block.y=70;
            block.h=120;
        }
        else{
            document.getElementById("jump").play();
            block.y=370;
            block.h=320;
        }
    }
});