var board = (function() {
    var self = { width: 320, height: 500, color: '#d0e7f9' };

    self.clear = function(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.closePath();
        ctx.fill();
    };

    return self;
})();

var player = (function(spec) {
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

    self.move = function() {
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

    self.draw = function(ctx) {
        try {
            ctx.drawImage(
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
    self.moveTo(
        ~~((spec.width - self.width) / 2),
        ~~((spec.height - self.height) / 2));
    self.jump();
    return self;
})(board);

var clouds = (function(spec) {
    var self = [];
    self.count = 10;
    for (var j = 0; j < self.count; j++) {
        self.push([Math.random() * spec.width,
            Math.random() * spec.height,
            Math.random() * 100,
            Math.random() / 2]);
    }

    self.draw = function(ctx) {
        for (var i = 0; i < this.count; i++) {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + this[i][3] + ')';
            ctx.beginPath();
            ctx.arc(this[i][0], this[i][1], this[i][2], 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    };

    self.move = function(dY) {
        for (var i = 0; i < this.count; i++) {
            if (this[i][1] - this[i][2] <= spec.height) {
                this[i][1] += dY;
            } else {
                this[i][0] = Math.random() * spec.width;
                this[i][2] = Math.random() * 100;
                this[i][1] = 0 - this[i][2];
                this[i][3] = Math.random() / 2;
            }
        }
    };
    return self;
})(board);

var quit = (function(u) {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener("tick", u);
    return function() {
        createjs.Ticker.removeEventListener("tick", u);
    };
})(function() { gameLoop(); });

var points = 0;
player.checkEndGame = function() {
    if (points != 0) {
        endGame();
    }
};

var canvas = document.getElementById('c');
canvas.width = board.width;
canvas.height = board.height;

var ctx = canvas.getContext('2d');

var platform = { width: 70, height: 20 };
var Platform = function(x, y, type) {
    var self = this;
    self.isMoving = ~~(Math.random() * 2);
    self.direction = ~~(Math.random() * 2) ? -1 : 1;
    self.x = ~~x;
    self.y = y;
    self.type = type;
    self.firstColor = type === 1 ? '#AADD00' : '#FF8C00';
    self.secondColor = type === 1 ? '#698B22' : '#EEEE00';

    self.onCollide = function() {
        player.fallStop();
        if (type === 1) {
            player.jumpSpeed = 50;
        }
    };
    return self;
};

var platforms = (function(spec, pspec) {
    var self = [];
    var position = 0;
    var type;

    self.count = 7;
    for (var j = 0; j < self.count; j++) {
        type = ~~(Math.random() * 5);
        type = type == 0 ? 1 : 0;
        self[j] = new Platform(
            Math.random() * (spec.width - pspec.width),
            position,
            type);
        if (position < spec.height - pspec.height) {
            position += ~~(spec.height / self.count);
        }
    }

    self.update = function(hero) {
        for (var i = 0; i < this.count; i++) {
            if (this[i].isMoving) {
                if (this[i].x < 0) {
                    this[i].direction = 1;
                } else if (this[i].x > spec.width - platform.width) {
                    this[i].direction = -1;
                }
                this[i].x += this[i].direction * (i / 2) * ~~(points / 100);
            }
            if (hero.isFalling &&
                hero.X < this[i].x + platform.width &&
                hero.X + hero.width > this[i].x &&
                hero.Y + hero.height > this[i].y &&
                hero.Y + hero.height < this[i].y + platform.height) {
                this[i].onCollide();
            }
        }
    };

    self.draw = function(ctx, hero) {
        this.update(hero);
        for (var i = 0; i < this.count; i++) {
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            var gradient = ctx.createRadialGradient(
                this[i].x + (platform.width / 2),
                this[i].y + (platform.height / 2),
                5,
                this[i].x + (platform.width / 2),
                this[i].y + (platform.height / 2),
                45);
            gradient.addColorStop(0, this[i].firstColor);
            gradient.addColorStop(1, this[i].secondColor);
            ctx.fillStyle = gradient;
            ctx.fillRect(
                this[i].x,
                this[i].y,
                platform.width,
                platform.height);
        }
    };

    self.move = function(deltaY) {
        for (var i = 0; i < this.count; i++) {
            this[i].y += deltaY;

            if (this[i].y > board.height) {
                this[i] = new Platform(
                    Math.random() * (board.width - platform.width),
                    this[i].y - board.height,
                    ~~(Math.random() * 5) == 0 ? 1 : 0);
            }
        }
    };
    return self;
})(board, platform);

var endGame = function() {
    quit();
    board.clear(ctx);
    ctx.fillStyle = "Black";
    ctx.font = "10pt Arial";
    ctx.fillText("GAME OVER", board.width / 2 - 60, board.height / 2 - 50);
    ctx.fillText("YOUR RESULT:" + points, board.width / 2 - 60, board.height / 2 - 30);
};

var updatePieces = function(hero, clouds, platforms) {
    var remainder = hero.move();
    clouds.move(remainder * 0.5);
    platforms.move(remainder);
};

var updateView = function(c) {
    board.clear(c);
    clouds.draw(c);
    player.draw(c);
    platforms.draw(c, player);
};

var gameLoop = function() {
    updatePieces(player, clouds, platforms);
    updateView(ctx);

    if (10 < player.jumpSpeed) {
        points++;
    }

    ctx.fillStyle = "Black";
    ctx.fillText("POINTS:" + points, 10, board.height - 10);
};

document.onmousemove = function(e) {
    if (player.X + canvas.offsetLeft > e.pageX) {
        player.moveLeft(board);
    } else if (player.X + canvas.offsetLeft < e.pageX) {
        player.moveRight(board);
    }
};