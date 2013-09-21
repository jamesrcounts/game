define(["game"], function (game) {
    describe("game data", function () {
        it("looks like this", function () {
            expect(JSON.stringify(game.getSettings())).toEqual('{"board":{"width":320},"platforms":{"bounce":2,"count":7,"move":false},"player":{}}');
        });
    });
});