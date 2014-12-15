function Ground(length, startX, startY, endX, endY)
{
	this.length = length;
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;

	// calc angle

	function calcAngle()
	{

	}

	function getAngle()
	{

	}

	calcAngle();
}

function Game()
{

	var canvas=document.getElementById("canvas");
	var ctx=canvas.getContext("2d");

	MIN_WIDTH = canvas.width/4;
	MAX_WIDTH = canvas.width/2;
	MAX_Y = canvas.height - (canvas.height/6);
	MIN_Y = canvas.height/6;
	GROUND_AMOUNT = 2;
	grounds = []
	currentX = 0;
	currentY = canvas.height/2;
	flatGround = false;

	// background group one
	backgroundLayerOneArray = []

	// background group two
	backgroundLayerTwoArray = []

	function getCurrentX()
	{
		return currentX;
	}

	function setCurrentX(x)
	{
		currentX = x;
	}

	function getCurrentY()
	{
		return currentY;
	}

	function setCurrentY(y)
	{
		currentY = y;
	}


	function generateGround()
	{
		// 
		length = generateRandomLength(MIN_WIDTH, MAX_WIDTH);
		if (flatGround)
		{
			y = currentY;
			flatGround = false;
		}
		else 
		{
			y = generateRandomY(MIN_Y, MAX_Y);
			flatGround = true;
		}
		
		x = currentX
		currentX +=length;

		grounds.push(new Ground(length, x, currentY, currentX, y));

		currentY = y;

		// calc angle

		// get y difference

		// is negative y difference
	}

	function generateGrounds(amount)
	{
		for (var i = 0; i < amount; i++)
		{
			generateGround();
		}
	}


	function generateRandomLength(min, max)
	{
		return Math.floor((Math.random() * max) + min);
	}

	function generateRandomY(min, max)
	{
		return Math.floor((Math.random() * max) + min);
	}

	function paintGrounds()
	{
		ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );

		/*ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle="red";
		ctx.fill();*/

		for (var i = 0; i < grounds.length; i++)
		{
			ctx.fillStyle="#10C04E";
			ctx.beginPath();
		    ctx.lineTo(grounds[i].startX, grounds[i].startY);
		    ctx.lineTo(grounds[i].endX, grounds[i].endY);
		    ctx.lineTo(grounds[i].endX, canvas.height);
		    ctx.lineTo(grounds[i].startX, canvas.height);
		    ctx.fill();
		}


		ctx.beginPath();
		ctx.strokeStyle="#0E7733";
		ctx.lineWidth = 10;

		for (var i = 0; i < grounds.length; i++)
		{
			ctx.lineTo(grounds[i].startX, grounds[i].startY);
			ctx.lineTo(grounds[i].endX, grounds[i].endY);
		}

		ctx.stroke();
	}

	function updateGroundsCords()
	{
		val = 2;

		for (var i = 0; i < grounds.length; i++)
		{
			grounds[i].startX = grounds[i].startX - val
			grounds[i].endX = grounds[i].endX - val
		}	
	}

	// if block offscreen then remove
	function garbageCollect()
	{

	}

	function blocksAtEndOfScreen(blocks, key)
	{
		block = blocks[blocks.length-1]

		if (block.startX <= canvas.width)
		{
			//genderate new grounds
			currentX = block.endX
			generateGrounds(GROUND_AMOUNT)
		}

		// gets last value in array checks if at end of screen
		// will look for x value unless second param is passed with a different value to look for
	}



	(function(){

		setInterval(function(){
			paintGrounds()
			updateGroundsCords()
			blocksAtEndOfScreen(grounds)
		}, 6)


		generateGrounds(GROUND_AMOUNT)

	})();

}

new Game();


// start x,y
// end e,y
// draw shapes