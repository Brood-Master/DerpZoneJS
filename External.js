/*!
 **|  CyTube Channel: MLPA External Script
 **|
 **|  All code written by Xaekai except where otherwise noted.
 **|  Copyright 2014-2019 All Rights Reserved
 **|
 **@preserve
 */
if (!this[CHANNEL.name]) {
    this[CHANNEL.name] = {}
}
if (!this[CHANNEL.name].branding) {
    this[CHANNEL.name].branding = $(".navbar-brand").html("").css({
        "background-image": 'url("https://cdn.discordapp.com/attachments/701588063616499792/712716820796276786/our-hive.png")',
        "height": "50px",
        "min-width": "50px",
		"background-repeat": "no-repeat",
    	"background-size": "cover"
    })
}
if (!this[CHANNEL.name].favicon) {
    this[CHANNEL.name].favicon = $("<link/>").prop("id", "favicon").attr("rel", "shortcut icon").attr("type", "image/png").attr("sizes", "64x64").attr("href", "https://cdn.discordapp.com/attachments/701588063616499792/712716820796276786/our-hive.png").appendTo("head")
}
/*!
 **|   Xaekai's Sequenced Module Loader
 **|
 **@preserve
 */
({
    options: {
        designator: {
            prefix: "Drone-",
            delay: 90 * 1e3
        },
        playlist: {
            collapse: true,
            inlineBlame: true,
            moveReporting: true,
            quickQuality: true,
            recentMedia: true,
            simpleLeader: true,
            syncCheck: true,
            thumbnails: true,
            timeEstimates: true,
            volumeControl: true
        },
        chatext: {
            persistIgnore: true,
            smartScroll: true,
            maxMessages: 120
        },
        userlist: {
            autoHider: true
        },
        various: {
            notepad: true,
            emoteToggle: true
        }
    },
    modules: {
        settings: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/CustomSettingsModal.js?token=ATYENBMXCEM4TMDTCKYJIT3APZLX6",
            done: true
        },
        privmsg: {
            active: 1,
            rank: 1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/PMEnhancements.js?token=ATYENBLUBB23LODIOW5RJULAPZL7A",
            done: true
        },
        whispers: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/VirtualWhispersAndUserJoin.js?token=ATYENBNYIJ2ZSS64UFZIPFTAPZMBO",
            done: true
        },
        userlist: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/UserListExtension.js?token=ATYENBLGGCPH2H36IEQ3FFDAPZMEM",
            done: true
        },
        md5hash: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/md5Hash.js?token=ATYENBPBWF5L7SGPQF2Q7TDAPZMJY",
            done: true
        },
        designator: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/AutomaticGuestDesignator.js?token=ATYENBI7PPGMITANYRJFGC3APZMPA",
            done: true
        },
        playlist: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/PlaylistEnhancements.js?token=ATYENBI4TL4GNE4SQJ6GP4DAPZMS2",
            done: true
        },
        notifier: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/AudioNotifications.js?token=ATYENBJTZWEQI3LK35X6PILAPZMU2",
            done: true
        },
        chatline: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/AdvancedChatline.js?token=ATYENBJJZTRQYYKGPQKMDP3APZMYQ",
            done: true
        },
        chatext: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/ChatMessageExtensions.js?token=ATYENBK2UHUXRMXYGDPRQBDAPZNTU",
            done: true
        },
        chatcolor: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/ChatlineColorSelector.js?token=ATYENBK7CX5ZPN34237TEHLAPZN7C",
            done: true
        },
        colormap: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/ColorMap.js?token=ATYENBIDS6JR4KVQOIXUYQTAPZM6O",
            done: true
        },
        layout: {
            active: 1,
            rank: -1,
            url: "https://raw.githubusercontent.com/Brood-Master/DerpZoneJS/main/ExtendedLayoutOptions.js?token=ATYENBPAJREIWCC6VU4WZWDAPZPY4",
            done: true
        },
        various: {
            active: 1,
            rank: -1,
            url: "https://dl.dropbox.com/s/9idxpta013jt9p0/various.js",
            done: true
        },
        embedmedia: {
            active: 1,
            rank: -1,
            url: "https://dl.dropbox.com/s/dhio89hs1cw2l1b/embedmedia.js",
            done: true
        },
        chaticons: {
            active: 1,
            rank: -1,
            url: "https://dl.dropbox.com/s/4k3n2xjabp44wcj/chaticons.js",
            done: true
        },
        ci_library: {
            active: 1,
            rank: -1,
            url: "https://dl.dropbox.com/s/59f5jxg0aso4tm6/ci_library.js",
            done: true,
            cache: false
        },
        time: {
            active: 1,
            rank: -1,
            url: "https://dl.dropbox.com/s/ixulgoqrh01ejeo/time.js",
            done: true
        }
    },
    getScript: function(url, success, cache = true) {
        return jQuery.ajax({
            url,
            cache,
            success,
            type: "GET",
            dataType: "script"
        })
    },
    initialize: function() {
        if (CLIENT.modules) {
            return
        } else {
            CLIENT.modules = this
        }
        window[CHANNEL.name].modulesOptions = this.options;
        console.info("[XaeModule]", "Begin Loading.");
        this.index = Object.keys(this.modules);
        this.sequencerLoader();
        this.cache = true
    },
    sequencerLoader: function() {
        if (this.state.prev) {
            setTimeout(this.modules[this.state.prev].done, 0);
            this.state.prev = ""
        }
        if (this.state.pos >= this.index.length) {
            return console.info("[XaeModule]", "Loading Complete.")
        }
        var currKey = this.index[this.state.pos];
        if (this.state.pos < this.index.length) {
            if (this.modules[currKey].active) {
                if (this.modules[currKey].rank <= CLIENT.rank) {
                    console.info("[XaeModule]", "Loading:", currKey);
                    this.state.prev = currKey;
                    this.state.pos++;
                    let cache = typeof this.modules[currKey].cache == "undefined" ? this.cache : this.modules[currKey].cache;
                    this.getScript(this.modules[currKey].url, this.sequencerLoader.bind(this), cache)
                } else {
                    if (this.modules[currKey].rank === 0 && CLIENT.rank === -1) {
                        (function(module) {
                            socket.once("login", (data => {
                                if (data.success) {
                                    this.getScript(module.url, false, this.cache)
                                }
                            }))
                        })(this.modules[currKey])
                    }
                    this.state.pos++;
                    this.sequencerLoader()
                }
            } else {
                this.state.pos++;
                this.sequencerLoader()
            }
        }
    },
    state: {
        prev: "",
        pos: 0
    }
}).initialize();
