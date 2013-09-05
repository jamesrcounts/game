/// <reference path="/lib/jquery-1.10.1/jquery-1.10.1.js"/>
/// <reference path="/src/Main.js" />
/// <reference path="/src/Player.js" />
/// <reference path="/src/Song.js" />
/// <reference path="/spec/SpecHelper.js" />
describe("session data", function () {
    var it = window.it,
        expect = window.expect,
        beforeEach = window.beforeEach,
        describe = window.describe,
        g;
    var expected = {
        partitionKey: "fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa",
        createDate: "2013-09-02T22:31:41.918Z",
        category: "Platforms",
        label: "Bounce",
        value: "flubber"
    };

    beforeEach(function () {
        document.cookie = "sessionid= ;expires=Sat Aug 31 2013 20:56:22 GMT-0700 (Pacific Daylight Time)";
        g = global();
    });

    it("should generate uuids", function () {
        var uuid = g.uuid();
        expect(uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    });

    describe("static tests", function () {
        beforeEach(function () {
            g.uuid = function () { return "fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa"; };
            g.getDate = function () {
                //return "Sat Aug 31 2013 20:56:22 GMT-0700 (Pacific Daylight Time)";
                var d = new Date('2013-09-02T22:31:41.918Z');
                return d.toJSON();
            };
        });

        it("should get session id from cookie when not provided", function () {
            document.cookie = "sessionid=fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa";
            var result = g.collectDataAsync(
                "Platforms",
                "Bounce",
                "flubber");

            expect(result).toEqual(expected);
            expect(g.sessionid).toEqual("fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa");
        });
        it("should get the session id from global when not provided", function () {
            g.sessionid = "fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa";
            var result = g.collectDataAsync(
                "Platforms",
                "Bounce",
                "flubber");
            expect(result).toEqual(expected);
        });

        it("should get the session id from global.uuid when needed", function () {
            var result = g.collectDataAsync(
                "Platforms",
                "Bounce",
                "flubber");
            expect(result)
                .toEqual(expected);
            expect(g.parseCookie().sessionid)
                .toEqual("fa404b90-2b8a-41e4-a3c6-e232bb7c9bfa");
        });
    });

    // _gaq.push(['_trackEvent','Adjust', 'Platforms', 'Bounce', bounce]);
    // dp.push([<session_id>, <category>, <Label>, <value>]);
});