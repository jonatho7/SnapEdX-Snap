
window.onresize = function(event) {
    //$('#helloa').prepend('<p>Bla bla bla</p>');
    //console.log("hello");
};

var main = function() {
    $(".changeMapSizeButton").click(function () {
        var width = $(".mapWidth").val();
        var height = $(".mapHeight").val();

        document.getElementById("map-canvas").style.width = "" + width + "px";
        document.getElementById("map-canvas").style.height = "" + height + "px";
    });

    $(".changeMapSize1").click(function () {
        document.getElementById("map-canvas").style.width = "640px";
        document.getElementById("map-canvas").style.height = "360px";
    });

    $(".changeMapSize2").click(function () {
        document.getElementById("map-canvas").style.width = "864px";
        document.getElementById("map-canvas").style.height = "486px";
    });

    $(".changeMapSize3").click(function () {
        document.getElementById("map-canvas").style.width = "1024px";
        document.getElementById("map-canvas").style.height = "576px";
    });

    $(".changeMapSize4").click(function () {
        document.getElementById("map-canvas").style.width = "1280px";
        document.getElementById("map-canvas").style.height = "720px";
    });




    $("#goButton").click(function () {
        console.log("Clicked on goButton.");
    });

    $("#getValueButton").click(function () {
        console.log("Clicked on getValueButton.");

        //var check=document.getElementById("myFrame").contentDocument;

        var check = window.frames[0].window.googleMarkerList;

        console.log(check);
        alert(check)

        //Here is code for how to access a parent ID element from inside of the iframe.
        //window.parent.document.getElementById('target');
        //from http://stackoverflow.com/questions/7027799/access-elements-of-parent-window-from-iframe

;
    });


    $(".exportSpriteAsXML").click(function () {
        //Get the teacher's Grader sprite as an XML string. For now, I will just assume there is only one sprite.
        var mySprite = global_ide.sprites.contents[0];
        var graderXMLString = global_ide.exportSpriteAndReturnString(mySprite);
        console.log(graderXMLString);

        //Get the teacherProgram xml string.
        var teacherProgramXMLString = global_ide.exportProjectWithoutMessages();
        console.log(teacherProgramXMLString);

    });



    $(".testButton").click(function () {
        //Testing.
        console.log(world);
        console.log(global_ide);
        console.log(global_ide.stage.threads.processes);
        console.log("testInputs:", testInputs);

    });


    $(".broadcastAMethod").click(function () {
        //Get the Control Sprite.
        //var controlSprite = getSprite("Control");

        //Get the Control sprite's script. Assume it only has one.
        //var controlSpriteScripts = controlSprite.scripts.children[0];

        //Click on this script, in order to run it.
        //controlSpriteScripts.mouseClickLeft();



        runTests();



    });




};


function runTests() {
    //Grab the first sprite. todo. Handle multiple sprites.
    var selectedSprite =  global_ide.sprites.contents[0];

    //Grab the "runTests" script.
    var runTestsBlock = getWhenIReceiveBlockWithName("runTests", selectedSprite);
    console.log("runTestsBlocks: ", runTestsBlock);

    //Click on this.
    runTestsBlock.mouseClickLeft();

    return "running";

}


function getTestOutputs() {
    return testOutputs;
}


function exportSprite(){
    return 0;
}





function getSprite(spriteName) {
    //Get the selected sprite.
    var selectedSprite = null;
    for (var i = 0; i < global_ide.sprites.contents.length; i++) {
        var tempSprite = global_ide.sprites.contents[i];
        if (tempSprite.name == spriteName) {
            selectedSprite = tempSprite;
            break;
        }
    }
    //If the sprite is not found, throw an error...

    return selectedSprite;
}



function getWhenIReceiveBlockWithName(messageName, sprite) {
    //Ex: Get the When I Receive HatBlockMorph that says "runTests".
    var runTestsBlock = null;
    for (var i = 0; i < sprite.scripts.children.length; i++) {
        var tempBlock = sprite.scripts.children[i];

        var inputSlotMorphBlock;
        for(var j = 0; j < tempBlock.children.length; j++){
            var tempMorphBlock = tempBlock.children[j];
            if (tempMorphBlock instanceof InputSlotMorph){
                inputSlotMorphBlock = tempMorphBlock;
                break;
            }
        }

        var tempMessage = inputSlotMorphBlock.children[0].text;
        if (tempMessage == messageName) {
            runTestsBlock = tempBlock;
            break;
        }

    }

    return runTestsBlock;
}









$(document).ready(main);