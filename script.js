function Game(difficulty)
{
	canvas = document.getElementById("myCanvas");
	field_width = canvas.offsetWidth;
	map_size = difficulty;
	tile_size = field_width/map_size;	
	player_img = new Image();
	player_img.src = "12.png";

	var matrix = new Array(map_size);
	for(var i=0;i<matrix.length;i++)
	{
		matrix[i] = new Array(map_size);
	}

	GenerateMapRandom(matrix);
	player = getByType(matrix,"start");
	finish = getByType(matrix,"finish");
	start = getByType(matrix,"start");
	player.x++;
	rx = getRandom(0,6);
	ry = getRandom(0,3);
	position = "right";
	DrawMap(player,matrix,canvas,rx,ry,"right");
	window.addEventListener('keydown', whatKey, true);
	function whatKey(evt)
	{
		position = "right";
		switch(evt.keyCode)
		{
			case 37:
			{
			if(matrix[player.x-1][player.y]!="inside")
				player.x--;
			position = "left";
			break;
			}
			case 38:
			{
			if(matrix[player.x][player.y-1]!="inside")
				player.y--;
				position = "down";
			break;
			}
			case 39:
			if(matrix[player.x+1][player.y]!="inside")
				player.x++;
				position = "right";
			break;
			case 40:
			if(matrix[player.x][player.y+1]!="inside")
				player.y++;
				position = "up";
			break;
		}
		DrawMap(player,matrix,canvas,rx,ry,position);
		if (player.x==finish.x&&player.y==finish.y)
		{
			alert("You Win!");
			GenerateMapRandom(matrix);
			player = getByType(matrix,"start");
			finish = getByType(matrix,"finish")
			player.x++;
			rx = getRandom(0,6);
			ry = getRandom(0,3);
			DrawMap(player,matrix,canvas,rx,ry,position);
		}
		else if (player.x==start.x&&player.y==start.y)
		{
			GenerateMapRandom(matrix);
			player = getByType(matrix,"start");
			finish = getByType(matrix,"finish");
			start = getByType(matrix,"start")
			player.x++;
			rx = getRandom(0,6);
			ry = getRandom(0,3);
			DrawMap(player,matrix,canvas,rx,ry,position);
		}
	}

}

//Перерисовка всей карты
function DrawMap(player,matrix,canvas,rx,ry,pos)
{
	if (canvas.getContext)
	{
		
		ctx = canvas.getContext('2d');
		ctx.fillStyle="black";
		ctx.fillRect(0,0,field_width,field_width);
		player_img = new Image();
		player_img.src = "12.png";
		for (var i=0; i<map_size;i++)
		 for (var j=0;j<map_size;j++)
		 {
		 	DrawTile(matrix,canvas,i,j,rx,ry);
		 }
		switch (pos)
		{
			case "up":
			ctx.drawImage(player_img,0,32,32,32,player.x*tile_size,player.y*tile_size,tile_size,tile_size);
			break;
			case "right":
			ctx.drawImage(player_img,0,64,32,32,player.x*tile_size,player.y*tile_size,tile_size,tile_size);
			break;
			case "left":
			ctx.drawImage(player_img,0,96,32,32,player.x*tile_size,player.y*tile_size,tile_size,tile_size);
			break;
			case "down":
			ctx.drawImage(player_img,0,128,32,32,player.x*tile_size,player.y*tile_size,tile_size,tile_size);
			break;
		}	
	}
}

function DrawTile(matrix,canvas,i,j,rx,ry)
{
			image = new Image();
			image.src = 'thealistaircollectionaw4.png';
			if (matrix[i][j]=="inside")
		 	{
		 		ctx.drawImage(image,256+rx*16,304+ry*16,16,16,i*tile_size,j*tile_size,tile_size,tile_size);
		 	}
		 	if (matrix[i][j]=="outside")
		 	{
				ctx.drawImage(image,80,0,16,16,i*tile_size,j*tile_size,tile_size,tile_size);
		 	}
		 	if (matrix[i][j]=="start")
		 	{
				ctx.drawImage(image,1008,784,64,64,i*tile_size,j*tile_size,tile_size,tile_size);
		 	}
		 	if (matrix[i][j]=="finish")
		 	{
				ctx.drawImage(image,336,64,16,16,i*tile_size,j*tile_size,tile_size,tile_size);
		 	}
		 	alert('x = ' + i.toString() + " " + 'y = '+ j.toString() + " " + matrix[i][j]);
}

