WORLD_WIDTH = 1024,
WORLD_HEIGHT = 576

platforms = [
    {
        w: 572,
        h: 54,
        name: 'large_platform'
    },
    {
        w: 232,
        h: 40,
        name: 'medium_platform'
    },
    {
        w: 121,
        h: 40,
        name: 'small_platform'
    },
    /*
    {
        w: 352,
        h: 55,
        name: 'medium_icicle_platform'
    },*/
]

var game = new Phaser.Game(WORLD_WIDTH, WORLD_HEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update }),

// background
mountainOne,
mountainTwo,

//snow

// sprite groups
grounds,
snow,
snowflakes,
player,

// collision groups
playerCollisionGroup,
groundsCollisionGroup,
snowflakesCollisionGroup

lastKeyCode = null,

// ground building info
currentY = 0,
currentYPosition = 2,
currentX = 250,

// score info
mulitipler = 1,
scoreText = null,
score = 10,
meters = 0,
metersText = null,

// player info
currentPlayerSpeed = 200,
playerLastX = 0,
lastCameraX = 0;
MIN_WIDTH = game.width/4,
MAX_WIDTH = game.width/2,
MAX_Y = game.height - 150,
MIN_Y = 100,
MIN_X = 40,
MAX_X = 150,
WORLD_BOUNDS = 2000,
SPEED_INCREMENT = 25,
BG_COLOUR = "#73e8ff",
TEXT_COLOUR = "#033c4f",
currentWorldBounds = WORLD_BOUNDS;

GENERATE_BLACK_SNOWFAKE = 10;

WebFontConfig = {

    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Londrina Solid']
    }

};


game.over = false;

function preload() 
{
    //game.load.image('ground', 'assets/img/ground_snow_two.png', 0, 0);
    game.load.image('medium_icicle_platform', 'assets/img/medium_icicle_platform.png', 0, 0);
    game.load.image('medium_platform', 'assets/img/medium_platform.png', 0, 0);
    game.load.image('small_platform', 'assets/img/small_platform.png', 0, 0);
    game.load.image('large_platform', 'assets/img/large_platform.png', 0, 0);

    game.load.image('player', 'assets/img/snowball.png');

    game.load.image('mountain', 'assets/img/mountain.png');
    game.load.image('mountain_two', 'assets/img/mountain_two.png');

    game.load.image('snowflake', 'assets/img/snowflake.png');
    game.load.image('snowflake_black', 'assets/img/snowflake_black.png');

    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}
 
function create() 
{
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0;
    game.physics.p2.gravity.y = 300;
    //game.physics.p2.updateBoundsCollisionGroup();

    game.stage.backgroundColor = BG_COLOUR;
    mountainOne = game.add.tileSprite(0, 0, WORLD_BOUNDS, WORLD_HEIGHT, 'mountain');
    mountainTwo = game.add.tileSprite(0, 0, WORLD_BOUNDS, WORLD_HEIGHT, 'mountain_two');

    setWorldBounds();


    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    groundsCollisionGroup = game.physics.p2.createCollisionGroup();
    snowflakesCollisionGroup = game.physics.p2.createCollisionGroup();

    grounds = game.add.group();
    grounds.enableBody = true; 
    grounds.physicsBodyType = Phaser.Physics.P2JS;

    snowflakes = game.add.group();
    snowflakes.enableBody = true; 
    snowflakes.physicsBodyType = Phaser.Physics.P2JS;

    // add start button
    // click event and run init
    init();
    
    game.input.keyboard.onUpCallback = function()
    {
        lastKeyCode = null;
    };

    game.input.keyboard.onDownCallback = function()
    {
        checkCursors()
    };
}

/**
    Creates the games main player
**/

function addPlayer()
{
    player = game.add.sprite(50, 100, 'player');
    game.physics.p2.enable(player, false);

    player.body.setRectangleFromSprite();
    player.body.fixedRotation = true;
    player.body.setCollisionGroup(playerCollisionGroup);
    
    player.body.data.gravityScale = 1;
    player.body.collideWorldBounds = true;
    player.body.collides([groundsCollisionGroup], null, this);
    player.body.collides([snowflakesCollisionGroup], null, this);

    player.movement = {};
    player.movement.jumpAmount = 0;

    return player;
}

function init()
{
    game.started = true;
    generateGround(150, 300, groundsCollisionGroup, playerCollisionGroup);
    generateRandomGround();
    player = addPlayer();
    game.camera.follow(player);   
}

function createText()
{
    createScoreText()
    createMetersText()
}

function createScoreText()
{
    var style = { font: "35px Londrina Solid", fill: TEXT_COLOUR }; 
    scoreText = game.add.text(10, 10, score.toString(), style);
    scoreText.fixedToCamera = true
}

function createMetersText()
{
    /*
    var style = { font: "35px Londrina Solid", fill: TEXT_COLOUR }; 
    metersText = game.add.text(10, 50, score.toString(), style);
    metersText.fixedToCamera = true*/
}

