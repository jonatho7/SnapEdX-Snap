
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

    });


    $(".exportSpriteAsXML").click(function () {
        //Get the teacher's Grader sprite as an XML string. For now, I will just assume there is only one sprite.
        var mySprite = global_ide.sprites.contents[0];
        var graderXMLString = global_ide.exportSpriteAsXMLString(mySprite);
        console.log(graderXMLString);

        //Get the teacherProgram xml string.
        var teacherProgramXMLString = global_ide.exportProjectWithoutMessages();
        console.log(teacherProgramXMLString);

    });


};






/**
 *
 * @param spriteName
 * @returns {The sprite that has the specific name, or null.}
 */
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

/**
 *
 * @returns {the first sprite on the stage}
 */
function getFirstSprite() {
    var selectedSprite = global_ide.sprites.contents[0];
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


function clickOnRunStudentProgramBlock() {
    //Grab the sprite named Sprite, or just grab the first sprite.
    var sprite = getSprite("Sprite");
    if (sprite == null){
        sprite = getFirstSprite();
    }

    //Grab the "runStudentProgram" block so I can click on it.
    var runStudentProgramBlock = getWhenIReceiveBlockWithName("runStudentProgram", sprite);

    //Click on it.
    runStudentProgramBlock.mouseClickLeft();
}




function startStudentTests() {

    //Initialize studentTestsStatus array.
    var numberOfTests = 10; //todo. This will not always be 10.
    initializeStudentTestsStatus(numberOfTests);

    //Do a run-through of the student program, making sure it will run, and grabbing the active process.
    clickOnRunStudentProgramBlock()

    //Start the grading loop. This function will be called every 100ms and will manage the tests.
    setInterval(gradingLoop, 100);

    return "student tests are running. Please check back later for results.";

}

/**
 * Remember to check studentTestResults.finished to see whether it is true, false, or "failed".
 * @returns {{finished: string, errorMessage: null, studentOutputs: null, studentProgramXML: null}}
 */
function retrieveStudentTestResults() {
    return studentTestResults;
}

function gradingLoop() {

    //Check to see if we have received an active Snap process to work with yet.
    //If there is an active process, the first run through has finished.
    if (!activeProcess){
        return null;
    }

    if (currentStudentTestNumber == -1){
        studentTestResults.finished = "failed";
        studentTestResults.errorMessage = "Student did not include a 'Report student answer' block'. Tests failed.";
    } else if (currentStudentTestNumber >= studentTestsStatus.length){
        //All the tests have run and finished. Just gather the variables now.
        //todo. Might want to make sure this does not keep running over and over.

        studentTestResults.studentOutputs = studentOutputs;
        studentTestResults.studentProgramXML = null; //todo.

        studentTestResults.errorMessage = null;
        studentTestResults.finished = true;

    } else {
        //Check to see if there is an individual test that can start running.
        if (studentTestsStatus[currentStudentTestNumber] == false){
            //Start the next test.
            studentTestsStatus[currentStudentTestNumber] = "running";
            runIndividualStudentTest(currentStudentTestNumber);
        }
    }

}


/*
studentTestsStatus is an array which keeps track of which individual tests have finished.
The array values are either:
    false: This test has not been called yet.
    "running": This test is currently running.
    true:   This test is finished.
 */
var studentTestsStatus = [];
var currentStudentTestNumber = -1;

var studentTestResults = {
    "finished": false,
    "errorMessage": null,
    "studentOutputs": null,
    "studentProgramXML": null
};
var activeProcess;



//Inputs. todo. Need to get these dynamically.
var testInputs = [
    {
        "selectedCity": ["Denver, CO", "Seattle, WA", "New York City, NY",
        "New York City, NY","New York City, NY","New York City, NY","New York City," +
        "NY","New York City, NY","New York City, NY","New York City, NY"]
    }
    //{
    //    "input2": null,
    //},
    //{
    //    "input3": null,
    //},
];



function initializeStudentTestsStatus(numberOfTests) {
    for(var i = 0; i < numberOfTests; i++){
        studentTestsStatus.push(false);
    }
}



function runIndividualStudentTest(testNumber) {

    //Set the inputs.
    for(var i = 0; i < Object.keys(testInputs).length; i++){
        var inputName = Object.keys(testInputs[i])[0];
        var inputValue = testInputs[i][inputName][testNumber];
        manualDoSetVar(inputName, inputValue);
    }


    //Run the individual test.
    clickOnRunStudentProgramBlock();

}

function manualDoSetVar(varName, varValue) {
    //Grab the sprite named Sprite, or just grab the first sprite.
    var sprite = getSprite("Sprite");
    if (sprite == null){
        sprite = getFirstSprite();
    }

    sprite.variables.parentFrame.vars[varName] = varValue;

}





$(document).ready(main);