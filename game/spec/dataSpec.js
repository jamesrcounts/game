define(["data"], function (data) {
    var expected = {
        partitionKey: "fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa",
        createDate: "2013-09-02T22:31:41.918Z",
        category: "Platforms",
        label: "Bounce",
        value: "flubber"
    };

    describe("the data model", function () {
        it("should generate uuids", function () {
            var uuid = data.uuid();
            expect(uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        });

        describe("the collected data", function () {
            beforeEach(function () {
                document.cookie = "sessionid= ;expires=Sat Aug 31 2013 20:56:22 GMT-0700 (Pacific Daylight Time)";
                delete data.sessionid;
                data.uuid = function () { return "fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa"; };
                data.getDate = function () {
                    return new Date('2013-09-02T22:31:41.918Z').toJSON();
                };
            });

            it("should get the cached session id when available", function () {
                data.sessionid = "fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa";
                var result = data.collectDataAsync(
                    "Platforms",
                    "Bounce",
                    "flubber");
                expect(result).toEqual(expected);
            });

            it("should get session id from cookie when available", function () {
                document.cookie = "sessionid=fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa";
                var result = data.collectDataAsync(
                    "Platforms",
                    "Bounce",
                    "flubber");

                expect(result).toEqual(expected);
                expect(data.sessionid).toEqual("fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa");
            });

            it("should get the session id from global.uuid when needed", function () {
                var result = data.collectDataAsync(
                    "Platforms",
                    "Bounce",
                    "flubber");
                expect(result)
                    .toEqual(expected);
                expect(data.parseCookie().sessionid)
                    .toEqual("fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa");
            });
        });
    });
});