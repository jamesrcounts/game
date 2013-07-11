"use strict";
var cs = (function () {

    var controls, controlSystem = {};

    controls = {
        left: function () { player.moveLeft(board); },
        right: function () { player.moveRight(board); },
        togglePlay: function () { toggleGameLoop(); },
        teardown: function () {
        }
    };

    controlSystem.toggleControls = (function () {
        var createWith;
        var currentControls = false;
        var cvs;
        var hero;
        var toggle;
        var toMouse;
        var toKeyboard;
        
        controlSystem.control = Object.create(controls);

        createWith = function (ctor) {
            controlSystem.control.teardown();
            controlSystem.control = ctor(hero, cvs);
        };

        toMouse = function () {
            createWith(createMouseControls);
            toggle = toKeyboard;
        };

        toKeyboard = function () {
            createWith(createKeyboardControls);
            toggle = toMouse;
        };

        toKeyboard();

        return function (controlType, player, canvas) {
            if (currentControls !== controlType) {
                hero = player;
                cvs = canvas;
                toggle();
            }
        };
    })();

    function createKeyboardControls() {
        var self = Object.create(controls);
        var leftArrow = 37;
        var rightArrow = 39;
        var letterp = 80;

        var listener = function (event) {
            var key = event.keyCode;

            if (key === leftArrow) {
                self.left();
            } else if (key === rightArrow) {
                self.right();
            } else if (key === letterp) {
                self.togglePlay();
            }
        };

        document.addEventListener('keydown', listener);

        self.teardown = function () {
            document.removeEventListener('keydown', listener);
        };

        return self;
    }

    function createMouseControls(ref, canvas) {
        var self = Object.create(controls);

        function pointerToTheLeft(e) {
            return ref.X + canvas.offsetLeft > e.pageX;
        }

        function pointerToTheRight(e) {
            return ref.X + canvas.offsetLeft < e.pageX;
        }

        document.onmousemove = function (e) {
            if (pointerToTheLeft(e)) {
                self.left();
            } else if (pointerToTheRight(e)) {
                self.right();
            }
        };

        var listener = function (event) {
            var key = event.keyCode;
            var spaceBar = 32;

            if (key === spaceBar) {
                self.togglePlay();
            }
        };

        document.addEventListener('keydown', listener);

        self.teardown = function () {
            document.onmousemove = null;
            document.onmousedown = null;
            document.removeEventListener('keydown', listener);
        };

        return self;
    }

    return controlSystem;
})();

var ct;
ct = new Tangle($("#controls")[0], {
    initialize: function () {
        this.controlType = true;
    },
    update: function () {
        this.controlInstructions = this.controlType;
        cs.toggleControls(this.controlType, player, board.canvas());
    }
});
