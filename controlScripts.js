
window.onresize = function(event) {
    //$('#helloa').prepend('<p>Bla bla bla</p>');
    console.log("hello");
};

var main = function() {
    $(".changeMapSizeButton").click(function () {
        var width = $(".mapWidth").val();
        var height = $(".mapHeight").val();

        document.getElementById("map-canvas").style.width = "" + width + "px";
        document.getElementById("map-canvas").style.height = "" + height + "px";
    });
};

$(document).ready(main);