

////////////////////////
//     NEW SYNTAX     //
///////////////////////

//define a randomization syntax
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
};

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
var DEMO;
var turk_code;

var IMIdata = [[]];
var quizanswer = "DNE";


function displayIntroductionText(text, callback){
    var reader = new XMLHttpRequest();
    reader.open('GET', text);
    reader.onreadystatechange = function() {
        if( this.readyState === 4 ) {
            document.getElementById("introduction-text").innerHTML = reader.responseText;
            //!!!! asynchronous behaviour of javascript
            if (callback != undefined)
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
            document.getElementById('turkID-container').style.display = "none";
            displayIntroductionText('texts/p1_consent.txt');
            document.getElementById('backbutton').style.display = "none";
            break;
        case 2:
            displayIntroductionText('texts/p1.5_quiz_notice.txt');
            document.getElementById('backbutton').style.display = "inline";
            break;

        case 3:
            displayIntroductionText('texts/p2_instruction.txt');

            //generate a random bonus condition, direct to different bonus pages, generate bonus rules
            bonus_setting = new bonus_condition();

            function bonus_condition() {

                //var bonus_array = [0.5,0.5];
                //var bonus = bonus_array.randomElement();

                var bonus = 2;

                var bonus_per_point = (bonus / 10).toFixed(2);
                var bonus_pt7 = (bonus_per_point * 7).toFixed(2);


                return [bonus, bonus_per_point, bonus_pt7];
            }

            //console.log(bonus_setting);
            break;

        case 4:
            if (bonus_setting[0] === 0){
                displayIntroductionText('texts/p3b_bonus0.txt');
                break;
            } else {
                displayIntroductionText('texts/p3a_bonus.txt', function(){
                    bonus_display(0)
                });
                break;
            }
        case 5:
            var myYes = function(){
                document.getElementById("introduction-container").style.display = "none";
                displayIntroductionText('texts/p4_quiz_instruction.txt', function(){
                    bonus_display(0)
                });
                document.getElementById('overlayCanvas').style.display = "none";
                document.getElementById('demo-container').style.display = "block";
                imgGabor.src = gaborgen(0, 5); //gaborgen(rotation, frequency = 5)
                document.getElementById('backbutton').style.display = "none";
                randomize_N(10);
                N_walk_through = [1, 4, 8];
                N_randperm = N_walk_through.concat(N_randperm);
                //console.log(N_randperm);
                DEMO = "True";
                runDemo(4, "demo");  //1st arg: #trials; 2nd arg: trial to trial feedback Y/N
            };
            var msg = "Ready??";
            readyGo(msg,myYes);

            break;

        case 6:

            //for debugging purpose: check if the data recorded in the demo is valid
            displayIntroductionText('texts/p5_quiz.txt', function(){
                bonus_display(2);
            });

            //console.log('target orientations: ' + target_angle_array);
            //console.log('responses:' + response_array);
            //console.log('errors:' + all_error);
            //console.log('points:' + all_points);
            //console.log('target position indexes:' + target_position_array);
            break;
        case 7:
            //if qualify, then generate the TurkCode
            if (($('input[name="q1"]:checked').val() === '1A') && ($('input[name="q2"]:checked').val() === '2B') && ($('input[name="q3"]:checked').val() === '3A')) {

                //generate a 7-digit unique MTurk code (letter & number) for the subject
                function generate_code() {
                    var code = "";
                    var counter = 0;
                    for (l = 0; l <= 5; l++) {
                        // [0~9, A~Z, a~z]
                        var i = getRandomInt(48, 57);
                        var j = getRandomInt(65, 90);
                        var k = getRandomInt(97, 122);
                        var myArray = [i, j, k];
                        var new_ascii = myArray.randomElement();
                        counter += new_ascii;
                        var new_letter = String.fromCharCode(new_ascii);
                        code = code.concat(new_letter);

                    }
                    code = code.concat(String.fromCharCode(counter % 73 + 49));
                    return code;
                }

                turk_code = generate_code();

                storeDataDEMO(0);
                displayIntroductionText('texts/p5.5_storedata.txt');
                document.getElementById('clickbutton').style.visibility = "hidden";
                //console.log(quizanswer);
                break;
            } else {
                //store the answers that subject provide
                quizanswer = $('input[name="q1"]:checked').val() + $('input[name="q2"]:checked').val() + $('input[name="q3"]:checked').val();
                //console.log(quizanswer);

                //store DEMO data: for disqualifiers, the TurkCode will be #######
                turk_code = "#######";
                storeDataDEMO(0);


                document.getElementById('clickbutton').style.display = "none";
                break;
            }

        case 8:
            var myYes = function(){
                document.getElementById("introduction-container").style.display = "none";
                document.getElementById('overlayCanvas').style.display = "none";
                document.getElementById('demo-container').style.display = "block";
                refresh_data();
                DEMO = "False";
                randomize_N(250);
                displayIntroductionText('texts/p6.5_introtoIMI.txt');
                runExperiment(20, "full");  //250
            };
            var msg = "Ready??";
            readyGo(msg, myYes);
            break;
        case 9:
            displayIntroductionText('texts/p6.5b_scale1.txt');
            break;
        case 10:
            IMIdata[0][0] = parseInt($('input[name=likert_q1]:checked').val());
            IMIdata[0][1] = parseInt($('input[name=likert_q2]:checked').val());
            IMIdata[0][2] = parseInt($('input[name=likert_q3]:checked').val());
            IMIdata[0][3] = parseInt($('input[name=likert_q4]:checked').val());
            IMIdata[0][4] = parseInt($('input[name=likert_q5]:checked').val());
            displayIntroductionText('texts/p6.5b_scale2.txt');
            break;
        case 11:
            IMIdata[0][5] = parseInt($('input[name=likert_q6]:checked').val());
            IMIdata[0][6] = parseInt($('input[name=likert_q7]:checked').val());
            IMIdata[0][7] = parseInt($('input[name=likert_q8]:checked').val());
            IMIdata[0][8] = parseInt($('input[name=likert_q9]:checked').val());
            IMIdata[0][9] = parseInt($('input[name=likert_q10]:checked').val());
            displayIntroductionText('texts/p6.5b_scale3.txt');
            break;
        case 12:
            IMIdata[0][10] = parseInt($('input[name=likert_q11]:checked').val());
            IMIdata[0][11] = parseInt($('input[name=likert_q12]:checked').val());
            IMIdata[0][12] = parseInt($('input[name=likert_q13]:checked').val());
            IMIdata[0][13] = parseInt($('input[name=likert_q14]:checked').val());
            IMIdata[0][14] = parseInt($('input[name=likert_q15]:checked').val());
            displayIntroductionText('texts/p6.5b_scale4.txt');
            break;
        case 13:
            IMIdata[0][15] = parseInt($('input[name=likert_q16]:checked').val());
            IMIdata[0][16] = parseInt($('input[name=likert_q17]:checked').val());
            IMIdata[0][17] = parseInt($('input[name=likert_q18]:checked').val());
            IMIdata[0][18] = parseInt($('input[name=likert_q19]:checked').val());
            IMIdata[0][19] = parseInt($('input[name=likert_q20]:checked').val());
            //console.log("all IMI responses: " + IMIdata);

            initialize_final_page();
            break;

    }
}


// control the action of the Continue button
function moveNext(){
    if((currentState === 0) && !MturkIDValidation()){
        return;
    } else {
        if (currentState ===5){
            document.getElementById('clickbutton').style.display = "none";
        }
        if (currentState === 7 && !RadioValidation(6)){
            return;
        }
        if (currentState === 10 && !RadioValidation(9)){
            return;
        }
        if (currentState === 11 && !RadioValidation(10)){
            return;
        }
        if (currentState === 12 && !RadioValidation(11)){
            return;
        }
        if (currentState === 13 && !RadioValidation(12)){
            return;
        }
        else {
            if (currentState===8){
                document.getElementById('clickbutton').style.display = "none";
            }
            //if (currentState===8){
             //  document.getElementById('clickbutton').style.display = "none";
            //}
        }
    }
    move();
    //console.log("current state before ++: " + currentState);
    currentState++;
    //console.log("current state after ++: " + currentState);

}


function moveBack() {
        //console.log("current state before --: " + currentState);
        currentState--;
        currentState--;
        //console.log("current state after --: " + currentState);
        move();
        currentState++;
}



//randomly pick one trial
var picked_trial_pt;
var picked_trial_ind;

var picked_trial_ind_1;
var picked_trial_ind_2;
var picked_trial_ind_3;

var picked_trial_pt_1;
var picked_trial_pt_2;
var picked_trial_pt_3;


function pick_trial(){
    var picked_trial_ind_1 = getRandomInt(1,250); //change it to 250 before running real experiments!
    var picked_trial_ind_2 = getRandomInt(1,250);
    var picked_trial_ind_3 = getRandomInt(1,250);

    var picked_trial_pt_1 = all_points[picked_trial_ind_1-1];  //picked trial [1, 250]; all points INDEX [0, 249]!
    var picked_trial_pt_2 = all_points[picked_trial_ind_2-1];  //picked trial [1, 250]; all points INDEX [0, 249]!
    var picked_trial_pt_3 = all_points[picked_trial_ind_3-1];  //picked trial [1, 250]; all points INDEX [0, 249]!

    picked_trial_pt = Math.max([picked_trial_pt_1, picked_trial_pt_2, picked_trial_pt_3]);

    if (picked_trial_pt = picked_trial_pt_1) {
        picked_trial_ind = picked_trial_ind_1;
    } else if (picked_trial_pt = picked_trial_pt_2) {
        picked_trial_ind = picked_trial_ind_2;
    } else if (picked_trial_pt = picked_trial_pt_3) {
        picked_trial_ind = picked_trial_ind_3;
    }

    //for debugging purpose:
    //console.log("pick 1:" + picked_trial_pt_1 + "index" + picked_trial_ind_1);
    //console.log("pick 2:" + picked_trial_pt_2 + "index" + picked_trial_ind_2);
    //console.log("pick 3:" + picked_trial_pt_3 + "index" + picked_trial_ind_3);
    //console.log("final pick point: " + picked_trial_pt + "index" + picked_trial_ind);
}

function consent_accepted(){
    document.getElementById('consent-form').style.display = "none";
    document.getElementById('agree-button').style.display = "none";
    document.getElementById('turkID-container').style.display = "block";
    document.getElementById('introduction-container').style.display = "block";

}

function initialize_IMI(){ //function called after the full session is completed
    //console.log("current state after IMI called: " + currentState);

    //results are determined at here
    pick_trial();
    //THESE TWO LINES ARE FOR TESTING PURPOSE
    //picked_trial_pt = 0;
    //picked_trial_ind = 1;

    document.getElementById('demo-container').style.display = "none";
    document.getElementById('overlayCanvas').style.display = "none";
    document.getElementById('introduction-container').style.display = "block";
    document.getElementById('clickbutton').style.display = "inline";


}



function initialize_final_page(){  //function called after IMI scale is completed

    //results are determined at here
    //pick_trial();
    //picked_trial_pt = 0;
    //picked_trial_ind = 1;


    //document.getElementById('demo-container').style.display = "none";
    //document.getElementById('overlayCanvas').style.display = "none";
    document.getElementById("introduction-text").innerHTML = "";
    document.getElementById('introduction-container').style.display = "block";
    document.getElementById('clickbutton').style.display = "none";

    if (bonus_setting[0] !== 0){
        setTimeout(function(){
            displayIntroductionText('texts/p7a_final_result_bonus.txt', function(){
                result_display()
            });
        }, 2500);
    } else {
        //different display for no bonus condition
        setTimeout(function(){
            displayIntroductionText('texts/p7b_final_result_nobonus.txt', function(){
                result_display_0()
            });
        }, 2500);
    }
}



function bonus_display(status){
    switch (status) {
        case 0:
            if (bonus_setting[0] % 1 == 0){
                document.getElementById("max_bonus").innerHTML = "$" + bonus_setting[0];
            } else{
                document.getElementById("max_bonus").innerHTML = "$" + bonus_setting[0].toFixed(2);
            }
            break;
            //if (bonus_setting[1] == 1) {
            //    document.getElementById("bonus_per_point").innerHTML = "$" + bonus_setting[1];
            //} else {
                //document.getElementById("bonus_per_point").innerHTML = bonus_setting[1] + " cents";
            //}

            //document.getElementById("bonus_pt7").innerHTML = "$" + bonus_setting[2];
        case 1:
            if (bonus_setting[0] % 1 == 0){
                document.getElementById("max_bonus").innerHTML = "$" + bonus_setting[0];
            } else{
                document.getElementById("max_bonus").innerHTML = "$" + bonus_setting[0].toFixed(2);
            }
            break;
        case 2:
            if (bonus_setting[0] % 1 == 0){
                document.getElementById("max_bonus").innerHTML = "$" + (5 + bonus_setting[0]);
            } else{
                document.getElementById("max_bonus").innerHTML = "$" + (5 + bonus_setting[0]).toFixed(2);
            }
            break;
    }


}




function result_display(){

    var actual_bonus;
    //document.getElementById("trial_index").innerHTML = picked_trial_ind;
    //document.getElementById("trial_points").innerHTML = picked_trial_pt;
    if ((picked_trial_pt * bonus_setting[1]) % 1 === 0){
        actual_bonus = picked_trial_pt * bonus_setting[1];
    } else {
        actual_bonus = (picked_trial_pt * bonus_setting[1]).toFixed(2);
    }
    document.getElementById("final_bonus").innerHTML = actual_bonus;
    document.getElementById("turk_code").innerHTML = turk_code;

    //store FULL data here now
    storeDataFULL(actual_bonus,picked_trial_ind,0);


}

function result_display_0(){

    var actual_bonus = 0;

    document.getElementById("turk_code").innerHTML = turk_code;

    //store FULL data here now
    storeDataFULL(actual_bonus,picked_trial_ind,0);
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
    data = [];   ////!!!!!!!!! DEMO DATA WILL BE CLEARED! MAKE SURE TO SAVE DATA AS A SEPARATE CSV BEFORE THIS FUNCTION IS CALLED!

}



/**
 * @return {boolean}
 */

//18-01-30 update: MTurk ID might not be 14 digit long; disable this validation.
function MturkIDValidation(){
    turk_id = document.getElementById("TurkID").value;
    if(turk_id.length == 0){
        document.getElementById("turkID-check").style.display='block';
        alert("Please enter a valid Amazon MTurk Worker ID!");
        return false;
    }
    currentState++;
    return true;
}

/**
 * @return {boolean}
 */
function RadioValidation(status) {
    var condition;

    if (status == 6) {
        condition = ((!$("input[name='q1']").is(':checked')) ||
            (!$("input[name='q2']").is(':checked')) ||
            (!$("input[name='q3']").is(':checked')));
    } else if (status == 9) {
        condition = ((!$("input[name='likert_q1']").is(':checked')) ||
            (!$("input[name='likert_q2']").is(':checked')) ||
            (!$("input[name='likert_q3']").is(':checked')) ||
            (!$("input[name='likert_q4']").is(':checked')) ||
            (!$("input[name='likert_q5']").is(':checked')))
    } else if (status == 10) {
        condition = ((!$("input[name='likert_q6']").is(':checked')) ||
            (!$("input[name='likert_q7']").is(':checked')) ||
            (!$("input[name='likert_q8']").is(':checked')) ||
            (!$("input[name='likert_q9']").is(':checked')) ||
            (!$("input[name='likert_q10']").is(':checked')))
    } else if (status == 11) {
        condition = ((!$("input[name='likert_q11']").is(':checked')) ||
            (!$("input[name='likert_q12']").is(':checked')) ||
            (!$("input[name='likert_q13']").is(':checked')) ||
            (!$("input[name='likert_q14']").is(':checked')) ||
            (!$("input[name='likert_q15']").is(':checked')))
    } else if (status == 12) {
        condition = ((!$("input[name='likert_q16']").is(':checked')) ||
            (!$("input[name='likert_q17']").is(':checked')) ||
            (!$("input[name='likert_q18']").is(':checked')) ||
            (!$("input[name='likert_q19']").is(':checked')) ||
            (!$("input[name='likert_q20']").is(':checked')))
    }

    //check whether all buttons are checked
    if (condition) {
        alert("Please answer all questions!");
        return false;
    }
    return true;
}




//The customized READY GO alert box
//https://www.tutorialspoint.com/How-to-design-a-custom-alert-box-using-JavaScript
function readyGo(msg, myYes) {
    var confirmBox = $("#confirm");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".yes").unbind().click(function() {
        confirmBox.hide();
    });
    confirmBox.find(".yes").click(myYes);
    confirmBox.show();
}