function setWorldBounds()
{
    xBound = 0

    if ( player != undefined)
    {
        //xBound = ((player.x - player.width) - (game.width/2))
        player.body.collideWorldBounds = true;
    }

    game.world.setBounds(xBound, 0, currentWorldBounds, WORLD_HEIGHT);;
    currentWorldBounds+=WORLD_BOUNDS;
    mountainOne.width = currentWorldBounds
    mountainTwo.width = currentWorldBounds
}
 
function update() 
{
    if (game.started)
    {
        meters += (Math.round(player.x - playerLastX))
        if (game.camera.x > lastCameraX)
        {
            mountainOne.tilePosition.x -= 0.2; 
            mountainTwo.tilePosition.x -= 0.8;   
        }
        
        lastCameraX = game.camera.x

        if (player.x > playerLastX)
            player.angle+=4;

        playerLastX = player.x

        render()
        checkBounds()

        // if the play hits the top then set its down to 200
        if (player.y < 20)
        {
            player.body.moveDown(10);
        }
            

        if ( ! isGameOver() )
        {
            player.body.moveRight(currentPlayerSpeed)

            if (scoreText != null)
            {
                scoreText.text = score/10+" x "+Math.floor(meters/10)+" m";   
            }

            if (metersText != null)
            {

                //metersText.text = Math.floor(meters/10)+" m";   
            }
        }
        else 
        {
            gameOver()
        }
    }
        
}

/**
    Checks if the game is over
*/

function isGameOver()
{
    //console.log(player.y >= (canvas.height - player.height))
    return player.y >= (WORLD_HEIGHT - player.height)
}

function gameOver()
{
    player.static = true;
    player.body.moveRight(0)
    game.over = true;
    //game.started = false;

    text = "GAME OVER";
    fontSize = 60;
    style = { font: fontSize+"px Londrina Solid", fill: TEXT_COLOUR, align: "center" };
    textOne = game.add.text( (game.camera.x + (game.width/3) + 50 ), (game.world.centerY - 30), text, style);
    textOne.inputEnabled = true;

    text = "You scored "+Math.floor((score/10)*(Math.floor(meters/10)))+"\n\nPlay again?";
    fontSize = 30;
    style = { font: fontSize+"px Londrina Solid", fill: TEXT_COLOUR, align: "center" };
    textTwo = game.add.text( (game.camera.x + (game.width/3) + 110 ), (game.world.centerY + 35), text, style);
    textTwo.inputEnabled = true;

    // add rectagnle click area

    textOne.events.onInputDown.add(restartGame, this);
    textTwo.events.onInputDown.add(restartGame, this);

    game.paused = true;
    //game.state.pause()
}

function restartGame()
{
    //game.state.restart()
    //init()
}

/**
    Check if camera is near edge of screen, if it is make game longer
    and add new grounds
**/

function checkBounds()
{
    //
    //console.log(game.camera.x + game.camera.view.width)
    //console.log(game.camera.bounds.width)
    if (cameraHasHitWorldBounds())
    {
        game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        currentPlayerSpeed+=SPEED_INCREMENT;
        player.body.data.gravityScale +=0.2;
        setWorldBounds();
        generateRandomGround();
    }
}

/**
    Check if camera has hit the world bounds
    @return bool
**/

function cameraHasHitWorldBounds()
{
    return (game.camera.x + game.camera.view.width) == game.camera.bounds.width
}

function checkCursors()
{
    /* 38 up, 40 down, 37 left, 39 right */

    if (game.input.keyboard.isDown(38) && lastKeyCode != 38 && player.movement.jumpAmount < 2)
    {
        player.movement.jumpAmount++;
        player.body.moveUp(300);
    }

    if (game.input.keyboard.isDown(32) && lastKeyCode != 32 && player.movement.jumpAmount < 2)
    {
        player.movement.jumpAmount++;
        player.body.moveUp(200);
    }

    if (game.input.keyboard.isDown(80))
    {
        if (game.paused == true)
        {
            game.paused = false;
        }
        else 
        {
            game.paused = true;
        }
    }

    if (game.input.keyboard.lastKey)
            lastKeyCode = game.input.keyboard.lastKey.keyCode;
}

function generateGround(x, y, collisionGroupToSet, collisionGroupsToHit, callback, width)
{
    //height = (height == undefined) ? 300 : height);

    index = generateRandomNumberBetweenMinAndMax(0, platforms.length - 1)
    platform = platforms[index]
    //console.log(platform)

    ground = grounds.create(x, y, platform.name);
    game.physics.p2.enable(ground, false);
    ground.width = platform.w;
    ground.height = platform.h;
    ground.body.setRectangleFromSprite();
    ground.body.setCollisionGroup(collisionGroupToSet);
    ground.body.static = true;
    // ground.body.rotation = generateAngle( (x1) , y1, (x2), y2);
    ground.body.collides(collisionGroupsToHit, hitGrounds, this);

    ground.events.onOutOfBounds.add( removeGround, this );

    // do this dynamically on the size
    // should we generate a black flake
    // should we generate a red flake
    if (ground.width > 150)
    {
        // add snowflakes
        generateSnowflake(x - 75, y - 50)
        generateSnowflake(x + 75, y - 50)
    }
    else
    {
        generateSnowflake(x, y - 50)
    }


    return platform.w

}

