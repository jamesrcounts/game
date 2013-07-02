"use strict";

var board = (function () {
    var defaultWidth = 320;
    var self = { width: defaultWidth, height: 500, color: '#d0e7f9' };
    var cvs;
    var ctx;

    var setupCanvas = function() {
        if (!cvs) {
            cvs = $('#c')[0];
            cvs.resize = function() {
                this.width = self.width;
                this.height = self.height;
            };
            cvs.resize();
        }

        return cvs;
    };

    var setupContext = function() {
        if (!ctx) {
            ctx = cvs.getContext('2d');
        }
        return ctx;
    };

    self.draw = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.closePath();
        ctx.fill();
    };

    self.size = function(size) {
        var factor;
        switch (true) {
            case /huge/i.test(size):
                factor = 3;
                break;
            case /medium/i.test(size):
                factor = 2;
                break;
            default:
                factor = 1;
        }

        this.width = defaultWidth * factor;
        cvs.resize();
    };

    self.canvas = setupCanvas;
    self.context = setupContext;

    cvs = setupCanvas();
    ctx = setupContext();

    return self;
})();