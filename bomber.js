var cxt;
var bombImage = new Image(); //making this global T_T
var explodeImage = new Image(); //and this too :( 

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
function Bomb(x, y)
{
	this.x = x;
	this.y = y;
	this.lifetime = 3;
	this.currentFrame = 0;
	this.animationOffsets = [0, 16, 32],
	this.width = 13,
	this.height = 23,
	this.ticks = 0;
	this.power = 2;
	this.done = false;
	this.update = function()
	{
		this.ticks++;
		if(this.lifetime <= 0)
		{
			this.done = true;
			explode(this.x, this.y, this.power);
		}
		if(this.ticks==60) //60 ticks per second (FPS)
		{
			this.ticks = 0;
			this.lifetime--;
			this.currentFrame++;
		}
		cxt.drawImage(bombImage,
		this.animationOffsets[this.currentFrame], 0, this.width, this.height,
		this.x, this.y, this.width, this.height);
	}
}
function Explosion(x, y)
{
	this.x = x;
	this.y = y;
	this.currentFrame = 0;
	this.animationOffsets = [0, 34, 63, 98],
	this.width = 26,
	this.height = 27,
	this.ticks = 0;
	this.power = 2; //could be used for damage ?
	this.done = false;
	this.update = function()
	{
		this.ticks++;
		if(this.currentFrame==0)
		{
			var pos = map.getTileIndex(this.x, this.y);
			var playa = map.getTileIndex(player.x, player.y);
							console.log(pos);
				console.log(playa);
			if(pos[0]==playa[0] && pos[1]==playa[1])
			{
				player.ticks, player.currentFrame = 0;
				player.alive = false;
			}
		}
		if(this.ticks==10) //60 ticks per second (FPS)
		{
			if(this.currentFrame ==this.animationOffsets.length)
				this.done = true;
			else
			{
				this.ticks = 0;
				this.currentFrame++;
			}
		}
		cxt.drawImage(explodeImage,
		this.animationOffsets[this.currentFrame], 0, this.width, this.height,
		this.x, this.y, this.width, this.height);
	}
}
var objects = [];
//power will be used later, right now its hardcoded to 2
function explode(x, y, power)
{	
	var mapIndex = map.getTileIndex(x, y);
	var tx = mapIndex[1];
	var ty = mapIndex[0];
	map.tiles[ty][tx] = 0;
	objects.push(new Explosion(tx*32, ty*32));
	//Check to the left and "blow tiles up"
	if(tx-1 >= 0)
	{
		map.tiles[ty][tx-1] = 0;
		objects.push(new Explosion((tx-1)*32, ty*32));
		if(tx-2 >=0)
		{
			map.tiles[ty][tx-2] = 0;
			objects.push(new Explosion((tx-2)*32, ty*32));
		}
	}
	//now to the right...
	if(tx+1 <= map.tiles[0].length)
	{
		map.tiles[ty][tx+1] = 0;
		objects.push(new Explosion((tx+1)*32, ty*32));
		if(tx+2 <=map.tiles[0].length)
		{
			map.tiles[ty][tx+2] = 0;
			objects.push(new Explosion((tx+2)*32, ty*32));
		}
	}
	//above
	if(ty-1 >= 0)
	{
		map.tiles[ty-1][tx] = 0;
		objects.push(new Explosion(tx*32, (ty-1)*32));
		if(ty-2 >=0)
		{
			map.tiles[ty-2][tx] = 0;
			objects.push(new Explosion(tx*32, (ty-2)*32));
		}
	}
	//below
	if(ty+1 <= map.tiles.length-1)
	{
		map.tiles[ty+1][tx] = 0;
		objects.push(new Explosion(tx*32, (ty+1)*32));
		if(ty+2 <=map.tiles.length-1)
		{
			map.tiles [ty+2][tx] = 0;
			objects.push(new Explosion(tx*32, (ty+2)*32));
		}
	}
}
var player = {
	x: 1,
	y: 1,
	width: 15,
	height: 24,
	currentFrame: 0,
	animationOffsets: { "up": [12, 2], "right": [68, 2], "down":[123, 2], "left":[179, 2], "death":[152, 177]},
	currentAnimation: "down",
	stand: true, //used when standing to play only the first animation
	image: new Image(),
	tick: 0,
	speed: 1,
	alive:true,
	bombCooldown: 3001,
	update: function()
	{
		if(!this.alive)
		{
			
			cxt.drawImage(player.image, 
				player.animationOffsets["death"][0] + (player.width * player.currentFrame + (player.currentFrame*3)), player.animationOffsets["death"][1], 
				player.width, player.height,
				player.x, player.y, player.width, player.height);
			if (player.currentFrame < 4)
				this.tick++;
			if(this.tick>=15)
			{
				player.currentFrame++;
				this.tick = 0;
			}	
			return;
		}
		if(keyboard[37] || keyboard[65])
		{
			if(player.x > 0 && map.getTile(player.x-this.speed, player.y)==0)
				player.x -= this.speed;
			if(player.currentAnimation!="left")
			{
				stand = false;
				player.currentAnimation = "left";
				player.currentFrame, tick = 0;
			}
		}
		else if(keyboard[39] || keyboard[68])
		{
			if(player.x+player.width+3 <= (map.tiles[0].length)*map.width && 
			map.getTile(player.x+player.width+this.speed+3, player.y)==0)
				player.x+=this.speed;
			if(player.currentAnimation!="right")
			{
				stand = false;
				player.currentAnimation = "right";
				player.currentFrame, tick = 0;
			}
		}
		else if(keyboard[38] || keyboard[87])
		{
			if(player.y > 0 && map.getTile(player.x, player.y-this.speed)==0)
				player.y -= this.speed;
			if(player.currentAnimation!="up")
			{
				stand = false;
				player.currentAnimation = "up";
				player.currentFrame, tick = 0;
			}
		}
		else if(keyboard[40] || keyboard[83])
		{
			if(player.y+player.height < (map.tiles.length)*map.height && 
			map.getTile(player.x, player.y + this.speed + player.height)==0)
				player.y += this.speed;
			if(player.currentAnimation!="down")
			{
				stand = false;
				player.currentAnimation = "down";
				player.currentFrame, tick = 0;
			}
		}
		else
		{
			stand = true;
			player.currentFrame = 0;
		}
		if(keyboard[32] && this.bombCooldown > 180) //DROP THE BOMB
		{
			this.bombCooldown = 0;
			//check if player is dropping a bomb on a blocker, if they are the bomb spawns ontop of him
			switch(player.currentAnimation)
			{
				case "left":
					if(map.getTile(this.x-33, this.y)==0)
					{
						objects.push(new Bomb(this.x-33, this.y, 2));
					}
					else
					{
						objects.push(new Bomb(this.x, this.y, 2));
					}
				break;
				case "right":
					if(map.getTile(this.x+33, this.y)==0)
					{
						objects.push(new Bomb(this.x+33, this.y, 2));
					}
					else
					{
						objects.push(new Bomb(this.x, this.y, 2));
					}
				break;
				case "up":
					if(map.getTile(this.x, this.y-33)==0)
					{
						objects.push(new Bomb(this.x, this.y-33, 2));
					}
					else
					{
						objects.push(new Bomb(this.x, this.y, 2));
					}
				break;
				case "down":
					if(map.getTile(this.x, this.y+33)==0)
					{
						objects.push(new Bomb(this.x, this.y+33, 2));
					}
					else
					{
						objects.push(new Bomb(this.x, this.y, 2));
					}
				break;
			}
		}
		cxt.drawImage(player.image, 
			player.animationOffsets[player.currentAnimation][0] + (player.width * player.currentFrame + (player.currentFrame*3)), player.animationOffsets[player.currentAnimation][1], 
			player.width, player.height,
			player.x, player.y, player.width, player.height);
		this.ticks++;
		this.bombCooldown++;
		if(this.ticks==10 && !stand)
		{
			this.ticks = 0;
			player.currentFrame = (player.currentFrame + 1)%3;

		}	
	},
	
};
var map = {
	tileImages: [new Image(), new Image()],
	width: 32,
	height: 32,
	tiles: [ [0, 0, 0, 1, 1, 0, 0, 0],
		 [0, 0, 1, 1, 1, 1, 1, 0],
		 [1, 1, 1, 1, 1, 1, 1, 0],
		 [1, 1, 1, 0, 0, 1, 1, 0],
		 [0, 0, 1, 1, 1, 1, 1, 0],
		 [0, 0, 0, 1, 1, 0, 0, 0]],
	update: function()
	{
		for(var y = 0; y < this.tiles.length; y++)
			for(var x = 0; x< this.tiles[y].length; x++)
			{
				cxt.drawImage(this.tileImages[this.tiles[y][x]],x*this.width, y*this.height);
			}
	},
	getTileIndex: function(x, y) //Returns the index in the tiles array
	{
		if(x==0)
			x+=1;
		if(y==0)
			y+=1;
		//console.log(Math.ceil(y/32)-1 + " " +Math.ceil(x/32)-1);
		return [Math.ceil(y/32)-1, Math.ceil(x/32)-1];
	},
	getTile: function(x, y) //returns the actual tile value
	{	if(x==0)
			x+=1;
		if(y==0)
			y+=1;
		return this.tiles[Math.ceil(y/32)-1][Math.ceil(x/32)-1];
	}
};
var keyboard = { };
function init()
{
	var canvas = document.getElementById("canvas");
	cxt = canvas.getContext("2d");
	player.image.src = "img/Bomberman.gif",
	map.tileImages[0].src = "img/wood.png";
	map.tileImages[1].src = "img/stone.png";
	bombImage.src = "img/bomb.png";
	explodeImage.src = "img/explosions.png";
	attachEvent(document, "keydown", function(e) {
		keyboard[e.keyCode] = true;
	});
	attachEvent(document, "keyup", function(e) {
		keyboard[e.keyCode] = false;
	});
	document.body.onmouseup = function(e) 
	{
		console.log(map.getTileIndex(e.x, e.y));
	}
}
var tick = 0;
function draw()
{
	window.requestAnimFrame(draw);
	cxt.clearRect(0,0,canvas.width,canvas.height);
	map.update();
	player.update();
	for(var i = 0; i<objects.length; i++)
	{
		objects[i].update();
		if(objects[i].done)
		{
			objects.splice(i, 1);
		}
	}
}
window.onload = function(){
	init();
	window.requestAnimFrame(draw);
}
//Input functions taken from http://hudson.joshy.org:9001/job/canvas-book/ws/out/chapter05.html
function attachEvent(node,name,func) {
    if(node.addEventListener) {
        node.addEventListener(name,func,false);
    } else if(node.attachEvent) {
        node.attachEvent(name,func);
    }
};