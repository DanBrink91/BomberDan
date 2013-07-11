// Map.js
function Map(game)
{
    this.tileImages = [new Image(), new Image()];
    this.tileImages[0].src = "img/wood.png";
    this.tileImages[1].src = "img/stone.png";
    
    this.width = 32;
    this.height = 32;

    this.game = game;
    this.cxt = game.cxt;

    this.tiles = [ 
                [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                ];
}
Map.prototype.update = function(dt)
{
    for(var y = this.tiles.length - 1; y >= 0; y--)
        for(var x = this.tiles[y].length - 1; x >= 0; x--)
        {
            this.cxt.drawImage(this.tileImages[this.tiles[y][x]],x*this.width, y*this.height);
        }
}
// Helper functions for map

//  Returns the index in the tiles array
Map.prototype.getTileIndex = function(x, y)
{
    if(x==0)
        x+=1;
    if(y==0)
        y+=1;
    return [~~(y/this.height), ~~(x/this.width)];
}
//  Returns the actual tile value
Map.prototype.getTile = function(x, y)
{   
    if(x < 0 || Math.ceil(x/this.width) > this.tiles[0].length ||
        y < 0 || Math.ceil(y/this.height) > this.tiles.length)
    {
        return 1;
    }

    if(x==0)
        x+=1;
    if(y==0)
        y+=1;
    return this.tiles[~~(y/this.height)][~~(x/this.width)];
}
