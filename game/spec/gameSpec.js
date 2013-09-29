define(["game", "player", "platforms", "board"], function (game, player, platforms, board) {
    describe("game settings", function () {
        it("looks like this at startup", function () {
            expect(JSON.stringify(game.getSettings()))
                .toEqual('{"board":{},"platforms":{},"player":{}}');
        });

        it("looks like this when completly populated", function () {
            board.size("huge");
            player.agility("quickly");
            platforms.grouping("anywhere");
            platforms.bounce("flubber");
            platforms.resize(20);
            platforms.move(true);
            expect(JSON.stringify(game.getSettings()))
                .toEqual('{"board":{"size":"huge"},"platforms":{"grouping":"anywhere","bounce":"flubber","platformsCount":20,"move":true},"player":{"playerAgility":"quickly"}}');
        });
    });
});