function storeDataDEMO(iteration){

    if(iteration == 5){
        document.getElementById('clickbutton').style.display = "none";
        displayIntroductionText('texts/p5.5_angryemail.txt');
        return;
    }

    //template: here this variable defines what is to be eventually stored into csv
    //right hand side comes from JS code
    var dataObject = {
        type: "DEMO",
        turkCode: turk_code.toString(),
        MTurkID: JSON.stringify(turk_id),
        BonusCondition: bonus_setting[0].toString(),
        Trials: JSON.stringify(data),
        quizAnswer: quizanswer.toString()
    };
    //console.log(JSON.stringify(dataObject));
    dataObject = $(this).serialize() + "&" + $.param(dataObject);

    $.ajax({
        //Send POST request to response.php file asking for specific data
        type: "POST",
        dataType: "json",
        url: "server/storeData.php",
        data: dataObject,
        success: function(dataObject) {
            var attempt = JSON.parse(dataObject["json"]);
            //alert(JSON.stringify(attempt.message));
            if (attempt.message != "OK: 201") {
                setTimeout(function () {
                     displayIntroductionText('texts/p5.5_reconnect.txt');
                     document.getElementById('clickbutton').style.visibility = "hidden";
                    storeDataDEMO(++iteration);
                }, 2500);

            } else {

                //Valid response from server
                if(turk_code == "#######"){
                   displayIntroductionText('texts/p6b_disqualify.txt');
                }else{
                    displayIntroductionText('texts/p6a_experiment_instruction.txt', function(){
                        bonus_display(1)
                    });
                }
                document.getElementById('clickbutton').style.visibility = "visible";

                //alert("Form submitted successfully.\nReturned json: " + JSON.stringify(dataObject));
            }
        }
    });
    return false;
}

