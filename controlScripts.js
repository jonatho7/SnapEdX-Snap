
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


function clickOnRunProgramBlock(messageName) {
    //Grab the sprite named Sprite, or just grab the first sprite.
    var sprite = getSprite("Sprite");
    if (sprite == null){
        sprite = getFirstSprite();
    }

    //Ex: Grab the "runStudentProgram" block so I can click on it.
    var runProgramBlock = getWhenIReceiveBlockWithName(messageName, sprite);

    //Click on it.
    runProgramBlock.mouseClickLeft();
}




function startStudentTests() {
    return startStudentOrTeacherTests("student");
}

function startTeacherTests() {
    return startStudentOrTeacherTests("teacher");
}

function startStudentOrTeacherTests(studentOrTeacher) {
    //Initialize individualTestsStatus array.
    var firstInputName = Object.keys(testInputs[0])[0];
    var numberOfTests = testInputs[0][firstInputName].length;
    initializeTestsStatusArray(individualTestsStatus, numberOfTests);

    //Do a run-through of the program, making sure it will run, and grabbing the active process.
    if (studentOrTeacher == "student"){
        clickOnRunProgramBlock("runStudentProgram");
    } else if (studentOrTeacher == "teacher"){
        clickOnRunProgramBlock("runTeacherProgram");
    }

    //Start the grading loop. This function will be called every 100ms and will manage the tests.
    intervalID = setInterval(gradingLoop, 100, studentOrTeacher);

    //Return a message. Note that results will have to be collected later.
    if (studentOrTeacher == "student"){
        return "student tests are running. Please check back later for results.";
    } else if (studentOrTeacher == "teacher"){
        return "teacher tests are running. Please check back later for results.";
    }

}




/**
 * Remember to check testResults.finished to see whether it is true, false, or "failed".
 */
function retrieveTestResults() {
    return testResults;
}


function gradingLoop(studentOrTeacher) {

    //Check to see if we have received an active Snap process to work with yet.
    //If there is an active process, the first run through has finished.
    if (!activeProcess){
        return null;
    }

    if (currentTestNumber == -1){
        testResults.finished = "failed";
        testResults.errorMessage = "Did not include a 'Report answer' block'. Tests failed.";
    } else if (currentTestNumber >= individualTestsStatus.length){
        //All the tests have run and finished. Just gather the variables now.
        testResults.testOutputs = testOutputs;
        testResults.programXML = global_ide.exportProjectWithoutMessages();
        testResults.errorMessage = null;
        testResults.finished = true;

        console.log("tests are finished");

        //Tell the interval function to stop running.
        clearInterval(intervalID);

    } else {
        //Check to see if there is an individual test that can start running.
        if (individualTestsStatus[currentTestNumber] == false){
            //Start the next test.
            individualTestsStatus[currentTestNumber] = "running";
            runIndividualTest(studentOrTeacher, currentTestNumber);
        }
    }

}



var activeProcess;
var intervalID;
/*
individualTestsStatus is an array which keeps track of which individual tests have finished.
The array values are either:
    false: This test has not been called yet.
    "running": This test is currently running.
    true:   This test is finished.
 */
var individualTestsStatus = [];
var currentTestNumber = -1;
var testResults = {
    "finished": false,
    "errorMessage": null,
    "testOutputs": null,
    "programXML": null
};


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



function initializeTestsStatusArray(testArray, numberOfTests) {
    for(var i = 0; i < numberOfTests; i++){
        testArray.push(false);
    }
}



function runIndividualTest(studentOrTeacher, testNumber) {

    //Set the inputs.
    for(var i = 0; i < Object.keys(testInputs).length; i++){
        var inputName = Object.keys(testInputs[i])[0];
        var inputValue = testInputs[i][inputName][testNumber];
        manualDoSetVar(inputName, inputValue);
    }

    //Run the individual test.
    if (studentOrTeacher == "student"){
        clickOnRunProgramBlock("runStudentProgram");
    } else if (studentOrTeacher == "teacher"){
        clickOnRunProgramBlock("runTeacherProgram");
    }

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