/*!
 **|  Chatline Color Selector
 **|  Copyright Xaekai 2014 - 2016
 **|  Version 2016.10.04.0100
 **|
 **@requires chatline
 **@optional whispers
 **@preserve
 */
"use strict";
(function(CyTube_ChatLine) {
    return CyTube_ChatLine(window, document, window.jQuery, String)
})(function(window, document, $, String, undefined) {
    if (typeof Storage === "undefined") {
        console.error("[XaeTube: Chat Color]", "localStorage not supported. Aborting load.");
        return
    } else if (!!!$("#chatline").data("advanced")) {
        console.error("[XaeTube: Chat Color]", "Chat Line module not loaded. Aborting load.");
        return
    } else {
        console.info("[XaeTube: Chat Color]", "Loading Module.")
    }
    if (!window[CHANNEL.name]) {
        window[CHANNEL.name] = {}
    }
    class ChatColor {
        constructor() {
            Object.assign(this, {
                toggleState: false,
                cycleState: 0,
                setting: {
                    type: "static",
                    static: "lightgrey",
                    cycle: ["orange", "yellow", "lime"],
                    size: 1
                }
            });
            if (localStorage.getItem(`${CHANNEL.name}_CHATHIST`) !== null) {
                window.CHATHIST = JSON.parse(localStorage.getItem(`${CHANNEL.name}_CHATHIST`));
                window.CHATHISTIDX = CHATHIST.length
            }
            if (localStorage.getItem(`${CHANNEL.name}_chatlineToggle`) !== null) {
                this.toggleState = parseInt(localStorage.getItem(`${CHANNEL.name}_chatlineToggle`))
            }
            if (localStorage.getItem(`${CHANNEL.name}_chatlineSetting`) !== null) {
                Object.assign(this.setting, JSON.parse(localStorage.getItem(`${CHANNEL.name}_chatlineSetting`)))
            }
            $(window).on("unload.chathistory", function() {
                localStorage.setItem(`${CHANNEL.name}_CHATHIST`, JSON.stringify(CHATHIST.slice(CHATHIST.length > 100 ? CHATHIST.length - 100 : 0, CHATHIST.length)))
            });
            $("#chatline").on("staticColorSet", (event => {
                this.handleStaticColorSet(event.color)
            }));
            $("#chatline").on("cycleColorSet", (event => {
                this.handleCycleColorReset(event.color)
            }));
            $("#chatline").on("cycleColorAppend", (event => {
                this.handleCycleColorAppend(event.color)
            }));
            $("#chatline").on("colorTypeSet", (event => {
                this.handleTypeSet(event.setting)
            }));
            /*$("#chatline").on("fontSize", (event => {
                this.fontSize(event)
            }));*/
            this.createToggle();
            this.createStyle();
            this.registerCommand();
            this.registerPreHook();
            return this
        }
        createToggle() {
            this.toggleButton = $("<span/>").html('C<span class="toggle-label">hat </span>C<span class="toggle-label">olor</span>').prop("id", "ChatcolorToggle").attr("title", "Toggle Chat Coloring").addClass("pointer label label-info pull-right").appendTo($("#chatheader")).click(this.toggle.bind(this));
            if (!this.toggleState) {
                this.toggleButton.removeClass("label-info").addClass("label-default")
            }
        }
        createStyle() {
            this.styleSheet = $("<style>").prop("id", "chatlineStyle").attr("type", "text/css").appendTo("head");
            this.setting.size = isNaN(this.setting.size) ? 1 : this.setting.size;
            this.updateStyle(this.setting.size)
        }
        updateStyle(size) {
            this.styleSheet.text(`#messagebuffer div { font-size: ${size}em }`)
        }
        cycleDo() {
            var color = this.setting.cycle[this.setting.cycleState];
            this.setting.cycleState = ++this.setting.cycleState < this.setting.cycle.length ? this.setting.cycleState : 0;
            return color
        }
        handleStaticColorSet(color) {
            var current = this.setting;
            current.type = "static";
            current.static = color;
            $("#messagebuffer").trigger("whisper", `Chatline: Static color changed to ${color}`);
            this.propagate(current)
        }
        handleCycleColorReset(color) {
            var current = this.setting;
            current.type = "cycle";
            current.cycle.length = 0;
            current.cycle.push(color);
            $("#messagebuffer").trigger("whisper", `Chatline: Cycle wiped and populated with ${color}`);
            this.propagate(current)
        }
        handleCycleColorAppend(color) {
            var current = this.setting;
            current.type = "cycle";
            current.cycle.push(color);
            $("#messagebuffer").trigger("whisper", `Chatline: Cycle push ${color}`);
            this.propagate(current)
        }
        handleTypeSet(type) {
            var current = this.setting;
            current.type = type;
            $("div.chat-msg-\\\\\\$server\\\\\\$:contains(Color type)").remove();
            $("#messagebuffer").trigger("whisper", `Chatline: Color type changed to ${type}`);
            this.propagate(current)
        }
        handleCycleColorSet(cycle) {
            var current = this.setting;
            current.type = "cycle";
            current.cycle = cycle;
            this.propagate(current)
        }
        propagate(settings) {
            this.setting = settings;
            localStorage.setItem(`${CHANNEL.name}_chatlineSetting`, JSON.stringify(settings))
        }
        handleSettingsMessage(message, target) {
            $(target).val("");
            var parameters = message.replace(/\/setcolor ?/, "");
            var current = this.setting;
            console.log("Chatline: Current settings:" + JSON.stringify(current));
            if (parameters.match(/toggle/)) {
                this.toggle();
                return
            }
            if (parameters.match(/type|mode/)) {
                parameters = parameters.replace(/type |mode /, "").trim();
                if (parameters.match(/(static|cycle|random)$/)) {
                    return this.handleTypeSet(parameters)
                }
            }
            if (parameters.match(/static/)) {
                parameters = parameters.replace(/static ?/, "").trim();
                if (parameters == "") {
                    this.handleSettingsMessage("/setcolor type static", target);
                    return
                }
                if (parameters.match(/#?([a-f0-9]{3}|[a-f0-9]{6})/i)) {
                    current.static = parameters;
                    $("#messagebuffer").trigger("whisper", `Chatline: Static color changed to ${parameters}`);
                    return this.propagate(current)
                }
            }
            if (parameters.match(/cycle/)) {
                parameters = parameters.replace(/cycle ?/, "").trim().toLowerCase();
                if (parameters == "") {
                    this.handleSettingsMessage("/setcolor type cycle", target);
                    return
                }
                var cycle = JSON.parse(parameters);
                if (cycle.constructor === Array && cycle.length > 0) {
                    current.cycle = cycle;
                    current.cycleState = 0;
                    $("#messagebuffer").trigger("whisper", `Chatline: Cycle changed to ${parameters}`);
                    return this.propagate(current)
                }
            }
        }
        toggle() {
            if (this.toggleState) {
                this.toggleState = false;
                this.toggleButton.addClass("label-default").removeClass("label-info");
                if (this.toggleButtonPanel) {
                    this.toggleButtonPanel.addClass("btn-danger").removeClass("btn-success")
                }
                localStorage.setItem(`${CHANNEL.name}_chatlineToggle`, 0)
            } else {
                this.toggleState = true;
                this.toggleButton.removeClass("label-default").addClass("label-info");
                if (this.toggleButtonPanel) {
                    this.toggleButtonPanel.removeClass("btn-danger").addClass("btn-success")
                }
                localStorage.setItem(`${CHANNEL.name}_chatlineToggle`, 1)
            }
        }
        /*fontSize(event) {
            var current = this.setting;
            if (isNaN(current.size)) current.size = 1;
            if (event.change == "up") {
                current.size = Math.min(current.size * 10 + 1, 25) / 10
            } else if (event.change == "down") {
                current.size = Math.max(current.size * 10 - 1, 4) / 10
            } else {
                return
            }
            this.updateStyle(current.size);
            this.propagate(current, true);
            $("div.chat-msg-\\\\\\$server\\\\\\$:contains(Font size)").remove();
            return $("#messagebuffer").trigger("whisper", `Chatline: Font size modifier changed to ${current.size}em.`)
        }*/
        generateChatlineColor() {
            function genHex() {
                return Math.floor(Math.random() * 180 + 75).toString(16)
            }
            switch (this.setting.type) {
                case "random":
                    return "#" + genHex() + genHex() + genHex();
                case "static":
                    return this.setting.static;
                case "cycle":
                    return this.cycleDo()
            }
        }
        registerCommand() {
            $("#chatline").trigger("registerCommand", ["setcolor", this.handleSettingsMessage.bind(this)])
        }
        registerPreHook() {
            $("#chatline").trigger("registerPreHook", ["chatcolor", this.hook.bind(this)])
        }
        hook(msg) {
            var maxLength = 220;
            if (msg.indexOf("ssc:") == -1 && (msg[0] !== "/" && msg[0] !== ">") && msg.length < maxLength && this.toggleState) {
                msg = `ssc:${this.generateChatlineColor()}  ${msg}`
            }
            return msg
        }
    }
    CLIENT.ChatColor = new ChatColor
});
