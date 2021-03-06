
////**********    IMPROVING NOTES    *********////
// *feedback needed* 1. GET THE RIGHT SIGMA FOR SET SIZE CONDITION
// *solved* 2. FIX THE CONTINUE BUTTON CSS-- CENTER IT AFTER DEMO
// *solved* 3. FIX THE POINTS CSS? CAN I MAKE IT BIGGER?
// *solved* 4. (IN ALL_FUNCTIONS.JS) FIX THE DISPLAY OF TEXT (BONUS CONDITION AND FINAL BONUS)
// *solved* 5. BUG: IF YOU DON'T MOVE YOUR MOUSE, THE ERROR WILL EQUAL TO -REAL ANGLE!!
// *feedback needed* 6. FIX MOUSE MOVEMENT?
// *solved* 7. ATTENTION CHECK, RANDOMLY INSERT 3 KEYDOWN QUESTIONS IN THE FULL SESSION.
// *solved* 8. AFTER DEMO, WHY THERE IS A FLASH OF THE PREVIOUS SCREEN?
// *solved* 9. FIRST DEMO TRIAL: WHY CAN'T SEE GABOR?
// *solved* 10. MOUSE-CHECK FUNCTION: NO MORE THAN 3 CONSECUTIVE NON-MOVEMENT RESPONSE
// *solved* 11. TIMER: REACTION TIME!
// *solved* 12. WE WILL NOT BLOCK PEOPLE FOR CONTINUOUS CLICKING NOW!
// *solved* 13. GENERATE A UNIQUE MTURK CODE AT THE END
////**********    IMPROVING NOTES    *********////


//// **** NEXT STEPS **** ////
// 1. DATA OUTPUT (into CSV: 250 trials * 18 columns)
// 2. SERVER (CHECK WITH ZAHY & JENN?)
// 3. PILOT RUNS!
//// **** NEXT STEPS **** ////


//// **** DATA TO RECORD **** ////

// 1A. trial number;
// 2B. SET SIZE;
// 3C-10J. 8 columns for each gabor angle (if it's empty, then NaN: initialize it with NaN)
// 11K. PROBED POSITION;
// 12L. THE REAL ANGLE OF THE PROBED;
// 13M. THE STARTING ANGLE OF THE PROBED;
// 14N. RESPONSE ANGLE;
// 15O. ERROR;
// 16P. #POINTS;
// 17Q. REACTION TIME (MS)
// 18R. RESPONSE CHECK;



//ID (BOTH MTURK + SELF-GENERATED)
//BONUS CONDITION
//FINAL TRIAL PICKED
//FINAL BONUS
//CATCH TRIAL RESULTS

//PROBABLY LOWER THE BASE RATE?? $2 --> $1.5?? Or should we tell them "You won't get any money if you fail all attention checks"?

//GURECKIS TODT'S LAB: ZHIWEI FOR MTURK; MINGYU AND JENN FOR PAYING

//READ ME FILE: MAKE IT CLEAR TO OTHERS HOW THE DATA IS GENERATED



var N_array = [1, 2, 4, 6, 8];
var N_randperm = [];
var all_error = [];
var all_points = [];
var all_start_angle = [];

var canvas;
var ctx;
var crossSize = 5;
var gabor_size = 90;
var imgGabor = new Image();
imgGabor.src = gaborgen(0, 5); //gaborgen(rotation, frequency = 5)


var position_ind = [0, 1, 2, 3, 4, 5, 6, 7];
var now = 1; //"now" = current trial

var target_position;
var target_position_array = [];
var response_angle;
var response_array = [];
var target_angle_array = [];
var current_gabor_angles;
var error;
var start_angle;
var response_time;
var response_time_array = [];
var start_time;

var mouse_check = 0;

var mouse_X;
var response_X;


var point_sigma = 20;  //is it reasonable?
var gaussian_expo;
var pt_dist;
var pt_round;


//initialize data arrays;
var data = [];
var trial_array = [];