function storeDataFULL(actual_bonus,picked_trial,iteration){

    var dataObject = {
        type: "FULL",
        turkCode: turk_code.toString(),
        MTurkID: JSON.stringify(turk_id),
        BonusCondition: bonus_setting[0].toString(),
        ActualBonus: actual_bonus.toString(),
        PickedTrial: picked_trial.toString(),
        CatchTrialResult: catches.toString(),
        Trials: JSON.stringify(data),
        IMI: JSON.stringify(IMIdata)

    };
    //console.log(JSON.stringify(dataObject));
    dataObject = $(this).serialize() + "&" + $.param(dataObject);

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "server/storeData.php", //Relative or absolute path to response.php file
        data: dataObject,
        success: function(dataObject) {
            var attempt = JSON.parse(dataObject["json"]);
             //alert(attempt.message);
             if (attempt.message != "OK: 201") {
                 setTimeout(function () {
                         if(iteration == 15){  //15 attempts, if it doesn't work, then fail
                             alert("Sorry we can't store your data. To receive payment, please take a screenshot of the final result page and send it to the experimenter at nicolezou0815@gmail.com. Thank you!");
                             return;                                                            
                         } else if (iteration == 5){   //after 5 attemps, notify the client
                             alert("Uploading your data now. Please wait...") ;
                         }
                     storeDataFULL(actual_bonus,picked_trial,++iteration);
                 }, 1000);           //try to reconnect the server every 1s

             } else {
                alert('Your data is successfully stored!');
                //alert("Form submitted successfully.\nReturned json: " + JSON.stringify(dataObject));
             }
            //alert(JSON.stringify(attempt.message));
            //alert("Form submitted successfully.\nReturned json: " + JSON.stringify(receivedStimulusAttempt));
        }
    });
    return false;
}