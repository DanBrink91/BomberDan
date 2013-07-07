// Bomb.js
// Contains BOTH Bomb + Explosions
function Bomb(x, y, game)
{
    this.x = x;
    this.y = y;
    this.width = 15,
    this.height = 23,

    this.lifetime = 3;
    this.currentFrame = 0;
    this.animationOffsets = [0, 16, 32],

    this.timePassed = 0;
    this.power = 2;
    this.done = false;

    this.image = game.bombImage;;
    this.game = game;
    this.cxt = game.cxt;
}
Bomb.prototype.update = function(dt)
{
    this.timePassed += dt;
    if(this.lifetime <= 0)
    {
        this.done = true;
        this.game.explode(this.x, this.y, this.power);
    }
    if(this.timePassed >= 500) //  miliseconds, this number * lifetime = total time to blow up
    {
        this.timePassed = 0;
        this.lifetime--;
        this.currentFrame++;
    }
    this.cxt.drawImage(this.image,
        this.animationOffsets[this.currentFrame], 0, this.width, this.height,
        this.x, this.y, this.width, this.height);
}

function Explosion(x, y, game)
{
    this.x = x;
    this.y = y;
    this.currentFrame = 0;
    this.animationOffsets = [0, 34, 63, 98],
    this.width = 26,
    this.height = 27,
    
    this.animateTimer = 0;
    this.power = 2; //could be used for damage ?
    this.done = false;

    this.game = game;
    this.cxt = game.cxt;
    this.map = this.game.map;
    this.image = game.explodeImage;
}
Explosion.prototype.update = function(dt)
{
    this.animateTimer += dt;
    if(this.currentFrame==0)
    {
        var pos = this.map.getTileIndex(this.x, this.y);
        var playa = this.map.getTileIndex(this.game.player.x, this.game.player.y);

        if(pos[0]==playa[0] && pos[1]==playa[1])
        {
            this.game.player.ticks, this.game.player.currentFrame = 0;
            this.game.player.alive = false;
        }
    }
    if(this.animateTimer>=200) // 60 ticks per second (FPS)
    {
        if(this.currentFrame ==this.animationOffsets.length)
            this.done = true;
        else
        {
            this.animateTimer = 0;
            this.currentFrame++;
        }
    }
    this.cxt.drawImage(this.image,
        this.animationOffsets[this.currentFrame], 0, this.width, this.height,
        this.x, this.y, this.width, this.height);
}