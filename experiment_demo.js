
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
// 12. WE WILL NOT BLOCK PEOPLE FOR CONTINUOUS CLICKING NOW!
////**********    IMPROVING NOTES    *********////


//// **** NEXT STEPS **** ////
// 1. DATA OUTPUT (JSON)
// 2. SERVER (CHECK WITH ZAHY & JENN?)
// 3. PILOT RUNS!
//// **** NEXT STEPS **** ////


//// **** DATA TO RECORD **** ////
// 1. MTURK ID
// 2. BONUS CONDITION (N_randperm)

// 3. START ANGLES (all_start_angle)
// 4. RESPONSE ANGLES (response_array)
// 5. ERRORS (all_error)
// 6. TARGET POSITIONS (target_position_array)
// 7. RESULTS FOR ATTENTION CHECKS
// 8. WHETHER THE CONTINUOUS CLICKING CHECK FUNCTION HAS BEEN TRIGGERED (IF SO, HOW MANY TIMES)
// 9. THE RANDOMIZED MTURK CODE
// 10. ALL GABOR ANGLES ON A GIVEN TRIAL
// 11. ALL POINTS

//csv/mat
//row is trial
// column (16 in total)
// 1. trial number;
// 2. 8 columns for each gabor angle (if it's empty, then NaN: initialize it with NaN)
// 3. PROBED POSITION;
// 4. THE REAL ANGLE OF THE PROBED;
// 5. THE STARTING ANGLE OF THE PROBED;
// 6. RESPONSE ANGLE;
// 7. ERROR;
// 8. #POINTS;
// 9. REACTION TIME (MS)
// 10. HOW MANY TIMES THE CONTINUOUS CLICKING IS TRIGGERED (continuous_click)

//10. ID
//11. BONUS CONDITION
//12. FINAL TRIAL PICKED
//13. FINAL BONUS
//14. CATCH TRIAL RESULTS

//PROBABLY LOWER THE BASE RATE

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
var gabor_size = 80;
var imgGabor = new Image();

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
var continuous_click = 0;

var mouse_check = 0;

var mouse_X;
var response_X;


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
    radius = 0.35; //radius: the proportion (d:w) that the "virtual circle" takes up the screen
    x_positions = [0, 0.707*radius*h, radius*h, 0.707*radius*h, 0, -0.707*radius*h, -radius*h, -0.707*radius*h];
    y_positions = [radius*h, 0.707*radius*h, 0, -0.707*radius*h, -radius*h, -0.707*radius*h, 0, 0.707*radius*h];

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
    console.log(N_randperm);
}


///////////////////////////////////////
//        MAIN DEMO BODY CODE       //
/////////////////////////////////////

function runDemo(n){

    initializeScreen();

    current_gabor_angles = gabor_orientation(now);

    start_angle = (Math.random() * 180 - 90) * Math.PI / 180; // start_angle [-PI/2, PI/2]

    all_start_angle = all_start_angle.concat(start_angle);


    //start_angle = ((canvas.width / 2 + rdm_start_angle * canvas.width/4 - canvas.width/8) % (canvas.width/4) / (canvas.width/4) * 180 - 90) * Math.PI / 180;

    ////*** STEP 1: SHOW PATCHES ***////
    setTimeout(function(){
        display_patches(current_gabor_angles, shuffleArray(position_ind));

        ////*** STEP 2: DELAY 1 SEC ***////
        setTimeout(function(){
            initializeScreen();

            ////*** STEP 3: PROBE ***////
            //define rand_position_ind[0] to always be the one being picked
            setTimeout(function(){
                draw_gabor(target_position, start_angle);

                ////*** STEP 4: ASK FOR RESPONSE, SHOW THE POINTS ***////
                start_time = new Date();
                make_response();

                now++;

                $("#demo-container").click(function(){
                    if (now <= n){
                        setTimeout(function(){
                            runDemo(n);
                        }, 1500);  //the timer will be triggered only after the key is down.
                        // need to be greater than 1000, since it contains 1000ms of result display time
                    } else {
                        setTimeout(function() {
                            initializeQuiz();
                        }, 3000); //enter the quiz!
                    }
                })

            }, 1000); //delay
        }, 70); //stimuli display time
    }, 500); //actual inter-trial time = 500 + (1500-1000) = 1000 ms

}