///////////////////////////////////////
//        MAIN DEMO BODY CODE       //
/////////////////////////////////////


function runDemo(n, result) {

    trial_array = ["NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN"];
    trial_array[0] = now;

    hide_cursor();
    initializeScreen();

    current_gabor_angles = gabor_orientation(now);

    start_angle = (Math.random() * 180 - 90) * Math.PI / 180; // start_angle [-PI/2, PI/2]

    all_start_angle = all_start_angle.concat(start_angle);

    /// WALK THROUGH TRIALS
    if (now === 1 || now === 2) {
        switch (now) {
            case 1:
                setTimeout(function () {
                    document.getElementById("progress-bar").innerHTML = "See the small cross at the center? Please try to look at it as much as you can.";
                    document.getElementById("bonus-reminder").innerHTML = "Press the key 'F' to continue.";

                }, 100);
                break;
            case 2:
                document.getElementById("progress-bar").innerHTML = "Now we will make the task a bit harder by adding more striped patterns for you to remember.";
                document.getElementById("bonus-reminder").innerHTML = "Press the key 'F' to continue.";
                break;
        }
        document.getElementById("progress-bar").style.display = "inline";
        document.getElementById("bonus-reminder").style.display = "inline";
        //listen for keypress
        $(document).keypress(function (e) {
            //F:70; f:102
            if (e.which === 70 || e.which === 102) {
                $(document).off('keypress');
                setTimeout(function () {
                    switch (now){
                        case 1:
                            document.getElementById("progress-bar").innerHTML = "In a moment, you will see ONE striped pattern briefly flashing on the screen. Try to remember its orientation.";
                            break;
                        case 2:
                            document.getElementById("progress-bar").innerHTML = "You will see 4 striped patterns flashing on the screen. You might be asked to tell us the orientation of ANY of them!";
                            break;
                    }
                    $(document).keypress(function (e) {
                        if (e.which === 70 || e.which === 102) {
                            $(document).off('keypress');
                            document.getElementById("progress-bar").style.display = "none";
                            document.getElementById("bonus-reminder").style.display = "none";

                            //flashing gabor
                            setTimeout(function () {
                                display_patches(current_gabor_angles, shuffleArray(position_ind));
                                setTimeout(function () {
                                    initializeScreen();

                                    //ask for response
                                    setTimeout(function () {
                                        switch (now){
                                            case 1:
                                                document.getElementById("bonus-reminder").innerHTML = "What was the orientation of that earlier pattern? Tell us by using your mouse or trackpad to rotate this new pattern. Click once you've made up your mind!";
                                                break;
                                            case 2:
                                                document.getElementById("bonus-reminder").innerHTML = "Now tell us what was the orientation of that earlier parttern?";
                                                break;
                                        }
                                        document.getElementById("bonus-reminder").style.display = "inline";
                                        setTimeout(function () {
                                            draw_gabor(target_position, start_angle);
                                            setTimeout(function () {
                                                show_cursor();
                                            }, 150);
                                            start_time = Date.now();
                                            make_response(n, result);
                                            now++;
                                        }, 200);
                                    }, 1000); //delay
                                }, 50); //stimuli display time
                            }, 1500); //first trial: give 1.5s break after key down
                        }
                    })
                })
            }
        })

    } else if (now === 3) {

        document.getElementById("progress-bar").innerHTML = "Great! Now we will make it harder by adding even more patterns. Just try your best!";
        document.getElementById("bonus-reminder").innerHTML = "Press the key 'F' to continue.";
        document.getElementById("progress-bar").style.display = "inline";
        document.getElementById("bonus-reminder").style.display = "inline";

        //listen for keypress
        $(document).keypress(function (e) {
            //F:70; f:102
            if (e.which === 70 || e.which === 102) {
                $(document).off('keypress');
                setTimeout(function () {
                    document.getElementById("progress-bar").innerHTML = "You will see 8 striped patterns flashing on the screen. This is the maximum number of patterns you will be asked to remember in this task.";
                    $(document).keypress(function (e) {
                        if (e.which === 70 || e.which === 102) {
                            $(document).off('keypress');
                            document.getElementById("progress-bar").style.display = "none";
                            document.getElementById("bonus-reminder").style.display = "none";

                            //flashing gabor
                            setTimeout(function () {
                                display_patches(current_gabor_angles, shuffleArray(position_ind));
                                setTimeout(function () {
                                    initializeScreen();

                                    ////*** STEP 3: PROBE ***////
                                    //define rand_position_ind[0] to always be the one being picked
                                    setTimeout(function () {
                                        draw_gabor(target_position, start_angle);

                                        ////*** STEP 4: ASK FOR RESPONSE, SHOW THE POINTS ***////
                                        setTimeout(function () {
                                            show_cursor();
                                        }, 150);
                                        start_time = Date.now();
                                        make_response(n, result);
                                        //data[now-1] = trial_array;
                                        //console.log("all data:" + data);
                                        now++;

                                        $("#demo-container").click(function () {
                                            if (now <= n) {
                                                setTimeout(function () {
                                                    runDemo(n, result);
                                                }, 1500);  //the timer will be triggered only after the key is down.
                                                // need to be greater than 1000, since it contains 1000ms of result display time
                                            }
                                        })
                                    }, 1000); //delay
                                }, 50); //stimuli display time
                            }, 1500); //first trial: give 1.5s break after key down
                        }
                    })
                })
            }
        })

    } else if (now === 4) {
        document.getElementById("progress-bar").innerHTML = "Nice! Now that you have completed the demo, you can practice for 10 more trials by yourself. The performance on these 10 trials will NOT affect your bonus!";
        document.getElementById("bonus-reminder").innerHTML = "Press the key 'F' to continue.";
        document.getElementById("progress-bar").style.display = "inline";
        document.getElementById("bonus-reminder").style.display = "inline";

        $(document).keypress(function (e) {
            //F:70; f:102
            if (e.which === 70 || e.which === 102) {
                $(document).off('keypress');
                document.getElementById("progress-bar").style.display = "none";
                document.getElementById("bonus-reminder").style.display = "none";
                ////*** STEP 1: SHOW PATCHES ***////
                setTimeout(function () {
                    display_patches(current_gabor_angles, shuffleArray(position_ind));

                    ////*** STEP 2: DELAY 1 SEC ***////
                    setTimeout(function () {
                        initializeScreen();

                        ////*** STEP 3: PROBE ***////
                        //define rand_position_ind[0] to always be the one being picked
                        setTimeout(function () {
                            draw_gabor(target_position, start_angle);

                            ////*** STEP 4: ASK FOR RESPONSE, SHOW THE POINTS ***////
                            setTimeout(function () {
                                show_cursor();
                            }, 150);
                            start_time = Date.now();
                            make_response(n, result);
                            //data[now-1] = trial_array;
                            //console.log("all data:" + data);
                            now++;

                            $("#demo-container").click(function () {
                                if (now <= n) {
                                    setTimeout(function () {
                                        runDemo(n, result);
                                    }, 1500);  //the timer will be triggered only after the key is down.
                                    // need to be greater than 1000, since it contains 1000ms of result display time
                                } else {
                                    setTimeout(function () {
                                        show_cursor();
                                        initializeQuiz();
                                    }, 3000); //enter the quiz!
                                }
                            })
                        }, 1000); //delay
                    }, 50); //stimuli display time
                }, 500); //actual inter-trial time = 500 + (1500-1000) = 1000 ms
            }
        })
    } else {
        ////*** STEP 1: SHOW PATCHES ***////
        setTimeout(function () {
            display_patches(current_gabor_angles, shuffleArray(position_ind));

            ////*** STEP 2: DELAY 1 SEC ***////
            setTimeout(function () {
                initializeScreen();

                ////*** STEP 3: PROBE ***////
                //define rand_position_ind[0] to always be the one being picked
                setTimeout(function () {
                    draw_gabor(target_position, start_angle);

                    ////*** STEP 4: ASK FOR RESPONSE, SHOW THE POINTS ***////
                    setTimeout(function () {
                        show_cursor();
                    }, 150);
                    start_time = Date.now();
                    make_response(n, result);
                    //data[now-1] = trial_array;
                    //console.log("all data:" + data);
                    now++;
                    $("#demo-container").click(function () {
                        if (now <= n) {
                            setTimeout(function () {
                                runDemo(n, result);
                            }, 1500);  //the timer will be triggered only after the key is down.
                            // need to be greater than 1000, since it contains 1000ms of result display time
                        } else {
                            setTimeout(function () {
                                show_cursor();
                                initializeQuiz();
                            }, 3000); //enter the quiz!
                        }
                    })
                }, 1000); //delay
            }, 50); //stimuli display time
        }, 500); //actual inter-trial time = 500 + (1500-1000) = 1000 ms
    }
}



