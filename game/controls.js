"use strict";
var cs = (function() {

    var controls, controlSystem = {};

    controls = {
        left: function() { player.moveLeft(board); },
        right: function() { player.moveRight(board); },
        togglePlay: function() { toggleGameLoop(); },
        teardown: function() {
        }
    };

    controlSystem.toggleControls = (function() {
        var createWith;
        var control = Object.create(controls);
        var currentControls = false;
        var hero;
        var toggle;
        var toMouse;
        var toKeyboard;

        createWith = function(ctor) {
            control.teardown();
            control = ctor(hero);
        };

        toMouse = function() {
            createWith(createMouseControls);
            toggle = toKeyboard;
        };

        toKeyboard = function() {
            createWith(createKeyboardControls);
            toggle = toMouse;
        };

        toKeyboard();

        return function (controlType, player) {
            if (currentControls !== controlType) {
                hero = player;
                toggle();
            }
        };
    })();

    function createKeyboardControls() {
        var self = Object.create(controls);
        var leftArrow = 37;
        var rightArrow = 39;
        var letterp = 80;

        var listener = function(event) {
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

        self.teardown = function() {
            document.removeEventListener('keydown', listener);
        };

        return self;
    }

    function createMouseControls(ref) {
        var self = Object.create(controls);

        function pointerToTheLeft(e) {
            return ref.X + canvas.offsetLeft > e.pageX;
        }

        function pointerToTheRight(e) {
            return ref.X + canvas.offsetLeft < e.pageX;
        }

        document.onmousemove = function(e) {
            if (pointerToTheLeft(e)) {
                self.left();
            } else if (pointerToTheRight(e)) {
                self.right();
            }
        };

        document.onmousedown = function(e) {
            if (e.which == 2 || e.which == 3) {
                self.togglePlay();
            }
        };

        self.teardown = function() {
            document.onmousemove = null;
            document.onmousedown = null;
        };

        return self;
    }

    return controlSystem;
})();