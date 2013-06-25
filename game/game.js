var board = (function () {
    var self = { width: 320, height: 500, color: '#d0e7f9' };

    self.clear = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.closePath();
        ctx.fill();
    };

    return self;
})();

var player = (function (spec) {
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

    self.move = function (x, y) {
        self.X = x;
        self.Y = y;
    };
    self.moveLeft = function () {
        if (self.X > 0) {
            self.move(self.X - 5, self.Y);
        }
    };
    self.moveRight = function () {
        if (self.X + self.width < spec.width) {
            self.move(self.X + 5, self.Y);
        }
    };
    self.draw = function (ctx) {
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
        } catch (e) {
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
    self.jump = function () {
        if (!self.isJumping && !self.isFalling) {
            self.fallSpeed = 0;
            self.isJumping = true;
            self.jumpSpeed = 17;
        }
    };
    self.checkJump = function (c, p, w) {
        if (self.Y > spec.height * 0.4) {
            self.move(self.X, self.Y - self.jumpSpeed);
        } else {
            if (self.jumpSpeed > 10) {
                points++;
            }
            c.move(self.jumpSpeed * 0.5, spec);
            p.forEach(function (platform, ind) {
                platform.y += self.jumpSpeed;

                if (platform.y > spec.height) {
                    var type = ~~(Math.random() * 5);
                    if (type == 0) {
                        type = 1;
                    } else {
                        type = 0;
                    }
                    p[ind] = new Platform(
                        Math.random() * (spec.width - w),
                        platform.y - spec.height,
                        type);
                }
            });
        }

        self.jumpSpeed--;
        if (self.jumpSpeed == 0) {
            self.isJumping = false;
            self.isFalling = true;
            self.fallSpeed = 1;
        }
    };
    self.checkFall = function () {
        if (self.Y < spec.height - self.height) {
            self.move(self.X, self.Y + self.fallSpeed);
            self.fallSpeed++;
        } else {
            if (points == 0) {
                self.fallStop();
            } else {
                GameOver();
            }
        }
    };
    self.fallStop = function () {
        self.isFalling = false;
        self.fallSpeed = 0;
        self.jump();
    };
    self.move(
        ~~((spec.width - self.width) / 2),
        ~~((spec.height - self.height) / 2));
    self.jump();
    return self;
})(board);

var clouds = (function (spec) {
    var self = [];
    self.count = 10;
    for (var j = 0; j < self.count; j++) {
        self.push([Math.random() * spec.width,
            Math.random() * spec.height,
            Math.random() * 100,
            Math.random() / 2]);
    }

    self.draw = function (ctx) {
        for (var i = 0; i < this.count; i++) {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + this[i][3] + ')';
            ctx.beginPath();
            ctx.arc(this[i][0], this[i][1], this[i][2], 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    };

    self.move = function (dY) {
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

var quit = (function (u) {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener("tick", u);
    return function () {
        createjs.Ticker.removeEventListener("tick", u);
    };
})(function () { GameLoop(); });

var points = 0;
var canvas = document.getElementById('c');
canvas.width = board.width;
canvas.height = board.height;

var ctx = canvas.getContext('2d');

var platform = { width: 70, height: 20 };
var Platform = function (x, y, type) {
    //function takes position and platform type
    var that = this;
    that.isMoving = ~~(Math.random() * 2);
    //first, let's check if platform will be able to move (1) or not (0)
    that.direction = ~~(Math.random() * 2) ? -1 : 1;
    //and then in which direction
    that.firstColor = '#FF8C00';
    that.secondColor = '#EEEE00';
    that.onCollide = function () {
        player.fallStop();
    };
    //if platform type is different than 1, set right color & collision function (in this case just call player's fallStop() method we defined last time
    if (type === 1) {
        //but if type is equal '1', set different color and set jumpSpeed to 50. After such an operation checkJump() method will takes substituted '50' instead of default '17' we set in jump().
        that.firstColor = '#AADD00';
        that.secondColor = '#698B22';
        that.onCollide = function () {
            player.fallStop();
            player.jumpSpeed = 50;
        };
    }

    that.x = ~~x;
    that.y = y;
    that.type = type;

    that.draw = function () {
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        //it's important to change transparency to '1' before drawing the platforms, in other case they acquire last set transparency in Google Chrome Browser, and because clouds in background are semi-transparent it's good idea to fix it. I forgot about that in my 10kApart entry, I think because Firefox and Safari change it by default
        var gradient = ctx.createRadialGradient(that.x + (platform.width / 2), that.y + (platform.height / 2), 5,
            that.x + (platform.width / 2),
            that.y + (platform.height / 2), 45);
        gradient.addColorStop(0, that.firstColor);
        gradient.addColorStop(1, that.secondColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(that.x, that.y, platform.width, platform.height);
        //drawing gradient inside rectangular platform
    };

    return that;
};

var platforms = (function (spec, pspec) {
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
    return self;
})(board, platform);

var checkCollision = function () {
    platforms.forEach(function (e) {
        //check every plaftorm
        if ((player.isFalling) &&
            //only when player is falling
            (player.X < e.x + platform.width) &&
            (player.X + player.width > e.x) &&
            (player.Y + player.height > e.y) &&
            (player.Y + player.height < e.y + platform.height)
            //and is directly over the platform
        ) {
            e.onCollide();
        }
    });
};
var GameOver = function () {
    quit();
    //stop calling another frame
    setTimeout(function () {
        board.clear(ctx);
        ctx.fillStyle = "Black";
        ctx.font = "10pt Arial";
        ctx.fillText("GAME OVER", board.width / 2 - 60, board.height / 2 - 50);
        ctx.fillText("YOUR RESULT:" + points, board.width / 2 - 60, board.height / 2 - 30);
    }, 100);
};

var GameLoop = function () {
    board.clear(ctx);
    clouds.draw(ctx);

    if (player.isJumping) player.checkJump(clouds, platforms, platform.width);
    if (player.isFalling) player.checkFall(board);

    player.draw(ctx);

    platforms.forEach(function (platform, index) {
        if (platform.isMoving) {
            //if platform is able to move
            if (platform.x < 0) {
                //and if is on the end of the screen
                platform.direction = 1;
            } else if (platform.x > board.width - platform.width) {
                platform.direction = -1;
                //switch direction and start moving in the opposite direction
            }
            platform.x += platform.direction * (index / 2) * ~~(points / 100);
            //with speed dependent on the index in platforms[] array (to avoid moving all the displayed platforms with the same speed, it looks ugly) and number of points
        }
        platform.draw();
    });
    checkCollision();
    ctx.fillStyle = "Black";
    //change active color to black
    ctx.fillText("POINTS:" + points, 10, board.height - 10);
    //and add text in the left-bottom corner of the canvas
};
document.onmousemove = function (e) {
    if (player.X + canvas.offsetLeft > e.pageX) {
        //if mouse is on the left side of the player.
        player.moveLeft(board);
    } else if (player.X + canvas.offsetLeft < e.pageX) {
        //or on right?
        player.moveRight(board);
    }
};