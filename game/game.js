var startGame;
var checkCollisions;
var control;
var endGame;
var gameLoop;
var toggleGameLoop;
var platforms;
var updatePieces;
var updateView;
var updateEachPiece;
var drawAllPieces;
var ct;
var bt;
var pt;

player.checkEndGame = function() {
    if (points != 0) {
        endGame();
    }
};


platforms = (function(spec) {
    var self = [];
    var position = 0;

    var createPlatform = function(x, y, type) {
        var platform = { width: 70, height: 20 };
        platform.isMoving = ~~(Math.random() * 2);
        platform.direction = ~~(Math.random() * 2) ? -1 : 1;
        platform.x = ~~x;
        platform.y = y;
        platform.type = type;
        platform.firstColor = type === 1 ? '#AADD00' : '#FF8C00';
        platform.secondColor = type === 1 ? '#698B22' : '#EEEE00';

        platform.onCollide = function() {
            player.fallStop();
            if (type === 1) {
                player.jumpSpeed = 50;
            }
        };
        return platform;
    };

    self.count = 7;

    self.reset = function() {
        position = 0;
        for (var j = 0; j < self.count; j++) {
            self[j] = createPlatform(
                0,
                position,
                ~~(Math.random() * 5) == 0 ? 1 : 0);
            self[j].x = Math.random() * (spec.width - self[j].width);

            if (position < spec.height - self[j].height) {
                position += ~~(spec.height / self.count);
            }
        }
    };

    self.draw = function() {
        var ctx = spec.context();
        for (var i = 0; i < this.count; i++) {
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            var gradient = ctx.createRadialGradient(
                this[i].x + (this[i].width / 2),
                this[i].y + (this[i].height / 2),
                5,
                this[i].x + (this[i].width / 2),
                this[i].y + (this[i].height / 2),
                45);
            gradient.addColorStop(0, this[i].firstColor);
            gradient.addColorStop(1, this[i].secondColor);
            ctx.fillStyle = gradient;
            ctx.fillRect(
                this[i].x,
                this[i].y,
                this[i].width,
                this[i].height);
        }
    };

    self.update = function(deltaY) {
        for (var i = 0; i < this.count; i++) {
            if (this[i].isMoving) {
                if (this[i].x < 0) {
                    this[i].direction = 1;
                } else if (this[i].x > spec.width - this[i].width) {
                    this[i].direction = -1;
                }
                this[i].x += this[i].direction * (i / 2) * ~~(points / 100);
            }

            this[i].y += deltaY;

            if (this[i].y > board.height) {
                this[i] = createPlatform(
                    Math.random() * (board.width - this[i].width),
                    this[i].y - board.height,
                    ~~(Math.random() * 5) == 0 ? 1 : 0);
            }
        }
    };

    self.reset();
    return self;
})(board);

checkCollisions = function(hero, platforms) {
    for (var i = 0; i < platforms.count; i++) {
        if (hero.isFalling &&
            hero.X < platforms[i].x + platforms[i].width &&
            hero.X + hero.width > platforms[i].x &&
            hero.Y + hero.height > platforms[i].y &&
            hero.Y + hero.height < platforms[i].y + platforms[i].height) {
            platforms[i].onCollide();
        }
    }
};
updateEachPiece = function(hero, clouds, platforms) {
    var speed;

    checkCollisions(hero, platforms);
    speed = hero.update();
    clouds.update(speed * 0.5);
    platforms.update(speed);
    points.update(hero.jumpSpeed);
};
updatePieces = updateEachPiece;
drawAllPieces = function() {
    var i, l = arguments.length;
    for (i = 0; i < l; i++) {
        arguments[i].draw();
    }
};
updateView = drawAllPieces;

gameLoop = function() {
    updatePieces(player, clouds, platforms, points);
    updateView(board, clouds, player, platforms, points);
};

(function(u) {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;

    startGame = function() {
        createjs.Ticker.addEventListener("tick", u);
    };

    var resume = function() {
        startGame();
        toggleGameLoop = halt;
    };

    var halt = function() {
        createjs.Ticker.removeEventListener("tick", u);
        toggleGameLoop = resume;
    };

    resume();
})(function() { gameLoop(); });

endGame = function() {
    var ctx = board.context();
    updatePieces = function() {
    };
    updateView = function() {
        board.draw();
        ctx.fillStyle = "Black";
        ctx.font = "10pt Arial";
        ctx.fillText("GAME OVER", (board.width / 2) - 60, (board.height / 2) - 50);
        ctx.fillText("YOUR RESULT:" + points.value, board.width / 2 - 60, board.height / 2 - 30);
    };

    toggleGameLoop();
};

ct = new Tangle($("#controls")[0], {
    initialize: function() {
        this.controlType = false;
    },
    update: function() {
        this.controlInstructions = this.controlType;
        cs.toggleControls(this.controlType, player, board.canvas());
    }
});

bt = new Tangle($('#board')[0], {
    initialize: function() {
        this.boardSize = "small";
    },
    update: function() {
        board.size(this.boardSize);
    }
});

ct = new Tangle($('#player')[0], {
    initialize: function() {
        this.playerAgility = "normally";
    },
    update: function() {
        player.agility(this.playerAgility);
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

$('#reset').click(function(e) {
    e.preventDefault();
    reset();
});