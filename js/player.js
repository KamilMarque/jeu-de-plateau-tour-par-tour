game.players = {};
var timersPlayers = [];  // Tableau contenant tous les setTimeout
var time = 15; // nombre de secondes par tour

game.players[1] = {
		name : "Joueur 1",
		life : 100,
		weapon : "weapon1",
		pm : 3, // points de déplacement
		x : 0,
		y : 0,
		shield : false,
		attack : true,
		getElement: function getElement(){
			 return document.querySelector('.square-' + (this.x) + '-' + (this.y));
		}
	};
game.players[-1] = {
		name : "Joueur 2",
		life : 100,
		weapon : "weapon1",
		pm : 3, // points de déplacement
		x : 0,
		y : 0,
		shield : false,
		attack : true,
		getElement: function getElement(){
			 return document.querySelector('.square-' + (this.x) + '-' + (this.y));
		}
	};

// initialise le tour du joeur qui commance
game.initTurnPlayer = function() {
	var i = Math.ceil(Math.random() * 2);
	if (i === 1)
		game.turnPlayer = 1;
	else
		game.turnPlayer = -1;
}

// verification apres coup si le joueur adverse a plus de points de vie
game.players.checkWinner = function() {
	if (game.players[game.turnPlayer * -1].life <= 0) {
		alert(game.players[game.turnPlayer].name + " win !");
		game.new();
	}
}

//attack le joeur adverse
game.players.attack = function() {
	var domage = game.weapon[game.players[game.turnPlayer].weapon].domage;

	if (game.players[game.turnPlayer * -1].shield)
		domage /= 2;
	game.players[game.turnPlayer * -1].life -= domage;
	game.history(game.players[game.turnPlayer].name + game.weapon[game.players[game.turnPlayer].weapon].text + ' -' + domage + "points de vie");
	game.players.checkWinner();
	game.update();
	game.players[game.turnPlayer].attack = false;
	game.move.combat(true, 0.4);
}

// active le boulcier 
game.players.shield = function() {
	if (game.players[game.turnPlayer].attack) {
		game.players[game.turnPlayer].shield = true;
		game.players[game.turnPlayer].attack = false;
		game.move.combat(true, 0.4);
		game.history(game.players[game.turnPlayer].name + " utilise son bouclier !");
	}
}

// activation d'un timer et stockage de celui ci dans un tableau
game.players.timer = function() {
	timersPlayers.push(setTimeout(function() {
		var timerDiv = document.getElementById("timer" + game.turnPlayer);
		time -= 1;
		timerDiv.innerHTML = time;
		if (time <= 0)
			return (game.pass());
		game.players.timer();
	}, 1000));
}