/////////////////////////////////////
//         helper functions       //
///////////////////////////////////


function initializeScreen(){
    canvas = document.getElementById("testCanvas");
    parent = document.getElementById("demo-container");
    canvas.height = parent.clientHeight;
    h = canvas.height;
    canvas.width = parent.clientWidth;
    ctx = canvas.getContext("2d");


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0,0);

    ctx.fillStyle = 'rgb(128, 128, 128)';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fixation();

    //calculate 8 coordinate positions
    //Polar to Cartesian:
    // x = radius * Math.sin(theta)
    // y = radius * Math.cos(theta)
    //use 0.707 as an approximation of (sqrt2)/2
    radius = 0.35; //radius: the proportion (d:h) that the "virtual circle" takes up the screen
    x_positions = [0, 0.707*radius*h, radius*h, 0.707*radius*h, 0, -0.707*radius*h, -radius*h, -0.707*radius*h];
    y_positions = [radius*h, 0.707*radius*h, 0, -0.707*radius*h, -radius*h, -0.707*radius*h, 0, 0.707*radius*h];

    //gabor_size = 0.4 * radius * h;

}



//draw fixation cross
function fixation(){
    ctx.beginPath();
    ctx.lineWidth="2";
    ctx.strokeStyle="white";

    ctx.moveTo(canvas.width/2 - crossSize,canvas.height/2);
    ctx.lineTo(canvas.width/2 + crossSize,canvas.height/2);
    ctx.stroke();

    ctx.moveTo(canvas.width/2 ,canvas.height/2 - crossSize);
    ctx.lineTo(canvas.width/2 ,canvas.height/2 + crossSize);
    ctx.stroke();

}



