define(["board", "player"], function (board, player) {
    "use strict";
    var self = { value: 0 };
    //    self.update = function (deltaY) {
    //        var highBar = (spec.height * .5);
    //        var upHigh = hero.Y < highBar;
    //        if (10 < deltaY && upHigh) {
    //            this.value++;
    //        }
    //    };

    //    self.draw = function () {
    //        var ctx = spec.context();
    //        ctx.fillStyle = "Black";
    //        ctx.fillText("POINTS:" + this.value, 10, spec.height - 10);
    //    };

    //    self.reset = function () {
    //        this.value = 0;
    //    };

    return self;
});

//var points;
//points = (function (spec, hero) {
//})(board, player);