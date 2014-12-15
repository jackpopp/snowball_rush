var LINE_COLOR = '#10C04E';
var FILL_COLOR = '#0E7733';

var game = new Phaser.Game(767, 432, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var grounds;
var player;
var playerCollisionGroup;
var groundsCollisionGroup;
var cursors;
var lastKeyCode = null;
var circles = []
var addedFirstBlock = false;

// add graphic
// line to
// fill
// add to hills group


function preload() 
{
	game.load.image('ground', 'assets/img/ground.jpg', 0, 0);
	game.load.image('player', 'assets/img/player.png');
}
 
function create() 
{
	//game.physics.startSystem(Phaser.Physics.ARCADE);

	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.setImpactEvents(true);
	game.physics.p2.restitution = 0;
	game.physics.p2.gravity.y = 300;
	//game.physics.p2.updateBoundsCollisionGroup();
	game.world.setBounds(0, 0, 1920, 800);


	playerCollisionGroup = game.physics.p2.createCollisionGroup();
	groundsCollisionGroup = game.physics.p2.createCollisionGroup();

	grounds = game.add.group();
	grounds.enableBody = true; 
	grounds.physicsBodyType = Phaser.Physics.P2JS;
	//hills.body.immovable = true;

	//generateHills();
	pie();

    cursors = game.input.keyboard.createCursorKeys();
	
	game.input.keyboard.onUpCallback = function()
	{
		lastKeyCode = null;
	};

	game.input.keyboard.onDownCallback = function()
	{
		checkCursors()
	};
}
 
function update() 
{
    render()
}

function checkCursors()
{
	/* 38 up, 40 down, 37 left, 39 right */

	if (game.input.keyboard.isDown(37))
    {

        player.body.moveLeft(200);
        player.scale.x = -1;
    }

    if (game.input.keyboard.isDown(39))
    {
        player.body.moveRight(200);
        player.scale.x = 1;
    }

    if (game.input.keyboard.isDown(38) && lastKeyCode != 38)
    {
        player.body.moveUp(200);
    }

    /*
    if (game.input.keyboard.isDown(40) && lastKeyCode != 40)
    {
        player.body.moveDown(200);
    }*/

    if (game.input.keyboard.lastKey)
			lastKeyCode = game.input.keyboard.lastKey.keyCode;
}

function generatePlayer()
{

}

function generateHills()
{
	/*
	hill = new Phaser.Graphics(game, 10, 10);
	hill.lineStyle(10, 0xFF0000);
	hill.moveTo(10, 10);
	hill.lineTo(100, 100); 
	x = grounds.add(hill);*/
}

function generateGround(x1, y1, x2, y2, collisionGroupToSet, collisionGroupsToHit, callback)
{
    //x1 = x1 - 150;
    //x2 = x2 - 150;

	ground = grounds.create(x1, y1, 'ground');
    ground.anchor.set(0,0)
    ground.width = 300;
    ground.height = 50;
    ground.body.setRectangleFromSprite();
    ground.body.setCollisionGroup(collisionGroupToSet);
    ground.body.static = true;
   // ground.body.rotation = generateAngle( (x1) , y1, (x2), y2);
    ground.body.collides(collisionGroupsToHit, callback, this);

    console.log(ground.body.getCollisionMask())

    console.log(ground)
}

function generateAngle(x1, y1, x2, y2)
{
    circles.push(new Phaser.Circle(x1, y1, 10));
    circles.push(new Phaser.Circle(x2, y2, 10));

	pointOne = new Phaser.Point(x1, y1);
	pointTwo = new Phaser.Point(x2, y2);

	return game.physics.arcade.angleBetween(pointOne, pointTwo)


	//return (game.physics.arcade.angleBetween(pointOne, pointTwo) * (180/Math.PI));
}

// create two points using cords,
// create block, set roataion based on angle between cords
// remove cords
// create fill on different layer based on cords
function pie()
{
    // Here we create the ground.

    generateGround(0, 400, 300, 450, groundsCollisionGroup, playerCollisionGroup)

    generateGround(450, 450, 740, 500, groundsCollisionGroup, playerCollisionGroup)
    generateGround(730, 500, 1030, 500, groundsCollisionGroup, playerCollisionGroup)

    generateGround(1020, 500, 1320, 400, groundsCollisionGroup, playerCollisionGroup)

    /*
    pointOne = new Phaser.Point(100, 100);
	pointTwo = new Phaser.Point(200, 200);
	angle = game.physics.arcade.angleBetween(pointOne, pointTwo);

    ground = grounds.create(400, 365, 'ground');
    ground.body.setRectangleFromSprite();
    ground.body.setCollisionGroup(groundsCollisionGroup);
    ground.body.static = true;
    //ground.body.angle = (angle * (180/Math.PI));
    ground.body.collides(playerCollisionGroup, hitGrounds, this);

    ground = grounds.create(800, 365, 'ground');
    ground.body.setRectangleFromSprite();
    ground.body.setCollisionGroup(groundsCollisionGroup);
    ground.body.static = true;
    //ground.body.angle = (angle * (180/Math.PI));
    ground.body.collides(playerCollisionGroup, hitGrounds, this);
    */
   
    player = game.add.sprite(200, 100, 'player');
    game.physics.p2.enable(player, false);

   	player.body.setRectangleFromSprite();
   	player.body.fixedRotation = true;
    //player.body.setCircle(28);
    player.body.setCollisionGroup(playerCollisionGroup);
 
    //  Player physics properties. Give the little guy a slight bounce.
    
    player.body.data.gravityScale = 1;
    player.body.collideWorldBounds = true;
    player.body.collides(groundsCollisionGroup, hitGrounds, this);

    //player.body.collides([groundsCollisionGroup, playerCollisionGroup], hitGrounds, this);
    game.camera.follow(player);
    
}

function hitGrounds()
{
	//player.body.static = true;
}


function render() {
	for (var i = circles.length - 1; i >= 0; i--) {
        game.debug.geom(circles[i], '#cfffff');
    };

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