//generate a pseudorandom array of N, length = #Trials
function randomize_N(n_trial){
    for (i = 1; i <= n_trial/N_array.length;) {
        N_randperm = N_randperm.concat(shuffleArray(N_array));
        i++;
    }

//for debugging purpose
    //return N_randperm;
    //console.log(N_randperm);
}



//generate gabor orientations within a trial; place it inside the trial loop
//all angles in RADIAN!
function gabor_orientation(now) {
    var gabor_array = [];
    //for (gabor_ind = 0; gabor_ind < N_randperm[0];) { //this is the tester line
    for (gabor_ind = 0; gabor_ind < N_randperm[now-1];) { //i ranges from 0 to 14! loop i from 0 ~ n_trial-1
        //randomly generate gabor with different orientations, index them
        var orientation = (Math.random() * 180 - 90) * Math.PI/180 ;  //gabor orientation [-PI/2, PI/2]
        gabor_array = gabor_array.concat(orientation);
        gabor_ind++;
    }
    return gabor_array;
}



//the function that draws ONE gabor, given its position & orientation
function draw_gabor(position_ind,orientation){

    var current_position = new gabor_coordinates();

    function gabor_coordinates(){

        switch(position_ind){
            case 0:
                this.x = canvas.width/2 + x_positions[0];
                this.y = canvas.height/2 - y_positions[0];
                break;
            case 1:
                this.x = canvas.width/2 + x_positions[1];
                this.y = canvas.height/2 - y_positions[1];
                break;
            case 2:
                this.x = canvas.width/2 + x_positions[2];
                this.y = canvas.height/2 - y_positions[2];
                break;
            case 3:
                this.x = canvas.width/2 + x_positions[3];
                this.y = canvas.height/2 - y_positions[3];
                break;
            case 4:
                this.x = canvas.width/2 + x_positions[4];
                this.y = canvas.height/2 - y_positions[4];
                break;
            case 5:
                this.x = canvas.width/2 + x_positions[5];
                this.y = canvas.height/2 - y_positions[5];
                break;
            case 6:
                this.x = canvas.width/2 + x_positions[6];
                this.y = canvas.height/2 - y_positions[6];
                break;
            case 7:
                this.x = canvas.width/2 + x_positions[7];
                this.y = canvas.height/2 - y_positions[7];
                break;
        }
    }
    ctx.save();
    ctx.translate(current_position.x, current_position.y);
    ctx.rotate(-Math.PI/2 + orientation); //ctx.rotate --> CLOCKWISE ROTATION //original gabor is horizontal --> convert it to vertical first!
    ctx.drawImage(imgGabor, -gabor_size/2, -gabor_size/2, gabor_size, gabor_size);  //ctx.drawImage(img, x, y, width, height)
    ctx.restore();
}


