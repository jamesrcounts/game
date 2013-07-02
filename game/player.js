"use strict";

var player = (function(spec) {
    var self = new Image();
    var defaultSpeed = 5;
    var speed = defaultSpeed;
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

    self.agility = function(agility) {
        var factor;
        switch (true) {
        case /slowly/i.test(agility):
            factor = 1 / 3;
            break;
        case /quickly/i.test(agility):
            factor = 3;
            break;
        default:
            factor = 1;
        }

        speed = defaultSpeed * factor;
    };

    self.moveTo = function(x, y) {
        self.X = x;
        self.Y = y;
    };
    self.moveLeft = function() {
        if (self.X > 0) {
            self.moveTo(self.X - speed, self.Y);
        }
    };
    self.moveRight = function() {
        if (self.X + self.width < spec.width) {
            self.moveTo(self.X + speed, self.Y);
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
    
    self.jump = function(deltaY) {
        if (!self.isJumping && !self.isFalling) {
            self.isJumping = true;
            self.jumpSpeed = deltaY;
        }
    };

    self.checkEndGame = function() {
    };

    self.fallStop = function() {
        self.isFalling = false;
        self.fallSpeed = 0;
    };

    self.reset = function() {
        self.moveTo(
            ~~((spec.width - self.width) / 2),
            ~~((spec.height - self.height) / 2));
        self.jump(17);
    };

    self.reset();
    return self;
})(board);