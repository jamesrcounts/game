define(["game"], function (game) {
    describe("game settings", function () {
        it("looks like this at startup", function () {
            expect(JSON.stringify(game.getSettings()))
                .toEqual('{"board":{"width":320},"platforms":{"bounce":2,"count":7,"move":false},"player":{}}');
        });

        it("looks like this when completly populated", function () {
            expect(JSON.stringify(game.getSettings()))
                .toEqual('{"board":{"width":320},"platforms":{"bounce":2,"count":7,"move":false,"grouping":foo},"player":{"agility":foo}}');
        });
    });
});