function display_patches(gabor_array, rand_position_ind){

    fixation();

    //write the angles corresponding to each position into csv
    for (l = 0; l < gabor_array.length; l++){
        //trial_array: index 1~8
        trial_array[rand_position_ind[l]+2] = gabor_array[l]
    }

    trial_array[1] = gabor_array.length;
    //debugging purpose:
    //console.log("2.SET SIZE:" + trial_array[1]);
    //console.log("3.GABOR 0:" + trial_array[2]);
    //console.log("4.GABOR 1:" + trial_array[3]);
    //console.log("5.GABOR 2:" + trial_array[4]);
    //console.log("6.GABOR 3:" + trial_array[5]);
    //console.log("7.GABOR 4:" + trial_array[6]);
    //console.log("8.GABOR 5:" + trial_array[7]);
    //console.log("9.GABOR 6:" + trial_array[8]);
    //console.log("10.GABOR 7:" + trial_array[9]);
    //console.log(gabor_array);
    //console.log(rand_position_ind);



    for (j = 0; j <= (gabor_array.length-1);j++){
        draw_gabor(rand_position_ind[j], gabor_array[j]);
    }
    target_position = rand_position_ind[0];
    target_position_array = target_position_array.concat(target_position);
}


function calculate_points(error){  //current_n = gabor_orientation[now].length

    //convert error from rad back to degree

    //Gaussian: not used
    //gaussian_expo = (-1) * (Math.abs(error)^2)/(2*point_sigma^2);
    //pt_dist = Math.exp(gaussian_expo);
    //pt_round = Math.round(10 * pt_dist);

    //linear
    if (Math.abs(error) >= 50) {
        pt_round = 0;
    } else {
        pt_round = 10 - Math.round(0.2 * Math.abs(error));
    }
    all_points = all_points.concat(pt_round);

    //display_result(pt_round);

    //calculate points: Matlab code from Paul & Luigi
    //sigma       = design.pointsigma_mult(idx_val)*design.width(idx_val);
    //vals        = [responseAngle-180-params.trial_mean responseAngle-params.trial_mean responseAngle+180-params.trial_mean];
    //error       = min(abs(vals));    //abs might not be needed here since in expo it is squared.
    //expo        = ((error)^2)/(2*sigma^2);
    //points_prob = exp(-expo);
    //point_totes = round(10*points_prob);

}



