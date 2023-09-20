var canvas =document.getElementById('mygame');
var ctx= canvas.getContext("2d");
var score=0, highscore=0, frameNum=0, holeframe=150;
var obstacles=[];
var alive=true;
//player
var block={
    x:50,
    y:320,
    side:50,
    color:"blue",
    drawBlock: function(){ 
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.side,this.side);}
}
//boundary
var component={
    x:0,
    y:0,
    w:800,
    h:70,
    color:'black',
    drawBound: function(){
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.fillRect(this.x,this.y+370,this.w,this.h);
    }
}
//obstacle or holes
class hole {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.draw = function () {
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
function crash(){
    this.crash=function(ob){
        if((ob.x>0 && ob.x<100 && ob.y==0 && block.y==70)||(ob.x>0 && ob.x<100 && ob.y==370 && block.y==320)){
            return true;
        }
    }
}
function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    frameNum++;
    block.drawBlock();
    component.drawBound();
    
    for (i = 0; i < obstacles.length; i += 1) {
        if (crash(obstacles[i])) {
            //console.log(alive);
            alive=false;
        }
    }
    if(frameNum==1 || (frameNum/holeframe)%1==0){
        var pos=Math.round(Math.random());
        //console.log(pos);
        obstacles.push(new hole(800,pos));
    }
    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -2.5;
        obstacles[i].draw();
    }
        //calculate score
        score++;
        //Collision Detection
        document.getElementById('score').textContent="Score: "+score;
        if(!alive){   
            document.getElementById('gameover').play();      
            document.getElementById('overlay').style.display="block";
            document.getElementById('urscore').textContent='Score: '+score;
        
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
        //console.log('ur score:',score);
        //console.log('urhighscore:',localStorage.getItem('hscore'));
    }
    else{
    requestAnimationFrame(update);
    }
}
document.getElementById('highscore').textContent='HighScore: '+localStorage.getItem('hscore');
requestAnimationFrame(update);

//event listeners
canvas.addEventListener('click',function(e){
    //console.log('click');
    if(block.y===320){
        document.getElementById("jump").play();
        block.y=70;
    }
    else{
        document.getElementById("jump").play();
        block.y=320;
    }
});
document.addEventListener('keyup',function(e){
    if(e.code==='Space'){
        //console.log('space');
        if(block.y===320){
            document.getElementById("jump").play();
            block.y=70;
        }
        else{
            document.getElementById("jump").play();
            block.y=320;
        }
    }
});