var startGame;
var checkCollisions;
var control;
var endGame;
var gameLoop;
var toggleGameLoop;
var updatePieces;
var updateView;
var updateEachPiece;
var drawAllPieces;
var ct;
var bt;
var pt;
var plt;

player.checkEndGame = function () {
    if (points != 0) {
        endGame();
    }
};

checkCollisions = function (hero, platforms) {
    for (var i = 0; i < platforms.count; i++) {
        if (hero.isFalling &&
            hero.X < platforms[i].x + platforms[i].width &&
            hero.X + hero.width > platforms[i].x &&
            hero.Y + hero.height > platforms[i].y &&
            hero.Y + hero.height < platforms[i].y + platforms[i].height) {
            platforms[i].onCollide(hero);
        }
    }
};

updateEachPiece = function (hero, clouds, platforms) {
    var speed;

    checkCollisions(hero, platforms);
    speed = hero.update();
    clouds.update(speed * 0.5);
    platforms.update(speed);
    points.update(hero.jumpSpeed);
};

updatePieces = updateEachPiece;

drawAllPieces = function () {
    var i, l = arguments.length;
    for (i = 0; i < l; i++) {
        arguments[i].draw();
    }
};
updateView = drawAllPieces;

gameLoop = function () {
    updatePieces(player, clouds, platforms, points);
    updateView(board, clouds, player, platforms, points);
};

(function (u) {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;

    startGame = function () {
        createjs.Ticker.addEventListener("tick", u);
    };

    var resume = function () {
        startGame();
        toggleGameLoop = halt;
    };

    var halt = function () {
        createjs.Ticker.removeEventListener("tick", u);
        toggleGameLoop = resume;
    };

    resume();
})(function () { gameLoop(); });

endGame = function () {
    var ctx = board.context();
    updatePieces = function () {
    };
    updateView = function () {
        board.draw();
        ctx.fillStyle = "Black";
        ctx.font = "10pt Arial";
        ctx.fillText("GAME OVER", (board.width / 2) - 60, (board.height / 2) - 50);
        ctx.fillText("YOUR RESULT:" + points.value, board.width / 2 - 60, board.height / 2 - 30);
    };

    toggleGameLoop();
};

ct = new Tangle($("#controls")[0], {
    initialize: function () {
        this.controlType = false;
    },
    update: function () {
        this.controlInstructions = this.controlType;
        cs.toggleControls(this.controlType, player, board.canvas());
    }
});

bt = new Tangle($('#board')[0], {
    initialize: function () {
        this.boardSize = "small";
    },
    update: function () {
        board.size(this.boardSize);
    }
});

ct = new Tangle($('#player')[0], {
    initialize: function () {
        this.playerAgility = "normally";
    },
    update: function () {
        player.agility(this.playerAgility);
    }
});

plt = new Tangle($('#platforms')[0], {
    initialize: function() {
        this.platformsBounce = "rubber";
    },
    update: function() {
        platforms.bounce(this.platformsBounce);
    }
});

function resetAll() {
    var i, l = arguments.length;
    for (i = 0; i < l; i++) {
        arguments[i].reset();
    }
}

function reset() {
    resetAll(player, points, clouds, platforms);
    updatePieces = updateEachPiece;
    updateView = drawAllPieces;
    startGame();
}

$('#reset').click(function (e) {
    e.preventDefault();
    reset();
});