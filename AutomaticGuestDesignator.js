/*!
 **|   CyTube Automatic Guest Designator
 **|   Copyright Xaekai 2014 - 2016
 **|   Version 2016.09.26.1800
 **|
 **@requires md5
 **@optional whispers
 **@preserve
 */
"use strict";
(function(CyTube_Designator) {
    return CyTube_Designator(window, document, window.jQuery)
})(function(window, document, $, undefined) {
    if (typeof Storage === "undefined") {
        console.error("[XaeTube: Automatic Designator]", "localStorage not supported. Aborting load.");
        return
    } else if (typeof window.md5 === "undefined") {
        console.error("[XaeTube: Automatic Designator]", "MD5 module not loaded. Aborting load.");
        return
    } else {
        console.info("[XaeTube: Automatic Designator]", "Loading Module.")
    }
    if (!window[CHANNEL.name]) {
        window[CHANNEL.name] = {}
    }
    const options = Object.assign({}, {
        prefix: "Guest-",
        postfix: "",
        source: "ip",
        delay: 180 * 1e3,
        hint: "Please choose a guest name.",
        length: 8
    }, window[CHANNEL.name].modulesOptions ? window[CHANNEL.name].modulesOptions.designator : undefined);
    const state = {
        fails: 0,
        trying: false
    };
    if (CLIENT.rank > 0) {
        console.info("[XaeTube: Automatic Designator]", "Client is a registered user.");
        return
    } else if (CLIENT.rank === 0) {
        console.info("[XaeTube: Automatic Designator]", "Client already signed in as a guest.");
        localStorage.setItem(CHANNEL.name + "_Designation", CLIENT.name);
        return
    } else if (CLIENT.rank === -1) {
        $("#guestname").attr("placeholder", options.hint);
        const storedName = localStorage.getItem(CHANNEL.name + "_Designation");
        if (storedName) {
            $("#messagebuffer").trigger("whisper", String().concat("[Designator] ", "Welcome back ", storedName, "."));
            $("#guestname").val(storedName);
            options.tock = setTimeout(assignName, 10 * 1e3)
        } else {
            $("#messagebuffer").trigger("whisper", String().concat("[Designator] ", "Welcome to ", CHANNEL.name, ". ", "Please sign in with a guest name or one will be provided for you."));
            options.tock = setTimeout(assignName, options.delay)
        }
        signinListen()
    }
    const validUsername = /^[a-z0-9_\-]{1,20}$/i;

    function signinListen() {
        socket.once("login", (data => {
            clearTimeout(options.tock);
            if (!data.success) {
                signinListen();
                if (state.trying) {
                    state.trying = false;
                    if (/restricted/.test(data.error)) {
                        $("div.profile-box:contains(Guest logins)").remove();
                        options.tock = setTimeout(assignName, 15 * 1e3)
                    }
                    if (/already in use/.test(data.error)) {
                        $("div.profile-box:contains(already in use)").remove();
                        state.fails = 4;
                        options.source = "date";
                        $("#messagebuffer").trigger("whisper", String().concat("[Designator] ", "You appear to be connecting from multiple devices. Using fallback."));
                        options.tock = setTimeout(assignName, 15 * 1e3)
                    }
                }
                return
            }
            if (!new RegExp(String().concat("^", options.prefix, "[a-z0-9_\\-]{1,20}", options.postfix, "$")).test(data.name)) {
                localStorage.setItem(CHANNEL.name + "_Designation", data.name)
            }
        }))
    }

    function assignName() {
        if (state.fails === 3) {
            options.source = "date";
            $("#messagebuffer").trigger("whisper", String().concat("[Designator] ", "Error: API appears to be offline. Using fallback."))
        }
        if ($("#guestname").val()) {
            if (validUsername.test($("#guestname").val())) {
                state.trying = true;
                socket.emit("login", {
                    name: $("#guestname").val()
                });
                return
            } else {
                $("#guestname").val(null);
                $("#messagebuffer").trigger("whisper", String().concat("[Designator] ", "Invalid username input. Disregarding."))
            }
        }
        switch (options.source.toLowerCase()) {
            case "date":
                state.trying = true;
                socket.emit("login", {
                    name: String().concat(options.prefix, md5(Date.now().toString()).substring(0, options.length), options.postfix)
                });
                break;
            case "ip":
                $.getJSON("https://ip.pink.horse/ip.json").done((data => {
                    state.trying = true;
                    socket.emit("login", {
                        name: String().concat(options.prefix, md5(data.ip).substring(0, options.length), options.postfix)
                    })
                })).fail((() => {
                    state.fails++;
                    options.tock = setTimeout(assignName, 30 * 1e3)
                }));
                break;
            default:
                console.error("[XaeTube: Automatic Designator]", "Unrecognized hash souce. Terminating.");
                return
        }
    }
});
