// Player.js
function Player(game, image)
{
    this.x = 1;
    this.y = 1;
    this.width = 16;
    this.height = 24;
    
    this.currentFrame = 0;
    this.animationOffsets = { 
        "up": [12, 2],
        "right": [68, 2],
        "down":[123, 2],
        "left":[179, 2],
        "death":[152, 177],
    };
    this.currentAnimation = "down";
    this.idle = true; //  used when idleing to play only the first animation

    this.image = new Image();
    this.image.src = image;

    this.lastUpdated = 0;
    this.speed = 32; // Move one tile at a time

    this.alive = true;
    this.bombCooldown = 3000;
    this.movementCooldown = 350; // How long before you're allowed to move again
    this.lastMoved = 0;

    // references to game objects
    this.game = game;
    this.map = game.map;
    this.objects = game.objects;
    this.keyboard = game.keyboard;
    this.cxt = game.cxt;
}
Player.prototype.getPosition = function()
{
    return {x: ~~(this.x + this.width/2), y: ~~(this.y + this.height/2)};
}
Player.prototype.update = function(dt)
{
    // Player is dead, play death animation
    if(!this.alive)
    {
        this.cxt.drawImage(this.image, 
                this.animationOffsets["death"][0] + (this.width * this.currentFrame + (this.currentFrame*3)), this.animationOffsets["death"][1], 
                this.width, this.height,
                this.x, this.y, this.width, this.height);
        if (this.currentFrame <= 4)
            this.lastUpdated+=dt;
        if(this.lastUpdated >= 200)
        {
            this.currentFrame++;
            this.lastUpdated = 0;
        }   
        return;
    }
    // Movement + Related Animations
    if(this.lastMoved > this.movementCooldown && 
        (this.keyboard[37] || this.keyboard[65]))
    {
        if(this.map.getTile(this.x-this.speed,this.y)==0)
        {
            this.x -= this.speed;
            this.lastMoved = 0;
        }
        if(this.currentAnimation!="left")
        {
            this.idle = false;
            this.currentAnimation = "left";
            this.currentFrame, this.lastUpdated = 0;
        }
    }
    else if(this.lastMoved > this.movementCooldown && 
        (this.keyboard[39] || this.keyboard[68]))
    {
        if(this.map.getTile(this.x+this.speed, this.y)==0)
        {
            this.x += this.speed;
            this.lastMoved = 0;
        }
        if(this.currentAnimation!="right")
        {
            this.idle = false;
            this.currentAnimation = "right";
            this.currentFrame, this.lastUpdated = 0;
        }
    }
    else if(this.lastMoved > this.movementCooldown && 
        (this.keyboard[38] || this.keyboard[87]))
    {
        if(this.map.getTile(this.x, this.y-this.speed)==0)
        {
            this.y -= this.speed;
            this.lastMoved = 0;
        }
        if(this.currentAnimation!="up")
        {
            this.idle = false;
            this.currentAnimation = "up";
            this.currentFrame, this.lastUpdated = 0;
        }
    }
    else if(this.lastMoved > this.movementCooldown && 
        (this.keyboard[40] || this.keyboard[83]))
    {
        if(this.map.getTile(this.x, this.y + this.speed)==0)
        {
            this.y += this.speed;
            this.lastMoved = 0;
        }

        if(this.currentAnimation!="down")
        {
            this.idle = false;
            this.currentAnimation = "down";
            this.currentFrame, this.lastUpdated = 0;
        }
    }
    else
    {
        this.lastMoved += dt;
        this.idle = true;
        this.currentFrame = 0;
    }
    // Drop the Bomb
    if(this.keyboard[32] && this.bombCooldown >= 2000) //DROP THE BOMB
    {
        this.bombCooldown = 0;
        //  check if player is dropping a bomb on a blocked tile, if they are the bomb spawns ontop of him
        switch(this.currentAnimation)
        {
            case "left":
                if(this.map.getTile(this.x-33, this.y)==0)
                {
                    this.objects.push(new Bomb(this.x-33, this.y, this.game));
                }
                else
                {
                    this.objects.push(new Bomb(this.x, this.y, this.game));
                }
            break;
            case "right":
                if(this.map.getTile(this.x+33, this.y)==0)
                {
                    this.objects.push(new Bomb(this.x+33, this.y, this.game));
                }
                else
                {
                    this.objects.push(new Bomb(this.x, this.y, this.game));
                }
            break;
            case "up":
                if(this.map.getTile(this.x, this.y-33)==0)
                {
                    this.objects.push(new Bomb(this.x, this.y-33, this.game));
                }
                else
                {
                    this.objects.push(new Bomb(this.x, this.y, this.game));
                }
            break;
            case "down":
                if(this.map.getTile(this.x, this.y+33)==0)
                {
                    this.objects.push(new Bomb(this.x, this.y+32, this.game));
                }
                else
                {
                    this.objects.push(new Bomb(this.x, this.y, this.game));
                }
            break;
        }
    }
    this.cxt.drawImage(this.image, 
        this.animationOffsets[this.currentAnimation][0] + (this.width * this.currentFrame + (this.currentFrame*3)), this.animationOffsets[this.currentAnimation][1], 
        this.width, this.height,
        this.x, this.y, this.width, this.height);
    this.lastUpdated+= dt;
    this.bombCooldown+= dt;
    var pos = this.getPosition();
    var tilePos = this.map.getTileIndex(pos.x, pos.y);

    this.cxt.strokeStyle = "yellow";
    this.cxt.strokeRect(tilePos[1] * 32, tilePos[0]* 32, 32, 32);
    if(this.lastUpdated>=100 && !this.idle)
    {
        this.lastUpdated = 0;
        this.currentFrame = (this.currentFrame + 1)%3;

    }   
}