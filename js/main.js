var game = {};
var turnPlayer = 1;

// permet de connaitres toutes les actions de la partie
game.history = function(text) {
	document.getElementById('textCombat').innerHTML = text + "<br>" + document.getElementById('textCombat').innerHTML;
}

// retourne un element
game.select = function(x, y) {
	var elem = document.querySelector('.square-' + x + '-' + y);
	return (elem);
}

// mise a jour des informations
game.update = function() {
	var elemClassList = document.getElementById("weapon_p1").classList;

	elemClassList.remove(elemClassList.item(0));
 	elemClassList = document.getElementById("weapon_p-1").classList;
	elemClassList.remove(elemClassList.item(0));
	document.getElementById("weapon_p1").classList.add(game.players[1].weapon);
	document.getElementById("weapon_p-1").classList.add(game.players[-1].weapon);
	document.getElementById("pdvP1").innerHTML = game.players[1].life + " PDV";
	document.getElementById("pdvP-1").innerHTML = game.players[-1].life + " PDV";
	document.getElementById("dpsP1").innerHTML = "Arme : " + game.weapon[game.players[1].weapon].domage + " degats";
	document.getElementById("dpsP-1").innerHTML = "Arme : " + game.weapon[game.players[-1].weapon].domage + " degats";
	if (game.players[game.turnPlayer].shield)
		game.players[game.turnPlayer].shield = false;
}

// supprime tous les timeout 
game.clearTimers = function() {
	for (var i = 0; i < timersPlayers.length; i++)
    	clearTimeout(timersPlayers[i]);
}

// rénisialisation de la partie
game.initNewGame = function() {
	time = 15;
	game.players[1].life = game.players[-1].life = 100;
	game.players[1].pm = game.players[-1].pm = 3;
	game.players[1].weapon = game.players[-1].weapon = "weapon1";
	document.getElementById("timer1").innerHTML = document.getElementById("timer-1").innerHTML = 15;
	document.getElementById("p" + game.turnPlayer).classList.remove("pass");
	document.getElementById("passButton" + game.turnPlayer).disabled = false;
	document.getElementById("passButton" + (game.turnPlayer * -1)).disabled = true;
	document.getElementById('textCombat').innerHTML = "";
	game.clearTimers();
}

// passe a joueur suivant
game.pass = function() {
	game.clearTimers();
	document.getElementById("timer" + game.turnPlayer).innerHTML = 15;
	time = 15;
	game.nextTurn();
}

// reset l'attaque 
game.resetAttack = function() {
	game.players[game.turnPlayer].attack = true;
}

// changement de joueur au niveau graphique, opacité a 1 pour le joueur et 0.4 pour celui qui attend
game.changePlayer = function() {
	var elem = document.getElementById("p" + game.turnPlayer * -1);
	elem.classList.add("pass");
	elem = document.getElementById("p" + game.turnPlayer);
	elem.classList.remove("pass");
	game.move.checkNextToPlayer();
}

// generation d'une nouvelle partie
game.new = function() {
	game.map.generate();
	game.initTurnPlayer();
	game.initNewGame();
	game.update();
	game.move.addMove();
	game.move.combat(true, 0.2);
	document.getElementById("p" + game.turnPlayer * -1).classList.add("pass");
	game.players.timer();
}

// changement de joueur
game.nextTurn = function() {
	game.players[game.turnPlayer].pm = 3;
	game.move.removeMove();
	game.turnPlayer *= -1;
	game.move.addMove();
	game.update();
	document.getElementById('passButton' + game.turnPlayer).disabled = false;
	document.getElementById('passButton' + (game.turnPlayer * -1)).disabled = true;
	game.resetAttack();
	game.changePlayer();
	game.players.timer();
}