/*!
 **|   CyTube Clocks and Timers
 **|   Copyright Xaekai 2014 - 2016
 **|   Version 2016.09.29.2200
 **|
 **@preserve
 */
"use strict";
(function(CyTube_Various) {
    return CyTube_Various(window, document, window.jQuery, Callbacks)
})(function(window, document, $, Callbacks, undefined) {
    const options = Object.assign({}, {
        timers: {
            spacer: "&#8192;",
            format: "HH:mm:ss"
        }
    });
    if (!$("#countdown_next_wrapper").length) return;
    var countdown_id = "countdown_next";
    var countdown_next_target = countdown_next_target || "";
    if (!CLIENT.timers) {
        CLIENT.timers = true;
        setTimeout(function() {
            getTimerDataFromBanner();
            socket.on("setMotd", getTimerDataFromBanner);
            setInterval(function() {
                return updateAllCountdowns()
            }, 1e3)
        }, 2e3)
    }

    function updateAllCountdowns() {
        updateCountdown(countdown_id, countdown_next_target)
    }

    function getTimerDataFromBanner() {
        $("#countdown_next_wrapper").show();
        var Timer = $("#" + countdown_id).attr("data-date");
        if (Timer.match(/^\d+$/)) Timer = parseInt(Timer);
        countdown_next_target = new Date(Timer)
    }

    function updateCountdown(countdown_id, target_date) {
        var days, hours, minutes, seconds;
        var outputString = "";
        var countdown_node = document.getElementById(countdown_id);
        var current_time = (new Date).getTime();
        var target_time = target_date.getTime();
        if (!countdown_node) {
            return
        }
        if (target_time > current_time) {
            var seconds_left = (target_time - current_time) / 1e3;
            days = parseInt(seconds_left / 86400);
            seconds_left = seconds_left % 86400;
            hours = parseInt(seconds_left / 3600);
            seconds_left = seconds_left % 3600;
            minutes = parseInt(seconds_left / 60);
            seconds = parseInt(seconds_left % 60)
        } else {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0
        }
        if (days > 0) {
            outputString += days + " days "
        }
        if (hours < 10) {
            outputString += "0"
        }
        outputString += hours + ":";
        if (minutes < 10) {
            outputString += "0"
        }
        outputString += minutes + ":";
        if (seconds < 10) {
            outputString += "0"
        }
        outputString += seconds;
        countdown_node.innerHTML = outputString
    }
});
