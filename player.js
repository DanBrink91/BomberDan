// Player.js
function Player(game, image)
{
    this.x = 1;
    this.y = 1;
    this.width = 15;
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
    this.stand = true; //  used when standing to play only the first animation

    this.image = new Image();
    this.image.src = image;

    this.lastUpdated = 0;
    this.speed = 1;

    this.alive = true;
    this.bombCooldown = 3001;

    // references to game objects
    this.game = game;
    this.objects = game.objects;
    this.keyboard = game.keyboard;
    this.cxt = game.cxt;
}
Player.prototype.update = function()
{
    // Player is dead, play death animation
    if(!this.alive)
    {
        this.cxt.drawImage(this.image, 
                this.animationOffsets["death"][0] + (this.width * this.currentFrame + (this.currentFrame*3)), this.animationOffsets["death"][1], 
                this.width, this.height,
                this.x, this.y, this.width, this.height);
        if (this.currentFrame < 4)
            this.lastUpdated++;
        if(this.lastUpdated>=15)
        {
            this.currentFrame++;
            this.lastUpdated = 0;
        }   
        return;
    }
    // Movement + Related Animations
    if(this.keyboard[37] || this.keyboard[65])
    {
        if(this.x > 0 && map.getTile(this.x-this.speed, this.y)==0)
            this.x -= this.speed;
        if(this.currentAnimation!="left")
        {
            this.stand = false;
            this.currentAnimation = "left";
            this.currentFrame, this.lastUpdated = 0;
        }
    }
    else if(this.keyboard[39] || this.keyboard[68])
    {
        if(this.x+this.width+3 <= (map.tiles[0].length)*map.width && 
            map.getTile(this.x+this.width+this.speed+3, this.y)==0)
            this.x+=this.speed;

        if(this.currentAnimation!="right")
        {
            this.stand = false;
            this.currentAnimation = "right";
            this.currentFrame, this.lastUpdated = 0;
        }
    }
    else if(keyboard[38] || keyboard[87])
    {
        if(this.y > 0 && map.getTile(this.x, this.y-this.speed)==0)
            this.y -= this.speed;

        if(this.currentAnimation!="up")
        {
            this.stand = false;
            this.currentAnimation = "up";
            this.currentFrame, this.lastUpdated = 0;
        }
    }
    else if(keyboard[40] || keyboard[83])
    {
        if(this.y+this.height < (map.tiles.length)*map.height && 
            map.getTile(this.x, this.y + this.speed + this.height)==0)
            this.y += this.speed;

        if(this.currentAnimation!="down")
        {
            this.stand = false;
            this.currentAnimation = "down";
            this.currentFrame, this.lastUpdated = 0;
        }
    }
    else
    {
        this.stand = true;
        this.currentFrame = 0;
    }
    // Drop the Bomb
    if(this.keyboard[32] && this.bombCooldown > 180) //DROP THE BOMB
    {
        this.bombCooldown = 0;
        //  check if player is dropping a bomb on a blocked tile, if they are the bomb spawns ontop of him
        switch(this.currentAnimation)
        {
            case "left":
                if(map.getTile(this.x-33, this.y)==0)
                {
                    this.objects.push(new Bomb(this.x-33, this.y, 2));
                }
                else
                {
                    this.objects.push(new Bomb(this.x, this.y, 2));
                }
            break;
            case "right":
                if(map.getTile(this.x+33, this.y)==0)
                {
                    this.objects.push(new Bomb(this.x+33, this.y, 2));
                }
                else
                {
                    this.objects.push(new Bomb(this.x, this.y, 2));
                }
            break;
            case "up":
                if(map.getTile(this.x, this.y-33)==0)
                {
                    this.objects.push(new Bomb(this.x, this.y-33, 2));
                }
                else
                {
                    this.objects.push(new Bomb(this.x, this.y, 2));
                }
            break;
            case "down":
                if(map.getTile(this.x, this.y+33)==0)
                {
                    this.objects.push(new Bomb(this.x, this.y+33, 2));
                }
                else
                {
                    this.objects.push(new Bomb(this.x, this.y, 2));
                }
            break;
        }
    }
    this.cxt.drawImage(this.image, 
        this.animationOffsets[this.currentAnimation][0] + (this.width * this.currentFrame + (this.currentFrame*3)), this.animationOffsets[this.currentAnimation][1], 
        this.width, this.height,
        this.x, this.y, this.width, this.height);
    this.lastUpdated++;
    this.bombCooldown++;

    if(this.lastUpdated==10 && !this.stand)
    {
        this.ticks = 0;
        this.currentFrame = (this.currentFrame + 1)%3;

    }   
}