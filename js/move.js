game.move = {};

// debut du déplacement
game.move.move = function(e) {
	game.move.removeMove();
	game.move.moveTo(e.target);
}

// deplacement jusqu'a la cible choisie par le joueur
game.move.moveTo = function(target) {
	var target = {
		x :parseInt(target.getAttribute("x")),
		y :parseInt(target.getAttribute("y")) }
	var destinationObj = {
		x: target.x - game.players[game.turnPlayer].x,
		y: target.y - game.players[game.turnPlayer].y }

	game.move.checkWeapon(destinationObj.x, destinationObj.y);
	game.players[game.turnPlayer].pm -= Math.abs(destinationObj.x);
	game.players[game.turnPlayer].pm -= Math.abs(destinationObj.y);	
	destinationObj.x += game.players[game.turnPlayer].x;
	destinationObj.y += game.players[game.turnPlayer].y;
	destinationObj.element = document.querySelector('.square-' + (destinationObj.x) + '-' + (destinationObj.y));
	destinationObj.element.classList.add("player" + game.turnPlayer);
	destinationObj.element.setAttribute("type", "player" + game.turnPlayer);
	game.players[game.turnPlayer].getElement().classList.remove("player" + game.turnPlayer);
	game.players[game.turnPlayer].getElement().setAttribute("type", "");
	game.players[game.turnPlayer].x = target.x;
	game.players[game.turnPlayer].y = target.y;
	game.move.checkNextToPlayer();
	game.move.addMove();
	game.update();
}

// regarde a une direction donnée
game.move.checkDirection = function(x, y) {
	if (game.select(game.players[game.turnPlayer].x + x, game.players[game.turnPlayer].y + y)) {
		if (game.select(game.players[game.turnPlayer].x + x, game.players[game.turnPlayer].y + y).getAttribute("type") === ("player" + (game.turnPlayer * -1)))
			return (1);
	}
	return (0);
}

// active ou desactive le combat en fonction des parametre
game.move.combat = function(bool, opacity) {
	var attackP1 = document.getElementById('weapon_p1');
	var attackP2 = document.getElementById('weapon_p-1');
	var defendP1 = document.getElementById('shieldP1');
	var defendP2 = document.getElementById('shieldP2');

	attackP1.style.opacity = attackP2.style.opacity = defendP1.style.opacity = defendP2.style.opacity = opacity;
	attackP1.disabled = attackP2.disabled = defendP1.disabled = defendP2.disabled = bool;
}

// verification si deux joueurs sont a cote pour actier ou desactiver le mode combat
game.move.checkNextToPlayer = function() {
	if (game.players[game.turnPlayer].attack && (game.move.checkDirection(-1, 0) || game.move.checkDirection(1, 0) || game.move.checkDirection(0, 1) || game.move.checkDirection(0, -1)))
		game.move.combat(false, 1);
	else
		game.move.combat(true, 0.4);
}


// recherche d'arme sur le chemin
game.move.checkWeapon = function(x,y){
	var tmpX = game.move.getDirection(x);
	var tmpY = game.move.getDirection(y);

	for (var i = 0; Math.abs(i) <= Math.abs(x); i += tmpX) {
		for (var j = 0; Math.abs(j) <= Math.abs(y); j += tmpY) {
			var elem = document.querySelector('.square-' + ((game.players[game.turnPlayer].x + i)) + '-' + ((game.players[game.turnPlayer].y + j)));
			if (elem.getAttribute("weapon") != "" && (elem.getAttribute("type") != ("player" + game.turnPlayer)))
				game.move.changeWeapon(elem);
		}
	}
}

// changement d'arme
game.move.changeWeapon = function(elem) {
	if (game.players[game.turnPlayer].weapon === "weapon1") {
		game.players[game.turnPlayer].weapon = elem.getAttribute("weapon");
		elem.classList.remove(elem.getAttribute("weapon"));
		elem.setAttribute("weapon", "");
		elem.setAttribute("type", "");
		game.history(game.players[game.turnPlayer].name + " trouve " + game.weapon[game.players[game.turnPlayer].weapon].name);
	}
	else {
		var weaponID = elem.getAttribute("weapon");
		game.history(game.players[game.turnPlayer].name + " echange " + game.weapon[game.players[game.turnPlayer].weapon].name + " contre " + game.weapon[weaponID].name);
		elem.setAttribute("weapon", game.players[game.turnPlayer].weapon);
		elem.classList.remove(weaponID);
		elem.classList.add(game.players[game.turnPlayer].weapon);
		game.players[game.turnPlayer].weapon = weaponID;
	}
}

// permet de connaitre la direction du mouvement
game.move.getDirection = function(nbr) {
	if (nbr >= 0)
		return (1)
	else
		return (-1);
}

// double utilité de la fonction; en fonction du booleen passe en 3eme parametre permet de soit supprimer soit ajouter des deplacements
game.move.addMoveOrRemove = function(x, y, bool) {
	var tmpX = game.move.getDirection(x);
	var tmpY = game.move.getDirection(y);

	for (var i = 0; Math.abs(i) <= Math.abs(x); i += tmpX) {
		for (var j = 0; Math.abs(j) <= Math.abs(y); j += tmpY) {
			var move = document.querySelector('.square-' + (game.players[game.turnPlayer].x + i) + '-' + (game.players[game.turnPlayer].y + j));
			if (move && (move.getAttribute("type") === "" || move.getAttribute("type") === "weapon")) {
					if (bool) {
						move.classList.add("move" + game.turnPlayer);
						move.addEventListener("click", game.move.move, false);
					}
					else {
						move.classList.remove("move" + game.turnPlayer);
						move.removeEventListener("click", game.move.move, false);
					}
			}
			else if (move && (move.getAttribute("type") === "player" + game.turnPlayer));
			else
				return (-1);
		}
	}
}

// supprime tous les déplcament
game.move.removeMove = function() {
	game.move.addMoveOrRemove(game.players[game.turnPlayer].pm, 0, false);
	game.move.addMoveOrRemove(game.players[game.turnPlayer].pm *-1, 0, false);
	game.move.addMoveOrRemove(0, game.players[game.turnPlayer].pm, false);
	game.move.addMoveOrRemove(0, game.players[game.turnPlayer].pm *-1, false);
}

// ajoute les déplacements en fonction des Points de Mouvement (PM) du joeur
game.move.addMove = function() {
	game.move.addMoveOrRemove(game.players[game.turnPlayer].pm, 0, true);
	game.move.addMoveOrRemove(game.players[game.turnPlayer].pm *-1, 0, true);
	game.move.addMoveOrRemove(0, game.players[game.turnPlayer].pm, true);
	game.move.addMoveOrRemove(0, game.players[game.turnPlayer].pm *-1, true);
}