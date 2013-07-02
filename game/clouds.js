﻿"use strict";
var clouds = (function (spec) {
    var self = [];
    self.count = 10;

    self.reset = function () {
        for (var j = 0; j < self.count; j++) {
            self[j] = [Math.random() * spec.width,
                Math.random() * spec.height,
                Math.random() * 100,
                Math.random() / 2];
        }
    };

    self.draw = function () {
        var ctx = spec.context();
        for (var i = 0; i < this.count; i++) {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + this[i][3] + ')';
            ctx.beginPath();
            ctx.arc(this[i][0], this[i][1], this[i][2], 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    };

    self.update = function (deltaY) {
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
