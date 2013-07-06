var cxt;
var bombImage = new Image(); //making this global T_T
var explodeImage = new Image(); //and this too :( 
var objects = [];
var tick = 0;

// shim layer with setTimeout fallback 
window.requestAnimFrame = (function(){ 
  return  window.requestAnimationFrame       ||  
          window.webkitRequestAnimationFrame ||  
          window.mozRequestAnimationFrame    ||  
          window.oRequestAnimationFrame      ||  
          window.msRequestAnimationFrame     ||  
          function( callback ){ 
            window.setTimeout(callback, 1000 / 60); 
          }; 
})();

function BomberDan()
{
	this.canvas = document.getElementById("canvas");
	this.cxt = canvas.getContext("2d");

	this.bombImage = new Image();
	this.explodeImage = new Image();

	this.bombImage.src = "img/bomb.png";
	this.explodeImage.src = "img/explosions.png";
	
	this.objects = [];
	this.keyboard = {};

	this.player = new Player(this, "img/Bomberman.gif");
	this.map = new Map(this);

	attachEvent(document, "keydown", function(e) {
		this.keyboard[e.keyCode] = true;
	});
	attachEvent(document, "keyup", function(e) {
		this.keyboard[e.keyCode] = false;
	});
}

//  Power will be used later, right now its hardcoded to 2
BomberDan.prototype.explode = function(x, y, power)
{	
	var mapIndex = this.map.getTileIndex(x, y);
	var tx = mapIndex[1];
	var ty = mapIndex[0];
	this.map.tiles[ty][tx] = 0;
	
	this.objects.push(new Explosion(tx*32, ty*32, this));
	//  Check to the left and "blow tiles up"
	if(tx-1 >= 0)
	{
		this.map.tiles[ty][tx-1] = 0;
		this.objects.push(new Explosion((tx-1)*32, ty*32, this));
		if(tx-2 >=0)
		{
			this.map.tiles[ty][tx-2] = 0;
			this.objects.push(new Explosion((tx-2)*32, ty*32, this));
		}
	}
	//  now to the right...
	if(tx+1 <= this.map.tiles[0].length)
	{
		this.map.tiles[ty][tx+1] = 0;
		this.objects.push(new Explosion((tx+1)*32, ty*32, this));
		if(tx+2 <= this.map.tiles[0].length)
		{
			this.map.tiles[ty][tx+2] = 0;
			this.objects.push(new Explosion((tx+2)*32, ty*32, this));
		}
	}
	//  above
	if(ty-1 >= 0)
	{
		this.map.tiles[ty-1][tx] = 0;
		this.objects.push(new Explosion(tx*32, (ty-1)*32, this));
		if(ty-2 >=0)
		{
			this.map.tiles[ty-2][tx] = 0;
			this.objects.push(new Explosion(tx*32, (ty-2)*32, this));
		}
	}
	//  below
	if(ty+1 <= this.map.tiles.length-1)
	{
		this.map.tiles[ty+1][tx] = 0;
		this.objects.push(new Explosion(tx*32, (ty+1)*32, this));
		if(ty+2 <= this.map.tiles.length-1)
		{
			this.map.tiles [ty+2][tx] = 0;
			this.objects.push(new Explosion(tx*32, (ty+2)*32, this));
		}
	}
}
BomberDan.prototype.draw = function()
{
	window.requestAnimFrame(this.draw);
	this.cxt.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.map.update();
	this.player.update();
	for(var i = this.objects.length - 1; i > 0; i--)
	{
		this.objects[i].update();
		if(this.objects[i].done)
		{
			this.objects.splice(i, 1);
		}
	}
}

window.onload = function(){
	var game = new BomberDan();
	window.requestAnimFrame(game.draw);
	document.body.onmouseup = function(e) 
	{
		console.log(Game.map.getTileIndex(e.x, e.y));
	};
}
//Input functions taken from http://hudson.joshy.org:9001/job/canvas-book/ws/out/chapter05.html
function attachEvent(node,name,func) {
    if(node.addEventListener) {
        node.addEventListener(name,func,false);
    } else if(node.attachEvent) {
        node.attachEvent(name,func);
    }
};