function generateSnowflake(x, y)
{
    flake = null;

    if (generateRandomNumberBetweenMinAndMax(1, GENERATE_BLACK_SNOWFAKE) === GENERATE_BLACK_SNOWFAKE)
    {
        flake = snowflakes.create(x, y , 'snowflake_black');
        flake.bad = true;
    }
    else
    {
        flake = snowflakes.create(x, y , 'snowflake');
    }
    
    flake.height = 30
    flake.width = 30
    flake.body.setRectangleFromSprite();
    flake.body.setCollisionGroup(snowflakesCollisionGroup);
    flake.body.static = true;
    flake.body.collides(playerCollisionGroup, hitFlake, flake);
    snowflakeTween(flake);

    return flake;
}

function snowflakeTween(snowflake)
{
    var bounce = game.add.tween(snowflake);

    bounce.to({ y: snowflake.y - 10 }, 200, Phaser.Easing.Bounce.In)
        .to({ y: snowflake.y + 10 }, 200, Phaser.Easing.Bounce.In);

    bounce.onComplete.add(function(snowflake){snowflakeTween(snowflake)});

    bounce.start();
}

function generateRandomGround()
{
    // if current y is less than the bounds keep generating

    // create mid
    // create top
    // create bottom

    while (currentX <= currentWorldBounds)
    {
        // currentX, minX, maxX
        // x is add last width plus a small variance

        // shoould always be at least 
        x = currentX
        //x = generateRandomNumberBetweenMinAndMax(currentX + MIN_X, currentX + MAX_X);
        // make sure last y is different by at least 50
        y = generateY(currentYPosition); 
        //console.log(y) 

        width = generateGround(x, y, groundsCollisionGroup, playerCollisionGroup)

        currentX+= 300;
        currentY = y;
    }
}

/**
    Generates Y coords.
    If pos is 1 genreate in top range, if post is 2 generate in mid range,
    if pos 3 generate in lower range.
**/
function generateY(pos)
{
    min = 0
    max = 0

    if (pos === 1)
    {
        min = MIN_Y
        max = MAX_Y * 0.3
        currentYPosition = 2
    }
    else if (pos === 2)
    {
        min = MAX_Y * 0.3
        max = MAX_Y * 0.6
        currentYPosition = 3
    }
    else if (pos == 3)
    {
        min = MAX_Y * 0.6
        max = MAX_Y
        currentYPosition = 1
    }

    return generateRandomNumberBetweenMinAndMax(min, max);
}

function generateAngle(x1, y1, x2, y2)
{
    pointOne = new Phaser.Point(x1, y1);
    pointTwo = new Phaser.Point(x2, y2);

    return game.physics.arcade.angleBetween(pointOne, pointTwo)
    //return (game.physics.arcade.angleBetween(pointOne, pointTwo) * (180/Math.PI));
}

function generateRandomNumberBetweenMinAndMax(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
    //return Math.floor((Math.random() * max) + min);
}

function hitGrounds(ground)
{
    // if player y is less than ground y then we've hit from the top from the top
    //console.log(player.y > ground.sprite.y)
    //game.paused = true
    // if last button press wasnt up
    // reset 
    /*
    if (player.y < ground.sprite.y)
    {   
        console.log('on top')
    }
    else 
    {
        console.log('below reset')
    }*/

    if (lastKeyCode != 38 || ( ! player.y < ground.sprite.y))
    {
        resetPlayerJump()
    }
    //player.body.static = true;
}

function hitFlake(flake)
{
    isBad = flake.sprite.bad
    
    flake.sprite.kill()
    flake.sprite.destroy()

    if (isBad)
    {
        gameOver();
        return;
    }

    resetPlayerJump()
    score+=1
}

function resetPlayerJump()
{
    player.movement.jumpAmount = 0;
}

function removeGround(ground)
{
    console.log('remove')
}

function render() {
    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.spriteCoords(player, 32, 500);
}

function restart()
{
    /*
    lastKeyCode = null,
    currentY = 0,
    currentYPosition = 1,
    currentX = 250,
    mulitipler = 1,
    scoreText = null,
    score = 10,
    meters = 0,
    metersText = null,
    currentPlayerSpeed = 200,
    playerLastX = 0,
    lastCameraX = 0;
    WORLD_BOUNDS = 2000,
    SPEED_INCREMENT = 25,
    currentWorldBounds = WORLD_BOUNDS; 
    game.paused = false
    game.over = false; 
    */
    window.location.reload()

    // reset the gropus
    // reset the players
    // reset the ice
    // reset the bounds

    // run innit
}

$(document).on('click', 'canvas', function()
{
    if (game.over)
    {
        restart()
    }
})
