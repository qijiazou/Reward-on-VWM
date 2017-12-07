

////////////////////////
//     NEW SYNTAX     //
///////////////////////

//define a randomization syntax
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

//Fisher-Yates shuffle: rand.permutation of an array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


//get a random integer within a specific range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}



////////////////////////
//     FUNCTIONS      //
///////////////////////



//retrieve intro page texts

var currentState = 0;
var bonus_setting;

function displayIntroductionText(text, callback){
    var reader = new XMLHttpRequest();
    reader.open('GET', text);
    reader.onreadystatechange = function() {
        if( this.readyState === 4 ) {
            document.getElementById("introduction-text").innerHTML = reader.responseText;
            //!!!! asynchronous behaviour of javascript
            callback();
        }
        //document.getElementById("introduction-text").innerHTML = reader.responseText;
    };
    reader.send();
}

// main: control the progress of experiment; linked to function moveNext()
function move(){
    switch(currentState){
        //case# corresponds to the time that Continue button is clicked
        case 1:
            //confirm_mouse();
            document.getElementById('turkID-container').style.display = "none";
            displayIntroductionText('texts/p1_consent.txt');
            break;
        case 2:
            displayIntroductionText('texts/p2_instruction.txt');

//generate a random bonus condition, direct to different bonus pages, generate bonus rules
            bonus_setting = new bonus_condition();

            function bonus_condition() {

                var bonus_array = [0, 2, 6, 10];
                var bonus = bonus_array.randomElement();
                var bonus_per_point = (bonus / 10).toFixed(1);
                var bonus_pt7 = (bonus_per_point * 7).toFixed(1);

                return [bonus, bonus_per_point, bonus_pt7];
            }

            console.log(bonus_setting);
            break;

        case 3:
            if (bonus_setting[0] === 0){
                displayIntroductionText('texts/p3b_bonus0.txt');
                break;
            } else {
                displayIntroductionText('texts/p3a_bonus.txt', function(){
                    bonus_display()
                });
                break;
            }
        case 4:
            document.getElementById("introduction-container").style.display = "none";
            displayIntroductionText('texts/p4_quiz_instruction.txt');
            document.getElementById('overlayCanvas').style.display = "none";
            document.getElementById('demo-container').style.display = "block";
            imgGabor.src = gaborgen(0, 5); //gaborgen(rotation, frequency = 5)
            randomize_N(10);
            runDemo(1);  //10 or 15
            break;
        case 5:
            //for debugging purpose: check if the data recorded in the demo is valid
            displayIntroductionText('texts/p5_quiz.txt');
            console.log('target orientations: ' + target_angle_array);
            console.log('responses:' + response_array);
            console.log('errors:' + all_error);
            console.log('points:' + all_points);
            console.log('target position indexes:' + target_position_array);
            break;
        case 6:
            if (($('input[name="q1"]:checked').val() === '1A') && ($('input[name="q2"]:checked').val() === '2B') && ($('input[name="q3"]:checked').val() === '3A')){
                displayIntroductionText('texts/p6a_experiment_instruction.txt');
                break;
            } else {
                displayIntroductionText('texts/p6b_disqualify.txt');
                document.getElementById('clickbutton').style.display = "none";
                break;
            }
        case 7:
            document.getElementById("introduction-container").style.display = "none";
            document.getElementById('overlayCanvas').style.display = "none";
            document.getElementById('demo-container').style.display = "block";
            refresh_data();
            randomize_N(250);
            runExperiment(20);  //250
            break;
    }
}


// control the action of the Continue button
function moveNext(){
    currentState++;
    if (currentState===4){
        document.getElementById('clickbutton').style.display = "none";
    }
    if (currentState===7){
        document.getElementById('clickbutton').style.display = "none";
    }
    if (currentState===8){
        document.getElementById('clickbutton').style.display = "none";
    }
    move();
}




//randomly pick one trial
var picked_trial_pt;
var picked_trial_ind;

function pick_trial(){
    picked_trial_ind = getRandomInt(1,10); //change it to 250 before running real experiments!
    picked_trial_pt = all_points[picked_trial_ind];

    //for debugging purpose:
    console.log(picked_trial_ind);
    console.log(picked_trial_pt);
}




function initialize_final_page(){  //function called after the full session is completed

    //results are determined at here
    pick_trial();

    document.getElementById('demo-container').style.display = "none";
    document.getElementById('overlayCanvas').style.display = "none";
    document.getElementById("introduction-text").innerHTML = "";
    document.getElementById('introduction-container').style.display = "block";

    setTimeout(function(){
        displayIntroductionText('texts/p7_final_result.txt', function(){
            result_display()
        });
    }, 2500);


    //document.getElementById('clickbutton').style.display = "block";

}




function bonus_display(){
    document.getElementById("max_bonus").innerHTML = "$" + bonus_setting[0];
    document.getElementById("bonus_per_point").innerHTML = "$" + bonus_setting[1];
    document.getElementById("bonus_pt7").innerHTML = "$" + bonus_setting[2];

}




function result_display(){
    document.getElementById("trial_index").innerHTML = picked_trial_ind;
    document.getElementById("trial_points").innerHTML = picked_trial_pt;
    var actual_bonus = (picked_trial_pt * bonus_setting[1]).toFixed(1);
    document.getElementById("final_bonus").innerHTML = actual_bonus;

}



// refresh the arrays
// if the demo data is also needed, output the data before this function is executed
function refresh_data(){
    N_randperm = [];
    all_points = [];
    all_error = [];
    all_start_angle = [];
    target_position_array = [];
    response_array = [];
    target_angle_array = [];
    now = 1;
    current_gabor_angles = [];
    mouse_check = 0;
}

