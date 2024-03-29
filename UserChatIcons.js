/*!
 **|  CyTube User Chat Icons
 **|  Copyright Xaekai 2014 - 2016
 **|  Version 2016.08.01.0600
 **|
 **@requires userlist
 **@preserve
 */
"use strict";
(function(CyTube_Chat_Icons) {
    return CyTube_Chat_Icons(window, document, window.jQuery, String)
})(function(window, document, $, String, undefined) {
    if (typeof Storage === "undefined") {
        console.error("[XaeTube: Chat Icons]", "localStorage not supported. Aborting load.");
        return
    } else if (typeof window.userlist !== "function") {
        console.error("[XaeTube: Chat Icons]", "Userlist module not loaded. Aborting load.");
        return
    } else {
        console.info("[XaeTube: Chat Icons]", "Loading Module.")
    }
    if (!window[CHANNEL.name]) {
        window[CHANNEL.name] = {}
    }
    class ChatIcons {
        constructor() {
            if (localStorage.getItem(`${CHANNEL.name}_chatIconsToggle`) === null) {
                localStorage.setItem(`${CHANNEL.name}_chatIconsToggle`, 3)
            }
            Object.assign(this, {
                profileFallback: false,
                identiconFallback: false,
                userlist: {
                    users: userlist(true),
                    data: userlist(false)
                },
                avatars: {},
                users: {},
                cache: Date.now(),
                library: null
            }, window[CHANNEL.name].modulesOptions ? window[CHANNEL.name].modulesOptions.chatIcons : undefined);
            socket.on("chatMsg", (() => {
                this.update()
            }));
            socket.on("pm", (() => {
                this.update()
            }));
            socket.on("addUser", (() => {
                this.refresh()
            }));
            this.createToggle();
            if (this.toggle) {
                this.update()
            }
            if (this.library) {
                $.getJSON(this.library, (data => {
                    console.log(data)
                }))
            }
            return this
        }
        get toggle() {
            return parseInt(localStorage.getItem(`${CHANNEL.name}_chatIconsToggle`))
        }
        set toggle(state) {
            localStorage.setItem(`${CHANNEL.name}_chatIconsToggle`, state)
        }
        refresh() {
            this.userlist.users = userlist(true);
            this.userlist.data = userlist(false)
        }
    }
    Object.assign(ChatIcons.prototype, {
        createToggle: function() {
            $("#chatIconsToggle").remove();
            this.toggleButton = $("<span/>").html('C<span class="toggle-label">hat </span>I<span class="toggle-label">cons</span>').attr("title", "Toggle Chat Icons").prop("id", "chatIconsToggle").addClass("pointer label pull-right").appendTo($("#chatheader"));
            this.toggleButton.on("click", (ev => {
                if (this.toggle === 1) {
                    this.toggle = 2;
                    this.toggleButton.removeClass("label-info label-default").addClass("label-warning");
                    if (!(this.profileFallback || this.identiconFallback)) {
                        this.toggleButton.click()
                    } else {
                        this.stripIcons("fallback")
                    }
                } else if (this.toggle === 2) {
                    this.toggle = 0;
                    this.toggleButton.removeClass("label-info label-warning").addClass("label-default");
                    this.stripIcons()
                } else {
                    this.toggle = 1;
                    this.toggleButton.removeClass("label-default label-warning").addClass("label-info");
                    this.update()
                }
            }));
            this.toggle ? this.toggleButton.addClass("label-info") : this.toggleButton.addClass("label-default")
        },
        generateLookupChart: function(options) {
            options = options || {};
            var push = !!options.push;
            var hide = !!options.hide;
            var avail = false;
            var test_users = Object.keys(this.users);
            var test_icons = Object.keys(this.avatars);
            var test_lookup = {};
            var test_html = "";
            for (var i = 0; i < test_users.length; i++) {
                test_lookup[this.users[test_users[i]]] = test_users[i]
            }
            for (var i = 0; i < test_icons.length; i++) {
                var markup = '<img __ALT style="max-height: 64px;" src="' + this.avatars[test_icons[i]] + '" />';
                if (test_lookup[test_icons[i]]) {
                    markup = markup.replace(/__ALT/, 'alt="' + test_lookup[test_icons[i]] + '"' + " " + 'title="' + test_lookup[test_icons[i]] + '"')
                } else {
                    avail = true;
                    markup = markup.replace(/__ALT/, 'alt="' + "ICON AVAILABLE" + '"' + " " + 'title="' + "ICON AVAILABLE" + '"')
                }
                if (!hide || hide && avail) test_html += markup;
                avail = false
            }
            if (!push) {
                console.log("\n\n" + test_html + "\n\n")
            } else {
                $("#cs-motdtext").val(test_html);
                $("#cs-motdsubmit").click()
            }
        },
        stripIcons: function(wipe) {
            $("strong.chaticon" + (wipe ? ".fallback" : "")).removeClass("chaticon" + (wipe ? " fallback" : ""));
            $("img.chaticon" + (wipe ? ".fallback" : "")).each(function() {
                $(this).parent().text($(this).prop("alt") + ": ")
            })
        },
        formatHTML: function(name, avatar, raw) {
            var choice;
            if (typeof this.override === "string" && this.override.length > 0) {
                choice = this.avatars[this.override]
            } else if (raw) {
                choice = avatar
            } else {
                choice = this.avatars[avatar]
            }
            return String().concat('<span class="helper"></span>', '<img alt="', name, '" ', 'class="chaticon', raw ? " fallback" : "", '" ', 'src="', choice, '" ', 'title="', name, '" ', "/>: ")
        },
        handleFallback: function(target, user) {
            if (this.profileFallback) {
                if (!(this.userlist.users.indexOf(user) > -1)) {
                    return
                }
                if (this.userlist.data[user].profile.image) {
                    return this.injectIcon(target, user, this.userlist.data[user].profile.image)
                }
            }
            if (this.identiconFallback) {
                return this.injectIcon(target, user, String().concat("https://identicons.pink.horse/identicon/", user, "?size=66&cache=", this.cache))
            }
        },
        injectIcon: function(target, user, raw) {
            if (!raw) {
                var icon = this.users[user.toLowerCase()];
                target.innerHTML = this.formatHTML(user, icon, false)
            } else {
                $(target).addClass("fallback");
                target.innerHTML = this.formatHTML(user, raw, true)
            }
            return $(target).addClass("chaticon")
        },
        update: function() {
            if (!this.toggle) {
                return
            }
            setTimeout(scrollChat, 100);
            var self = this;
            $(".username:not(.chaticon)").each(function(index, target) {
                var user = $(this)[0].innerHTML.replace(/: /, "");
                if (self.users[user.toLowerCase()]) {
                    return self.injectIcon(this, user, false).bind(self)
                }
                if (self.toggle == 2) {
                    return
                }
                if (self.profileFallback || self.identiconFallback) {
                    return self.handleFallback(this, user)
                }
            })
        }
    });
    window["ChatIcons"] = window[CHANNEL.name]["ChatIcons"] = new ChatIcons
});