////////////////////////////////////////
///////////////////////////////////////


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

    imgGabor.src = gaborgen(0, 5); //gaborgen(rotation, frequency = 5)

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

    console.log(gabor_array);
    console.log(rand_position_ind);
    for (j = 0; j <= (gabor_array.length-1);j++){
        draw_gabor(rand_position_ind[j], gabor_array[j]);
    }
    target_position = rand_position_ind[0];
    target_position_array = target_position_array.concat(target_position);
}


function display_result(pt_round){
    document.getElementById("point-box").innerHTML = pt_round + " points";
    document.getElementById("point-box").style.display = 'inline';

}



$(document).mousemove(function(e) {
    mouse_X = e.pageX;
});



function make_response(){

    mouseXStartPosition = mouse_X;

    var angleDifference = start_angle;

    var refreshIntervalId = setInterval(function () {

        //angleDifference = (mouse_X % (canvas.width/4) / (canvas.width/4) * 180 - 90) * Math.PI / 180;

        angleDifference = (mouse_X/5 - mouseXStartPosition/5 + start_angle);    // divide by 5: make mouse control of gabor more natural?
        initializeScreen();
        draw_gabor(target_position, angleDifference);

    }, 15);  //the gabor image will be refreshed w.r.t. the mouse every 15ms.


    //things happened after clicking

    $("#demo-container").click(function(e){

        //freeze x position after mouse off
        response_X = e.pageX;


        //disable clicking
        $("#demo-container").off('click');

        //stop the timer
        var click_time = new Date();

        response_time = click_time - start_time;

        response_time_array = response_time_array.concat(response_time);

        console.log("response time:" + response_time);
        console.log("time before response:" + start_time);
        console.log("time after click: " + click_time);

        clearInterval((refreshIntervalId));

        response_angle = (response_X/5 - mouseXStartPosition/5 + start_angle) % Math.PI; //response_angle: [-PI, PI]

        //calculation
        response_array = response_array.concat(response_angle * 180 / Math.PI);


        function calculate_error(response, real){

            //response [-PI, PI]
            //real [-PI/2, PI/2]
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

        //for debugging purpose
        console.log('response angle:' + response_angle);
        console.log('real angle: ' + current_gabor_angles[0]);
        console.log('error:' + error);
        console.log("start angle:" + start_angle);

        var mouse_move_angle = Math.abs(response_angle - start_angle);
        response_check(mouse_move_angle);

        //prepare for displaying result
        initializeScreen();

        setTimeout(function(){
            show_points(error);
            draw_real_angle(target_position, current_gabor_angles[0], response_angle);
        }, 50); //show results after 50ms


        setTimeout(function(){
            initializeScreen();
            document.getElementById("point-box").style.display = 'none';
        },1000); //result display time after clicking


    })
}

var point_sigma = 17 * 0.8;
var gaussian_expo;
var pt_dist;
var pt_round;

function show_points(error){  //current_n = gabor_orientation[now].length

    //convert error from rad back to degree

    gaussian_expo = (-1) * (Math.abs(error)^2)/(2*point_sigma^2);
    pt_dist = Math.exp(gaussian_expo);
    pt_round = Math.round(10 * pt_dist);

    all_points = all_points.concat(pt_round);

    display_result(pt_round);

    console.log('pt_distribution' + pt_dist);

    //calculate points: Matlab code from Paul & Luigi
    //sigma       = design.pointsigma_mult(idx_val)*design.width(idx_val);
    //vals        = [responseAngle-180-params.trial_mean responseAngle-params.trial_mean responseAngle+180-params.trial_mean];
    //error       = min(abs(vals));    //abs might not be needed here since in expo it is squared.
    //expo        = ((error)^2)/(2*sigma^2);
    //points_prob = exp(-expo);
    //point_totes = round(10*points_prob);

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

    if (Math.abs(mouse_move_angle) < 0.00001){ //this is the current trial
        mouse_check++;
    } else {
        mouse_check = 0;
    }
    if (mouse_check === 5){
        //alert("Please move your mouse to make a response!");
        continuous_click++;
        mouse_check = 0;
        //DATA OUTPUT: IF THIS FUNCTION IS TRIGGERED, WE NEED TO MARK THE DATA
    }
    console.log('non-movement count' + mouse_check);
}


//called after the last trial has been finished
function initializeQuiz() {
    document.getElementById('demo-container').style.display = "none";
    document.getElementById('overlayCanvas').style.display = "none";
    document.getElementById('clickbutton').style.display = "inline";
    document.getElementById("introduction-container").style.display = "block";

}