function getRandom(min, max)
{
  return parseInt(Math.random() * (max - min) + min);
}

function getByType(matrix,type)
{
	for (var i=0; i<matrix.length;i++)
		 for (var j=0;j<matrix.length;j++)
		 {
		 	if (matrix[i][j]==type)
		 		return new Point(i,j);
		 }
}

function GenerateMapRandom(matrix)
{
	//Засеивания поля стенами
	for (var i=0; i<matrix.length;i++)
		 for (var j=0;j<matrix.length;j++)
		 {
		 	matrix[i][j]="outside";
		 }
	//Генерация случайной изначальной внутренней точки для алгоритма Прима
	start_x = getRandom(0,matrix.length-1);
	start_y = getRandom(0,matrix.length-1);
	matrix[start_x][start_y] = "inside";
	GenerateBordersAroundInside(matrix,start_x,start_y);
	//Алгоритм генерации лабиринтов Прима
	while (CheckNoBorders(matrix)==false)
	{
		
		var borders = GetBorders(matrix);
		random_border = borders[getRandom(0,borders.length-1)];
		temp_x = random_border.x;
		temp_y = random_border.y;
		matrix[temp_x][temp_y]="inside";
		GenerateBordersAroundInside(matrix,temp_x,temp_y);
		random_variant = getRandom(0,3);
		if(temp_x<matrix.length-2&&random_variant==0)
		{
			if(matrix[temp_x+2][temp_y]=="inside")
				matrix[temp_x+1][temp_y] = "inside";
		}
		if(temp_x>1&&random_variant==1)
		{
			if(matrix[temp_x-2][temp_y]=="inside")
				matrix[temp_x-1][temp_y] = "inside";
		}
		if(temp_y<matrix.length-2&&random_variant==2)
		{
			if(matrix[temp_x][temp_y+2]=="inside")
				matrix[temp_x][temp_y+1] = "inside";
		}
		if(temp_y>1&&random_variant==3)
		{
			if(matrix[temp_x][temp_y-2]=="inside")
				matrix[temp_x][temp_y-1] = "inside";
		}
	}
	//Заполнение граничными стенами
	for (i=0;i<matrix.length;i++)
	{
		matrix[0][i] = "inside";
		matrix[matrix.length-1][i]="inside";
		matrix[i][0] = "inside";
		matrix[i][matrix.length-1]="inside";
	}
	//Установка стартовой локации
	for (i=0;i<matrix.length;i++)
	{
		if (matrix[1][i]=="outside")
		{
			matrix[0][i]="start";
			break;
		}
	}
	//Установка финишной локации
	for (i=matrix.length-2;i>1;--i)
	{
		if (matrix[matrix.length-2][i]=="outside")
		{
			matrix[matrix.length-1][i]="finish";
			break;
		}
	}
}

function GenerateBordersAroundInside(matrix,x,y)
{
	if (matrix[x][y]=="inside")
	{
		if(x<matrix.length-2)
		{
			if (matrix[x+2][y]=="outside")
				matrix[x+2][y]="border";
		}
		if(x>1)
		{
			if (matrix[x-2][y]=="outside")
				matrix[x-2][y]="border";
		}
		if(y<matrix.length-2)
		{
			if (matrix[x][y+2]=="outside")
				matrix[x][y+2]="border";

		}
		if(y>1)
		{
			if (matrix[x][y-2]=="outside")
				matrix[x][y-2]="border";
		}
	}
}

function CheckNoBorders(matrix)
{
	var k = 0;
	for (var i=0; i<matrix.length;i++)
		 for (var j=0;j<matrix.length;j++)
		 {
		 	if (matrix[i][j]=="border")
		 	{
		 		return false;
		 	}
		 }
	return true;
}

function GetBorders(matrix)
{
	var borders = []

	for (var i=0; i<matrix.length;i++)
		 for (var j=0;j<matrix.length;j++)
		 {
		 	if (matrix[i][j]=="border")
		 	{
		 		borders.push(new Point(i,j));
		 	}
		 }
	return borders;
}

function Point (x, y) {
  	this.x = x;  
  	this.y = y;   
}
