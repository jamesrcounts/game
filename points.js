"use strict";

var points = (function (spec) {
    var self = { value: 0 };
    self.update = function (deltaY) {
        if (10 < deltaY) {
            this.value++;
        }
    };

    self.draw = function () {
        var ctx = spec.context();
        ctx.fillStyle = "Black";
        ctx.fillText("POINTS:" + this.value, 10, spec.height - 10);
    };

    self.reset = function () {
        this.value = 0;
    };

    return self;
})(board);