function display_result(){
    switch (now){
        case 2:
            document.getElementById("point-box").style.marginTop = "70vh";
            document.getElementById("point-box").innerHTML = "Press the key 'F' to continue.";
            document.getElementById("point-box").style.display = 'inline';
            break;
        case 3:
            document.getElementById("point-box").style.marginTop = "70vh";
            document.getElementById("point-box").innerHTML = "Press the key 'F' to continue.";
            document.getElementById("point-box").style.display = 'inline';
            break;
        default:
            document.getElementById("point-box").style.display = 'none';
            break;
    }

}




$(document).mousemove(function(e) {
    mouse_X = e.pageX;
});



function make_response(n, result){

    //show_cursor();

    mouseXStartPosition = mouse_X;
    var previousAngle = 361.0;
    //var angleDifference = start_angle;

    var refreshIntervalId = setInterval(function () {

        //angleDifference = (mouse_X % (canvas.width/4) / (canvas.width/4) * 180 - 90) * Math.PI / 180 + start_angle;
        var angleDifference = ((mouse_X - mouseXStartPosition) % (canvas.width/3)) / (canvas.width/3) * Math.PI + start_angle;
        //angleDifference = (mouse_X/5 - mouseXStartPosition/5 + start_angle);    // divide by 5: make mouse control of gabor more natural?

        //Save CPU
        if (Math.abs(angleDifference - previousAngle) > (0.0005 * Math.PI / 180)){
            initializeScreen();
            draw_gabor(target_position, angleDifference);
        }

        previousAngle = angleDifference;
    }, 25);  //the gabor image will be refreshed w.r.t. the mouse every 25ms.


    //things happened after clicking

    $("#demo-container").click(function(e){

        //freeze x position after mouse off
        response_X = e.pageX;

        //disable clicking
        $("#demo-container").off('click');

        //stop the timer
        var click_time = Date.now();

        response_time = click_time - start_time;
        response_time_array = response_time_array.concat(response_time);

        //check if RT is reasonable
        RTcheck(response_time);

        clearInterval((refreshIntervalId));

        //response_angle = (response_X/5 - mouseXStartPosition/5 + start_angle) % Math.PI; //response_angle: [-PI, PI]
        response_angle = (((response_X - mouseXStartPosition)  % (canvas.width/3)) / (canvas.width/3) * Math.PI + start_angle) % Math.PI;
        //convert the response angle from [-PI, PI] to [-PI/2, PI/2]
        function convert_resp(response){
            var resp1 = response;
            var resp2 = response + Math.PI;
            var resp3 = response - Math.PI;

            if (Math.abs(resp1) <= Math.PI/2){
                response_angle = resp1;
            } else if (Math.abs(resp2) <= Math.PI/2){
                response_angle = resp2;
            } else if (Math.abs(resp3) <= Math.PI/2){
                response_angle = resp3;
            }
        }
        convert_resp(response_angle);
        //calculation
        response_array = response_array.concat(response_angle * 180 / Math.PI);

        function calculate_error(response, real){

            //real [-PI/2, PI/2]
            //response [-PI/2, PI/2]
            //final output error [-PI/2, PI/2]

            var err_1 = response - Math.PI - real;
            var abs1 = Math.abs(err_1);

            var err_2 = response + Math.PI - real;
            var abs2 = Math.abs(err_2);

            var err_3 = response - real;
            var abs3 = Math.abs(err_3);

            if ((abs1 < abs2) && (abs1 < abs3)) {
                return err_1 * 180 / Math.PI;
            } else if ((abs2 < abs1) && (abs2 < abs3)){
                return err_2 * 180 / Math.PI;
            } else {
                return err_3 * 180 / Math.PI;
            }
        }

        error = calculate_error(response_angle, current_gabor_angles[0]);
        all_error = all_error.concat(error);
        target_angle_array = target_angle_array.concat(current_gabor_angles[0] * 180 / Math.PI);

        calculate_points(error);

        //console.log("current trial array: " + trial_array);
        var mouse_move_angle = Math.abs(response_angle - start_angle);
        response_check(mouse_move_angle);



        //trial_array[1~8]: starting from ~line 306
        //trial_array[0]: ~line 186
        trial_array[10] = target_position;
        trial_array[11] = current_gabor_angles[0];
        trial_array[12] = start_angle;
        trial_array[13] = response_angle;
        trial_array[14] = error;
        trial_array[15] = pt_round;
        trial_array[16] = response_time;
        trial_array[17] = mouse_check;

        data[now-2] = trial_array;

        //prepare for displaying result
        initializeScreen();

        if (result == "demo"){
            setTimeout(function(){
                draw_real_angle(target_position, current_gabor_angles[0], response_angle);
                display_result();
            }, 50); //show results after 50ms

            if (now === 2 || now === 3) {
                document.getElementById("bonus-reminder").innerHTML = "Awesome! The red line represents the real orientation, and the white line represents your answer.";

                $(document).keypress(function (e) {
                    if (e.which === 70 || e.which === 102) {
                        $(document).off('keypress');
                        setTimeout(function(){
                            initializeScreen();
                            document.getElementById("bonus-reminder").style.display = "none";
                            document.getElementById("point-box").style.display = 'none';
                            //console.log(data);
                        },1000); //result display time after clicking
                        setTimeout(function () {
                            runDemo(n, result);
                        }, 1500);
                    }
                })
            }
        } else {
            setTimeout(function(){
                initializeScreen();
                document.getElementById("bonus-reminder").style.display = "none";
                document.getElementById("point-box").style.display = 'none';
                //console.log(data);
            },1000); //result display time after clicking
        }


    });

}



