var startGame;
var board;
var canvas;
var checkCollisions;
var clouds;
var control;
var endGame;
var gameLoop;
var toggleGameLoop;
var platforms;
var player;
var points;
var updatePieces;
var updateView;

board = (function() {
    var self = { width: 320, height: 500, color: '#d0e7f9' }, ctx;

    self.draw = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.closePath();
        ctx.fill();
    };

    self.setupCanvas = function(id) {
        var c;

        c = document.getElementById(id);
        c.width = this.width;
        c.height = this.height;
        ctx = c.getContext('2d');

        return c;
    };

    self.context = function() {
        return ctx;
    };

    return self;
})();

canvas = board.setupCanvas('c');

points = (function(spec) {
    var self = { value: 0 };
    self.update = function(deltaY) {
        if (10 < deltaY) {
            this.value++;
        }
    };

    self.draw = function() {
        var ctx = spec.context();
        ctx.fillStyle = "Black";
        ctx.fillText("POINTS:" + this.value, 10, spec.height - 10);
    };

    self.reset = function() {
        this.value = 0;
    };

    return self;
})(board);

player = (function(spec) {
    var self = new Image();
    self.src = "angel.png";
    self.isJumping = false;
    self.isFalling = false;
    self.jumpSpeed = 0;
    self.fallSpeed = 0;
    self.width = 65;
    self.height = 95;
    self.X = 0;
    self.Y = 0;
    self.frames = 1;
    self.actualFrame = 0;
    self.interval = 0;

    self.moveTo = function(x, y) {
        self.X = x;
        self.Y = y;
    };
    self.moveLeft = function() {
        if (self.X > 0) {
            self.moveTo(self.X - 5, self.Y);
        }
    };
    self.moveRight = function() {
        if (self.X + self.width < spec.width) {
            self.moveTo(self.X + 5, self.Y);
        }
    };

    self.update = function() {
        var remainder = 0;
        if (this.isJumping) {
            if (this.Y > spec.height * 0.4) {
                this.moveTo(this.X, this.Y - this.jumpSpeed);
            } else {
                remainder = this.jumpSpeed;
            }

            this.jumpSpeed--;
            if (this.jumpSpeed == 0) {
                this.isJumping = false;
                this.isFalling = true;
                this.fallSpeed = 1;
            }
        }

        if (this.isFalling) {
            if (this.Y < spec.height - this.height) {
                this.moveTo(this.X, this.Y + this.fallSpeed);
                this.fallSpeed++;
            } else {
                this.checkEndGame();
                this.fallStop();
            }
        }

        return remainder;
    };

    self.draw = function() {
        try {
            spec.context().drawImage(
                self,
                0,
                self.height * self.actualFrame,
                self.width,
                self.height,
                self.X,
                self.Y,
                self.width,
                self.height);
        } catch(e) {
        }

        if (self.interval == 4) {
            if (self.actualFrame == self.frames) {
                self.actualFrame = 0;
            } else {
                self.actualFrame++;
            }
            self.interval = 0;
        }
        self.interval++;
    };
    self.jump = function() {
        if (!self.isJumping && !self.isFalling) {
            self.fallSpeed = 0;
            self.isJumping = true;
            self.jumpSpeed = 17;
        }
    };

    self.checkEndGame = function() {
    };

    self.fallStop = function() {
        self.isFalling = false;
        self.fallSpeed = 0;
        self.jump();
    };

    self.reset = function() {
        self.moveTo(
            ~~((spec.width - self.width) / 2),
            ~~((spec.height - self.height) / 2));
        self.jump();
    };

    self.reset();
    return self;
})(board);

player.checkEndGame = function() {
    if (points != 0) {
        endGame();
    }
};

clouds = (function(spec) {
    var self = [];
    self.count = 10;

    self.reset = function() {
        for (var j = 0; j < self.count; j++) {
            self[j] = [Math.random() * spec.width,
                Math.random() * spec.height,
                Math.random() * 100,
                Math.random() / 2];
        }
    };

    self.draw = function() {
        var ctx = spec.context();
        for (var i = 0; i < this.count; i++) {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + this[i][3] + ')';
            ctx.beginPath();
            ctx.arc(this[i][0], this[i][1], this[i][2], 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    };

    self.update = function(deltaY) {
        for (var i = 0; i < this.count; i++) {
            if (this[i][1] - this[i][2] <= spec.height) {
                this[i][1] += deltaY;
            } else {
                this[i][0] = Math.random() * spec.width;
                this[i][2] = Math.random() * 100;
                this[i][1] = 0 - this[i][2];
                this[i][3] = Math.random() / 2;
            }
        }
    };

    self.reset();
    return self;
})(board);

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
var updateEachPiece = function(hero, clouds, platforms) {
    var speed;

    checkCollisions(hero, platforms);
    speed = hero.update();
    clouds.update(speed * 0.5);
    platforms.update(speed);
    points.update(hero.jumpSpeed);
};
updatePieces = updateEachPiece;
var drawAllPieces = function() {
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

var ct = new Tangle(document.getElementById("controls"), {
    initialize: function() {
        this.controlType = false;
    },
    update: function() {
        this.controlInstructions = this.controlType;
        cs.toggleControls(this.controlType, player);
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

$('#tab a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
});

$('#reset').click(function(e) {
    e.preventDefault();
    reset();
});