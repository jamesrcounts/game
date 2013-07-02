"use strict";

var platforms = (function (spec) {
    var self = [];
    var position = 0;
    var defaultBounce = 17;
    var cor = defaultBounce;
    
    var createPlatform = function (x, y, type) {
        var platform = { width: 70, height: 20 };
        platform.isMoving = ~~(Math.random() * 2);
        platform.direction = ~~(Math.random() * 2) ? -1 : 1;
        platform.x = ~~x;
        platform.y = y;
        platform.type = type;
        platform.firstColor = type === 1 ? '#AADD00' : '#FF8C00';
        platform.secondColor = type === 1 ? '#698B22' : '#EEEE00';

        platform.onCollide = function (hero) {
            hero.fallStop();
            hero.jump(type === 1 ? 3*cor : cor);
        };
        return platform;
    };

    self.count = 7;

    self.bounce = function(bounce) {
        var factor;
        switch (true) {
            case /wood/i.test(bounce):
                factor = 1 / 3;
                break;
            case /flubber/i.test(bounce):
                factor = 3;
                break;
            default:
                factor = 1;
        }
        
        cor = defaultBounce * factor;
    };

    self.reset = function () {
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

    self.draw = function () {
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

    self.update = function (deltaY) {
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