function draw_real_angle(target_position,real_angle,response_angle){
//target coordinates: the CENTER of the target;
//real_angle = gabor_orientation(now)[0] --> RADIAN

    var target_x = canvas.width/2 + x_positions[target_position];
    var target_y = canvas.height/2 - y_positions[target_position];

    //draw real angle line
    ctx.beginPath();
    ctx.lineWidth="3";
    ctx.strokeStyle="red";

    ctx.moveTo(target_x, target_y);
    ctx.lineTo(target_x + 25 * Math.sin(real_angle), target_y - 25 * Math.cos(real_angle));
    ctx.stroke();

    ctx.moveTo(target_x, target_y);
    ctx.lineTo(target_x - 25 * Math.sin(real_angle), target_y + 25 * Math.cos(real_angle));
    ctx.stroke();

    //draw chosen angle line
    ctx.beginPath();
    ctx.lineWidth="3";
    ctx.strokeStyle="white";

    ctx.moveTo(target_x, target_y);
    ctx.lineTo(target_x + 25 * Math.sin(response_angle), target_y - 25 * Math.cos(response_angle));
    ctx.stroke();

    ctx.moveTo(target_x, target_y);
    ctx.lineTo(target_x - 25 * Math.sin(response_angle), target_y + 25 * Math.cos(response_angle));
    ctx.stroke();
}



//test if the subject makes response without moving the mouse for 3 times consecutively:
function response_check(mouse_move_angle){

    if (Math.abs(mouse_move_angle) < 0.00000001){ //this is the current trial
        mouse_check = 1;  // 1 means the mouse didn't move
    } else {
        mouse_check = 0;
    }
}


//called after the last trial has been finished
function initializeQuiz() {
    document.getElementById('demo-container').style.display = "none";
    document.getElementById('overlayCanvas').style.display = "none";
    document.getElementById('clickbutton').style.display = "inline";
    document.getElementById("introduction-container").style.display = "block";

}


//test whether response time is normal (send alert < 200 ms)
function RTcheck(RT){
    if (RT < 500) {
        alert("You clicked too fast, please respond properly.");
    }
}

function show_cursor(){
    $('html').css({cursor: 'default'});
}

function hide_cursor(){
    $('html').css({cursor: 'none'});
}
