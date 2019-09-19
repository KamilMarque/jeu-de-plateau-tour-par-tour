game.map = {};

// génération d'une carte vide
game.map.generate = function() {
	document.getElementById('map').innerHTML = "";
	var newElem = document.getElementById('map');

	for (var x = 0; x < 10; x++) {
		var row = document.createElement('div');
		newElem.appendChild(row);
		for (var y = 0; y < 10; y++) {
			var square = document.createElement('div');
      	  	square.setAttribute("type", "");
      	  	square.setAttribute("weapon", "");
			square.setAttribute("x", x);
			square.setAttribute("y", y);
			square.setAttribute("class", 'square-' + x + "-" + y)
      	  	row.appendChild(square);
		}
	}
	generateWalls();
	while (!generatePlayers(1));
	while (!generatePlayers(-1));
	generateWeapons();
}


// génération des obstacles
generateWalls = function() {
	for (var i = 0; i < 10; i++) {
		var x = Math.floor(Math.random() * Math.floor(10));
		var y = Math.floor(Math.random() * Math.floor(10));

		var wall = document.querySelector('.square-' + (x) + '-' + (y));
		if (wall.getAttribute("type") === "") {
			wall.setAttribute("type", "wall");
			wall.classList.add("tree");
		}
		else
			i--;
	}
}

// generation des deux jouers
generatePlayers = function(n) {
	var x = Math.floor(Math.random() * Math.floor(10));
	var y = Math.floor(Math.random() * Math.floor(10));

	var pos = document.querySelector('.square-' + (x) + '-' + (y));

	if (pos.getAttribute("type") === "") {
		if (checkPlayersPos(x, y)) {
			pos.setAttribute("type", "player" + n);
			if (n === 1) {
				pos.classList.add("player1");
				game.players[1].x = x;
				game.players[1].y = y;
			}
			else {
				pos.classList.add("player-1");
				game.players[-1].x = x;
				game.players[-1].y = y;
			}
			return (true)
		}
	}
	return (false);
}

// verification qu'un joueur ne soit pas a coté au moment de la génération des joueurs
checkPlayersPos = function(x, y) {
	var pos;

	if (x - 1 >= 0) {
		pos = document.querySelector('.square-' + (x-1) + '-' + (y));
		if (pos.getAttribute("type") === "player1" || pos.getAttribute("type") === "player-1")
			return (false);
	}
	if (x + 1 < 10) {
		pos = document.querySelector('.square-' + (x+1) + '-' + (y));
		if (pos.getAttribute("type") === "player1" || pos.getAttribute("type") === "player-1")
			return (false);
	}
	if (y + 1 < 10) {
		pos = document.querySelector('.square-' + (x) + '-' + (y+1));
		if (pos.getAttribute("type") === "player1" || pos.getAttribute("type") === "player-1")
			return (false);
	}
	if (y - 1 >= 0) {
		pos = document.querySelector('.square-' + (x) + '-' + (y-1));
		if (pos.getAttribute("type") === "player1" || pos.getAttribute("type") === "player-1")
			return (false);
	}
	return (true);
}

// génération des amres
generateWeapons = function() {
	for (var i = 2; i <= 5; i++) {
		var x = Math.floor(Math.random() * Math.floor(10));
		var y = Math.floor(Math.random() * Math.floor(10));

		var pos = document.querySelector('.square-' + (x) + '-' + (y));
		if (pos.getAttribute("type") === "") {
			pos.setAttribute("type", "weapon");
			pos.setAttribute("weapon", "weapon" + i);
			pos.classList.add("weapon" + i);
		}
		else
			i--;
	}
}