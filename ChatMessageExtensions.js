/*!
 **|  CyTube Chat Message Extensions
 **|  Copyright Xaekai 2014 - 2017
 **|  Version 2017.12.23.2022
 **|
 **@requires chatline
 **@optional whispers
 **@preserve
 */
"use strict";
(function(CyTube_ChatExtensions) {
    return CyTube_ChatExtensions(window, document, window.jQuery, String)
})(function(window, document, $, String, undefined) {
    if (typeof Storage === "undefined") {
        console.error("[XaeTube: Chat Extensions]", "localStorage not supported. Aborting load.");
        return
    } else if (!!!$("#chatline").data("advanced")) {
        console.error("[XaeTube: Chat Extensions]", "Chat Line module not loaded. Aborting load.");
        return
    } else {
        console.info("[XaeTube: Chat Extensions]", "Loading Module.")
    }
    const options = Object.assign({}, {
        persistIgnore: false,
        smartScroll: false,
        maxMessages: 120
    }, window[CHANNEL.name].modulesOptions ? window[CHANNEL.name].modulesOptions.chatext : undefined, (() => {
        if (localStorage.getItem(`${CHANNEL.name}_maxMessages`) !== null) {
            return {
                maxMessages: parseInt(localStorage.getItem(`${CHANNEL.name}_maxMessages`))
            }
        } else {
            return undefined
        }
    })());
    $("#chatline").trigger("registerCommand", ["setmax", function(message) {
        var parameters = Math.floor(Math.min(200, Math.max(15, Math.abs(parseInt(message.substring(1).replace(/setmax /, ""))))));
        if (!isNaN(parameters)) {
            localStorage.setItem(`${CHANNEL.name}_maxMessages`, parameters);
            options.maxMessages = parameters;
            $("#messagebuffer").trigger("whisper", String().concat("[System] ", "Maximum messagebuffer set to ", parameters))
        } else {
            $("#messagebuffer").trigger("whisper", String().concat("[System] ", "Invalid syntax"))
        }
    }]);
    const increscentStore = {};
    const increscentRoster = [];

    function increscentCalc(message) {
        return message.replace(/<[^>]*>/g, "").length
    }

    function increscentDeploy(data) {
        if (increscentStore[data.username]) {
            var currSize = increscentStore[data.username].data("increscent");
            if (currSize < 260) {
                var message = $("<span/>").appendTo(increscentStore[data.username]);
                message[0].innerHTML = stripImages(execEmotes(data.msg));
                increscentStore[data.username].data("increscent", increscentCalc(data.msg) + currSize);
                return true
            }
        }
        return false
    }

    function increscentCheck(data) {
        if (data.username === "[server]") {
            return false
        }
        if (data.username.match(/bot$/i)) {
            return false
        }
        if (data.meta.addClass === "shout") {
            return false
        }
        if (data.meta.addClass === "drink") {
            return false
        }
        if (data.meta.addClass === "greentext") {
            return false
        }
        if (data.meta.addClass === "server-whisper") {
            return false
        }
        return true
    }
    window.formatChatMessage = function(data, last) {
        if (!data.meta || data.msgclass) {
            data.meta = {
                addClass: data.msgclass,
                addClassToNameAndTimestamp: data.msgclass
            }
        }
        var skip = data.username === last.name;
        var consecutive = skip;
        if (data.meta.addClass === "server-whisper") skip = true;
        if (data.msg.match(/^\s*<strong>\w+\s*:\s*<\/strong>\s*/)) skip = false;
        if (data.meta.forceShowName) skip = false;
        data.msg = stripImages(data.msg);
        data.msg = execEmotes(data.msg);
        last.name = data.username;
        var div = $("<div/>");
        if (data.meta.addClass === "drink") {
            div.addClass("drink");
            data.meta.addClass = ""
        }
        if (USEROPTS.show_timestamps) {
            var time = $("<span/>").addClass("timestamp").appendTo(div);
            var timestamp = new Date(data.time).toTimeString().split(" ")[0];
            time.text("[" + timestamp + "] ");
            if (data.meta.addClass && data.meta.addClassToNameAndTimestamp) {
                time.addClass(data.meta.addClass)
            }
        }
        var name = $("<span/>");
        if (!skip) {
            name.appendTo(div)
        }
        if (consecutive && data.meta.addClass !== "server-whisper") {
            div.addClass("consecutive")
        }
        $("<strong/>").addClass("username").text(data.username + ": ").appendTo(name);
        if (data.meta.modflair) {
            name.addClass(getNameColor(data.meta.modflair))
        }
        if (data.meta.addClass && data.meta.addClassToNameAndTimestamp) {
            name.addClass(data.meta.addClass)
        }
        if (data.meta.superadminflair) {
            name.addClass("label").addClass(data.meta.superadminflair.labelclass);
            $("<span/>").addClass(data.meta.superadminflair.icon).addClass("glyphicon").css("margin-right", "3px").prependTo(name)
        }
        var message = $("<span/>").appendTo(div);
        message[0].innerHTML = data.msg;
        if (true) {
            div.data("increscent", increscentCalc(data.msg))
        }
        if (data.meta.action) {
            name.remove();
            message[0].innerHTML = data.username + " " + data.msg
        }
        if (data.meta.addClass) {
            message.addClass(data.meta.addClass)
        }
        if (data.meta.shadow) {
            div.addClass("chat-shadow")
        }
        div.find("img").load(function() {
            if (SCROLLCHAT) {
                scrollChat()
            }
        });
        return div
    };
    window.addChatMessage = function(data) {
        if (IGNORED.indexOf(data.username) !== -1) {
            return
        }
        if (data.meta.shadow && !USEROPTS.show_shadowchat) {
            return
        }
        if (USEROPTS.no_emotes && !data.msg.match(/<img/) && !data.msg.match(/class="sound-embed"/) && !data.msg.replace(/<\/?\w+ [^>]+?>|<\/?\w+>/g, "").replace(/:[\w.]+:/g, "").replace(/spam filtered/gi, "").replace(/\s/g, "").replace(/[:.!,]/g, "").length) {
            return
        }
        if (options.increscent || CLIENT.increscent) {
            if (increscentCheck(data) && increscentDeploy(data)) {
                return
            }
        }
        var div = formatChatMessage(data, LASTCHAT);
        if (increscentCheck(data)) {
            increscentStore[data.username] = div
        }
        if (Object.keys(increscentStore).length > 3) {
            delete increscentStore[Object.keys(increscentStore)[0]]
        }
        var safeUsername = data.username.replace(/[^\w-]/g, "\\$");
        div.addClass("chat-msg-" + safeUsername);
        div.appendTo($("#messagebuffer"));
        div.mouseover(function() {
            $(".chat-msg-" + safeUsername).addClass("nick-hover")
        });
        div.mouseleave(function() {
            $(".nick-hover").removeClass("nick-hover")
        });
        if ($("#messagebuffer").children().length > options.maxMessages) {
            $($("#messagebuffer").children()[0]).remove()
        }
        if (SCROLLCHAT) scrollChat();
        var isHighlight = false;
        if (CLIENT.name && data.username != CLIENT.name) {
            if (data.msg.toLowerCase().indexOf(CLIENT.name.toLowerCase()) != -1) {
                div.addClass("nick-highlight");
                isHighlight = true
            }
        }
        pingMessage(isHighlight)
    };
    $("#messagebuffer").data("spoilertype", "hover");
    $("#messagebuffer").off("mouseenter.spoiler mouseleave.spoiler");
    $("#messagebuffer").on("mouseenter.spoiler mouseleave.spoiler", ".image-spoiler", function(ev) {
        if ($("#messagebuffer").data("spoilertype") === "click") {
            return
        }
        if (ev.type === "mouseenter") {
            $(this).attr("src", $(this).data()["src"]).attr("data-spoiled", "true")
        } else {
            $(this).attr("src", $(this).data()["spoiler"]).attr("data-spoiled", "false")
        }
    });
    $("#messagebuffer").off("click.spoiler");
    $("#messagebuffer").on("click.spoiler", ".image-spoiler", function(ev) {
        if (!ev.shiftKey && !ev.ctrlKey && ev.altKey) {
            ev.preventDefault();
            if ($(this).hasClass("image-embed-large")) {
                $(this).removeClass("image-embed-large").addClass("image-embed-small");
                return
            }
            if ($(this).hasClass("image-embed-medium")) {
                $(this).removeClass("image-embed-medium").addClass("image-embed-large");
                return
            }
            if ($(this).hasClass("image-embed-small")) {
                $(this).removeClass("image-embed-small").addClass("image-embed-medium");
                return
            }
            return
        }
        if ($("#messagebuffer").data("spoilertype") === "hover") {
            return
        }
        ev.preventDefault();
        if ($(this).attr("data-spoiled") === "false") {
            $(this).attr("src", $(this).data()["src"]).attr("data-spoiled", "true")
        } else {
            $(this).attr("src", $(this).data()["spoiler"]).attr("data-spoiled", "false")
        }
    });
    ({
        toggleState: true,
        toggleButton: $("<span/>").text("Autoscroll").html('S<span class="toggle-label">mart</span>s<span class="toggle-label">croll</span>').attr("title", "Toggle Autoscroller").prop("id", "scrollChatToggle").addClass("pointer label label-info pull-right"),
        start: function() {
            if (!options.smartScroll) {
                return
            }
            if (CLIENT.smartScroll) {
                return
            } else {
                CLIENT.smartScroll = this
            }
            var self = this;
            window.scrollChat = function() {
                if (!self.toggleState) {
                    return
                }
                $("#messagebuffer").scrollTop($("#messagebuffer").prop("scrollHeight"));
                $("#newmessages-indicator").remove();
                IGNORE_SCROLL_EVENT = !0
            };
            socket.on("setAFK", scrollChat);
            socket.on("chatMsg", function(data) {
                if (data.msg.indexOf("<a") != -1 || data.msg.indexOf("<img") != -1) {
                    setTimeout(scrollChat, 500)
                }
            });
            this.toggleButton.appendTo("#chatheader");
            this.toggleButton.on("click", (() => {
                if (this.toggleState) {
                    this.toggleState = false;
                    this.toggleButton.addClass("label-default").removeClass("label-info")
                } else {
                    this.toggleState = true;
                    this.toggleButton.removeClass("label-default").addClass("label-info");
                    scrollChat()
                }
            }));
            document.querySelector("#messagebuffer").addEventListener("scroll", (ev => {
                var target = ev.target;
                if (Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 10) {
                    if (!this.toggleState) {
                        this.toggleButton.click()
                    }
                    return
                }
                if (Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) > 320) {
                    if (this.toggleState) {
                        this.toggleButton.click()
                    }
                }
            }))
        }
    }).start();
    void(() => {
        if (!options.persistIgnore) {
            return
        }
        window.GHOSTS = [];
        if (localStorage.getItem(`${CHANNEL.name}_GHOSTS`) !== null) {
            window.GHOSTS = JSON.parse(localStorage.getItem(`${CHANNEL.name}_GHOSTS`))
        }
        $(window).on("unload.ghosts", function() {
            localStorage.setItem(`${CHANNEL.name}_GHOSTS`, JSON.stringify(window.GHOSTS))
        });
        if (window.GHOSTS.length) {
            let message = `[System] <span style="font-size: 1.4em" class='text-danger'> You currently have the following users ghosted: ${GHOSTS.join(" ")} </span>`;
            $("#messagebuffer").trigger("whisper", message)
        }
        window.IGNORED = window.GHOSTS.slice();
        window.addUserDropdown = function(entry) {
            var name = entry.data("name"),
                rank = entry.data("rank"),
                leader = entry.data("leader"),
                meta = entry.data("meta") || {};
            entry.find(".user-dropdown").remove();
            var menu = $("<div/>").addClass("user-dropdown").appendTo(entry).hide();
            $("<strong/>").text(name).appendTo(menu);
            $("<br/>").appendTo(menu);
            var btngroup = $("<div/>").addClass("btn-group-vertical").appendTo(menu);
            var ignore = $("<button/>").addClass("btn btn-xs btn-default ignore").appendTo(btngroup).click(function() {
                const persist = btngroup.find(".persist");
                if (IGNORED.indexOf(name) == -1) {
                    ignore.text("Unignore User");
                    IGNORED.push(name);
                    persist.removeClass("hidden");
                    let message = `[System] <span style="font-size: 1.4em" class='text-warning'> You have ignored ${name} </span>`;
                    $("#messagebuffer").trigger("whisper", message)
                } else {
                    ignore.text("Ignore User");
                    IGNORED.splice(IGNORED.indexOf(name), 1);
                    persist.addClass("hidden");
                    let message = `[System] <span style="font-size: 1.4em" class='text-success'> You have unignored ${name} </span>`;
                    $("#messagebuffer").trigger("whisper", message)
                }
            });
            var persist = $("<button/>").addClass("btn btn-xs btn-default text-danger persist hidden").appendTo(btngroup).text("Ghost User").click(function() {
                const ignore = btngroup.find(".ignore");
                if (GHOSTS.includes(name)) {
                    persist.text("Ghost User");
                    GHOSTS.splice(IGNORED.indexOf(name), 1);
                    ignore.removeClass("hidden");
                    persist.addClass("hidden");
                    if (IGNORED.includes(name)) {
                        ignore.text("Ignore User");
                        IGNORED.splice(IGNORED.indexOf(name), 1)
                    }
                    let message = `[System] <span style="font-size: 1.4em" class='text-success'> You have unghosted ${name} </span>`;
                    $("#messagebuffer").trigger("whisper", message)
                } else {
                    persist.text("Deghost User");
                    GHOSTS.push(name);
                    ignore.addClass("hidden");
                    let message = `[System] <span style="font-size: 1.4em" class='text-danger'> You have ghosted ${name} </span>`;
                    $("#messagebuffer").trigger("whisper", message)
                }
                localStorage.setItem(`${CHANNEL.name}_GHOSTS`, JSON.stringify(window.GHOSTS))
            });
            if (IGNORED.indexOf(name) == -1) {
                ignore.text("Ignore User")
            } else {
                ignore.text("Unignore User")
            }
            if (GHOSTS.includes(name)) {
                persist.text("Deghost User");
                persist.removeClass("hidden");
                ignore.addClass("hidden")
            }
            if (name !== CLIENT.name) {
                var pm = $("<button/>").addClass("btn btn-xs btn-default").text("Private Message").appendTo(btngroup).click(function() {
                    initPm(name).find(".panel-heading").click();
                    menu.hide()
                })
            }
            if (hasPermission("leaderctl")) {
                var ldr = $("<button/>").addClass("btn btn-xs btn-default").appendTo(btngroup);
                if (leader) {
                    ldr.text("Remove Leader");
                    ldr.click(function() {
                        socket.emit("assignLeader", {
                            name: ""
                        })
                    })
                } else {
                    ldr.text("Give Leader");
                    ldr.click(function() {
                        socket.emit("assignLeader", {
                            name: name
                        })
                    })
                }
            }
            if (hasPermission("kick")) {
                $("<button/>").addClass("btn btn-xs btn-default").text("Kick").click(function() {
                    var reason = prompt("Enter kick reason (optional)");
                    if (reason === null) {
                        return
                    }
                    socket.emit("chatMsg", {
                        msg: "/kick " + name + " " + reason,
                        meta: {}
                    })
                }).appendTo(btngroup)
            }
            if (hasPermission("mute")) {
                var mute = $("<button/>").addClass("btn btn-xs btn-default").text("Mute").click(function() {
                    socket.emit("chatMsg", {
                        msg: "/mute " + name,
                        meta: {}
                    })
                }).appendTo(btngroup);
                var smute = $("<button/>").addClass("btn btn-xs btn-default").text("Shadow Mute").click(function() {
                    socket.emit("chatMsg", {
                        msg: "/smute " + name,
                        meta: {}
                    })
                }).appendTo(btngroup);
                var unmute = $("<button/>").addClass("btn btn-xs btn-default").text("Unmute").click(function() {
                    socket.emit("chatMsg", {
                        msg: "/unmute " + name,
                        meta: {}
                    })
                }).appendTo(btngroup);
                if (meta.muted) {
                    mute.hide();
                    smute.hide()
                } else {
                    unmute.hide()
                }
            }
            if (hasPermission("ban")) {
                $("<button/>").addClass("btn btn-xs btn-default").text("Name Ban").click(function() {
                    var reason = prompt("Enter ban reason (optional)");
                    if (reason === null) {
                        return
                    }
                    socket.emit("chatMsg", {
                        msg: "/ban " + name + " " + reason,
                        meta: {}
                    })
                }).appendTo(btngroup);
                $("<button/>").addClass("btn btn-xs btn-default").text("IP Ban").click(function() {
                    var reason = prompt("Enter ban reason (optional)");
                    if (reason === null) {
                        return
                    }
                    socket.emit("chatMsg", {
                        msg: "/ipban " + name + " " + reason,
                        meta: {}
                    })
                }).appendTo(btngroup)
            }
            var showdd = function(ev) {
                if (ev.shiftKey) return true;
                ev.preventDefault();
                if (menu.css("display") == "none") {
                    $(".user-dropdown").hide();
                    $(document).bind("mouseup.userlist-ddown", function(e) {
                        if (menu.has(e.target).length === 0 && entry.parent().has(e.target).length === 0) {
                            menu.hide();
                            $(document).unbind("mouseup.userlist-ddown")
                        }
                    });
                    menu.show();
                    menu.css("top", entry.position().top)
                } else {
                    menu.hide()
                }
                return false
            };
            entry.contextmenu(showdd);
            entry.click(showdd)
        };
        var users = $("#userlist").children();
        for (var i = 0; i < users.length; i++) {
            addUserDropdown($(users[i]))
        }
    })()
});
