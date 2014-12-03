MAX_ANGLE = 30;
groundsArray = [];
lastGroundWasFlat = true;
angleWasPositive = true;

function Ground(length, angle)
{
	this.length = length;
	this.angle = angle;
}


function generateGround()
{
	// add a new ground piece
	// generate base on width of screen, roughly 1/3rd to 2/3rd size of screen
	// set angle between max and min
	angle = 0;

	if (lastGroundWasFlat)
	{
		lastGroundWasFlat = false;
		angle = getRandomAngle(MAX_ANGLE);

		if (angleWasPositive)
		{
			angleWasPositive = false;
		}
		else 
		{
			angleWasPositive = true
		}	
	}
	else 
	{
		lastGroundWasFlat = true
	}

	// calculate where to place the next ground 
	// if its below the threshold we need to do something
	// figure out the y from the next angle and length and current x,y cords
	// if its below the screen then recaclulate
	// maybe find max angle?
	length = getRandomLength()
	console.log(length * Math.tan(angle))

	groundsArray.push(new Ground(length, angle))
}

/**
	Generates and returns a random length
**/

function getRandomLength()
{
	return 300;
}

/**
	Generates and returns a random angle
**/

function getRandomAngle(angle)
{
	return Math.round(Math.random() * (angle - 0) + 0);
}

for (var i = 0; i < 20; i++)
{
	generateGround()
}

console.log(groundsArray)