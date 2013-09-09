define(["board"], function (board) {
    "use strict";
    var self = { value: 0 };
    self.update = function (player, deltaY) {
        var highBar = (board.height * 0.5);
        var upHigh = player.Y < highBar;
        if (10 < deltaY && upHigh) {
            this.value++;
        }
    };

    self.draw = function () {
        var ctx = board.context();
        ctx.fillStyle = "Black";
        ctx.fillText("POINTS:" + this.value, 10, board.height - 10);
    };

    self.reset = function () {
        this.value = 0;
    };

    return self;
});