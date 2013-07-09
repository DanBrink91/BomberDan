// Bomb.js
// Contains BOTH Bomb + Explosions
function Bomb(x, y, game)
{
    this.width = 14;
    this.height = 23;

    this.x = ~~(x * 32 / 32)  + this.width / 2;
    this.y = ~~(y * 32 / 32) + this.height / 2;
     
    this.lifetime = 3;
    this.currentFrame = 0;
    this.animationOffsets = [0, 16, 32],

    this.timePassed = 0;
    this.power = 2;
    this.done = false;

    this.image = game.bombImage;
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
        this.x-10, this.y-16, this.width, this.height);

    var tilePos = this.game.map.getTileIndex(this.x, this.y);
    this.cxt.strokeStyle = "red";
    this.cxt.strokeRect(tilePos[1] * 32, tilePos[0]* 32, 32, 32);
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
        var explosion_tile_index = this.map.getTileIndex(this.x, this.y);
        
        var player_position = this.game.player.getPosition();
        var player_tile_index = this.map.getTileIndex(player_position.x, player_position.y);

        console.log(explosion_tile_index, player_tile_index);
        if(explosion_tile_index[0]==player_tile_index[0] && explosion_tile_index[1]==player_tile_index[1])
        {
            this.game.player.ticks, this.game.player.currentFrame = 0;
            this.game.player.alive = false;
        }
    }
    if(this.animateTimer>=200)
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