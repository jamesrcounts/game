/*jshint bitwise: false*/
var global = function () {
    "use strict";
    var self = {};

    require(["player"], function (player) {
        player.g = self;
    });

    var setSessionCookie = function (name, value) {
        var cookie = name + "=" + value;
        document.cookie = cookie;
        return cookie;
    };

    self.parseCookie = function () {
        var cookie = {};
        var crumbs = document.cookie.split(';');
        var crumbsCount = crumbs.length;
        for (var i = 0; i < crumbsCount; i++) {
            var pair = crumbs[i].split('=');
            var key = pair[0] || "";
            if (key !== "") {
                cookie[key.trim()] = pair[1];
            }
        }
        return cookie;
    };

    var getSessionFromCookie = function () {
        var cookie = self.parseCookie();
        return cookie.sessionid;
    };

    var getSession = function () {
        if (!self.sessionid) {
            self.sessionid = getSessionFromCookie();
            if (!self.sessionid) {
                self.sessionid = self.uuid();
                setSessionCookie("sessionid", self.sessionid);
            }
        }
        return self.sessionid;
    };

    self.uuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    self.getDate = function () {
        return new Date().toJSON();
    };

    self.collectDataAsync = function ($category, $label, $value) {
        var result = {
            partitionKey: getSession(),
            createDate: self.getDate(),
            category: $category,
            label: $label,
            value: $value,
        };

        $.post("/Collect", result);

        return result;
    };

    return self;
};