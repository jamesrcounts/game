/*jshint bitwise: false*/

define(function () {
    "use strict";

    function createHistogramGrouping(style) {
        return {
            generateX: function (boardWidth, platform) {
                var pos, rand = Math.random(), side;
                if (rand < 0.68) //68-95-99.7 rule
                {
                    if (style === "centered") {
                        pos = ((boardWidth / 3 + (Math.random() * (boardWidth / 3))) - platform.width / 2);
                    }
                    if (style === "left") {
                        pos = (((Math.random() * (boardWidth / 3))) - platform.width / 2);
                    }
                    if (style === "right") {
                        pos = ((2 * boardWidth / 3 + (Math.random() * (boardWidth / 3))) - platform.width / 2);
                    }
                    if (style === "bimodal") {
                        side = ~~(Math.random() * 2) ? "left" : "right";

                        if (side === "left") {
                            pos = (((Math.random() * (boardWidth / 3))) - platform.width / 2);
                        } else {
                            pos = ((2 * boardWidth / 3 + (Math.random() * (boardWidth / 3))) - platform.width / 2);
                        }
                    }
                }
                if (rand < 0.95 && rand >= 0.68) {
                    if (style === "centered" || style === "bimodal") {
                        //left or right side of the "histogram"?
                        side = ~~(Math.random() * 2) ? "left" : "right";
                        if (side === "left") {
                            pos = ((boardWidth / 6 + (Math.random() * (boardWidth / 6))) - platform.width / 2);
                        } else {
                            pos = ((2 * boardWidth / 3 + (Math.random() * (boardWidth / 6))) - platform.width / 2);
                        }
                    }
                    if (style === "left" || style === "right") {
                        pos = ((boardWidth / 3 + (Math.random() * (boardWidth / 3))) - platform.width / 2);
                    }
                }
                if (rand >= 0.95) {
                    if (style === "centered") {
                        //left or right side of the "histogram"?
                        side = ~~(Math.random() * 2) ? "left" : "right";
                        if (side === "left") {
                            pos = (((Math.random() * (boardWidth / 6))) - platform.width / 2);
                        } else {
                            pos = ((5 * boardWidth / 6 + (Math.random() * (boardWidth / 6))) - platform.width / 2);
                        }
                    }
                    if (style === "left") {
                        pos = (((Math.random() * (boardWidth / 6))) - platform.width / 2);
                    }
                    if (style === "right") {
                        pos = ((5 * boardWidth / 6 + (Math.random() * (boardWidth / 6))) - platform.width / 2);
                    }

                    if (style === "bimodal") {
                        pos = ((boardWidth / 3 + (Math.random() * (boardWidth / 3))) - platform.width / 2);
                    }
                }
                return pos;
            }
        };
    }

    return {
        bimodal: createHistogramGrouping("bimodal"),
        centered: createHistogramGrouping("centered"),
        left: createHistogramGrouping("left"),
        right: createHistogramGrouping("right")
    };
});