
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


    /**
     * This method is not working right now. Please ignore it.
     */
    $(".broadcastAMethod").click(function () {

        //Get the Grader sprite.
        graderSprite = null;
        for (var i = 0; i < global_ide.sprites.contents.length; i++) {
            var tempSprite = global_ide.sprites.contents[i]
            if (tempSprite.name == "Grader") {
                graderSprite = tempSprite;
                break;
            }
        }
        //If the Grader sprite is not found, throw an error... Do this later.


        //Get the HatBlockMorph that says "initializeTestInputs".
        var initializeTestInputsBlock;
        for (var i = 0; i < graderSprite.scripts.children.length; i++) {
            var tempBlock = graderSprite.scripts.children[i];
            var tempMessage = tempBlock.children[3].children[0].text;
            if (tempMessage == "initializeTestInputs") {
                initializeTestInputsBlock = tempBlock;
                break;
            }
        }
        //If the "initializeTestInputs" block is not found, throw an error...Do this later.


        //Run this set of blocks. The input block will set the JS variable called testInputs.
        initializeTestInputsBlock.mouseClickLeft();


        //The "Set the inputs block" will signify that the initializeTestInputs blocks are finished running.
        //This block will call the method below, named: .

    });

    $(".testButton").click(function () {
        //Testing.
        console.log("controlScripts:", testInputs);

        console.log(world);
        console.log(global_ide);
        console.log(global_ide.stage.threads.processes);
    });





};

function runTeacherProgram(theProcess) {
    console.log("done with the inputs block.");
    console.log(graderSprite);


    //Get the HatBlockMorph that says "teacherProgram".
    var teacherProgramBlock;
    for (var i = 0; i < graderSprite.scripts.children.length; i++) {
        var tempBlock = graderSprite.scripts.children[i];

        var inputSlotMorphBlock;
        for(var j = 0; j < tempBlock.children.length; j++){
            var tempMorphBlock = tempBlock.children[j];
            if (tempMorphBlock instanceof InputSlotMorph){
                inputSlotMorphBlock = tempMorphBlock;
                break;
            }
        }

        var tempMessage = inputSlotMorphBlock.children[0].text;
        if (tempMessage == "teacherProgram") {
            teacherProgramBlock = tempBlock;
            break;
        }

    }
    console.log("teacherProgramBlock: ", teacherProgramBlock);
    //If the "teacherProgram" block is not found, throw an error...Do this later.


    //Now run the teacherProgram against each testInput. Save the results in a dictionary.


    //Iteration 1.
    var keys = Object.keys(testInputs);
    console.log(keys);
    //todo. handle more than one key.

    var variableName = keys[0];
    var variableValueList = testInputs[variableName];

    var value1 = variableValueList[0];
    console.log("value1: ", value1);

    //Perhaps grab the process first, and then call doSetVar on it?

    //Process.prototype.doSetVar(variableName, value1);


    //teacherProgramBlock.mouseClickLeft();

    //Iteration 2.
    //teacherProgramBlock.mouseClickLeft();

}


var graderSprite = null;


$(document).ready(main);