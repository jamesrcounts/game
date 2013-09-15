require.config({
    paths: {
        easeljs: "../lib/easeljs-0.6.0/easeljs-0.6.0.min",
        jquery: "../lib/jquery-1.10.1/jquery-1.10.1",
    },
    shim: {
        easeljs: { exports: 'createjs' },
    }
});

require(["game"], function (game) {
    game.start();
});