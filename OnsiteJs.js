$("#sgbutton4").remove();
$('<button class="btn btn-sm btn-default" id="sgbutton4"><a target="_blank" href="https://docs.google.com/document/d/13IPsIyq-AX4NwBtYGOo1S_qRMHcs-OP8PaUfhY_M9Vg/edit?usp=sharing" >Poners</a></button>').appendTo('#leftcontrols');

$("#sgbutton3").remove();
$('<button class="btn btn-sm btn-default" id="sgbutton3"><a target="_blank" href="https://docs.google.com/document/d/1GgRaQHyguXUc6c4m-Ood3Gn_cKEwMV-oKkqymRk-tzU/edit?usp=sharing" >Movies</a></button>').appendTo('#leftcontrols');

var sgsrc = `<iframe src="https://cdn.discordapp.com/attachments/701588063616499792/766609424893739008/9e8853a9eec6470653034b96c200ff21.jpg" title="Nya!" style="width:100%; height:100%;"></iframe>`;
$("#sgbutton2").remove();
$('<button class="btn btn-sm btn-default" id="sgbutton2"><a target="_blank" >Science</a></button>').appendTo('#leftcontrols').on("click", function() {
    document.write(sgsrc)
});

$("#sgbutton1t").remove();
$("#sgbutton1").remove();
$("<button>").attr("id", "sgbutton1t").addClass("btn btn-sm btn-default").text("Block referrers").on("click", function() {
    if ($(this).hasClass("btn-success")) {
        $("#sgbutton1").remove()
    } else {
        $("<meta>").attr("name", "referrer").attr("content", "no-referrer").attr("id", "blockrefs").appendTo($("head"));
        $("img[class*=embed]:not(refblock)").each(function() {
            $(this).attr("src", $(this).attr("src") + "#" + Date.now()).addClass("refblock")
        })
    }
    $(this).toggleClass("btn-default btn-success")
}).prependTo("#leftcontrols");
