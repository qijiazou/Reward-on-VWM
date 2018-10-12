
//////// The functions used here are stored within the other two js files


function runExperiment(n, result){


    trial_array = ["NaN", "NaN", "NaN", "NaN","NaN", "NaN", "NaN", "NaN","NaN", "NaN", "NaN", "NaN","NaN", "NaN", "NaN", "NaN", "NaN", "NaN"];
    trial_array[0] = now;

    hide_cursor();
    initializeScreen();

    current_gabor_angles = gabor_orientation(now);

    start_angle = (Math.random() * 180 - 90) * Math.PI/180;

    all_start_angle = all_start_angle.concat(start_angle);

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
                setTimeout(function(){
                    show_cursor();
                }, 800);

                start_time = new Date();
                make_response();
                now++;

                $("#demo-container").click(function(){
                    if ((now <= n) && (now !== (0.2*n+1)) && (now !== (0.4*n+1)) && (now !== (0.6*n+1)) && (now !== (0.8*n+1)) && (now !== 73) && (now !== 178) && (now !== 234)){

                        setTimeout(function(){
                            runExperiment(n, result);
                        }, 1500);  //the timer will be triggered only after the key is down.
                        // need to be greater than 1000, since it contains 1000ms of result display time
                    } else if (now === (0.2*n+1)){
                        setTimeout(function(){
                            document.getElementById('progress-bar').style.display = "inline";
                            document.getElementById('bonus-reminder').style.display = "inline";
                            document.getElementById("progress-bar").innerHTML = "You've completed 20% of the experiment! The experiment will continue in 10 seconds.";
                            display_bonus_reminder();
                            count_down(n, result);

                            //setTimeout(function(){
                                //document.getElementById('progress-bar').style.display = "none";
                                //document.getElementById('bonus-reminder').style.display = "none";
                                //runExperiment(n, result);
                            //},7000)
                        },1500) // progress: 20%

                    } else if (now === (0.4*n+1)) {
                        setTimeout(function(){
                            document.getElementById("progress-bar").style.color = "#b01c08";
                            document.getElementById('progress-bar').style.display = "inline";
                            document.getElementById('bonus-reminder').style.display = "inline";

                            document.getElementById("progress-bar").innerHTML = "You've completed 40% of the experiment! The experiment will continue in 10 seconds.";
                            count_down(n, result);

                            //setTimeout(function(){
                            //    document.getElementById('progress-bar').style.display = "none";
                            //    document.getElementById('bonus-reminder').style.display = "none";
                            //    runExperiment(n, result);
                            //},7000)
                        },1500) // progress: 40%
                    } else if (now === (0.6*n+1)){
                        setTimeout(function(){
                            document.getElementById("progress-bar").style.color = "#b01c08";
                            document.getElementById('progress-bar').style.display = "inline";
                            document.getElementById('bonus-reminder').style.display = "inline";

                            document.getElementById("progress-bar").innerHTML = "You've completed 60% of the experiment! The experiment will continue in 10 seconds.";
                            count_down(n, result);

                            //setTimeout(function(){
                            //    document.getElementById('progress-bar').style.display = "none";
                            //    document.getElementById('bonus-reminder').style.display = "none";
                            //    runExperiment(n, result);
                            //},7000)
                        },1500) // progress: 60%
                    } else if (now === (0.8*n+1)) {
                        setTimeout(function(){
                            document.getElementById("progress-bar").style.color = "#b01c08";
                            document.getElementById('progress-bar').style.display = "inline";
                            document.getElementById('bonus-reminder').style.display = "inline";

                            document.getElementById("progress-bar").innerHTML = "You've completed 80% of the experiment! The experiment will continue in 10 seconds.";
                            count_down(n, result);

                            //setTimeout(function(){
                            //    document.getElementById('progress-bar').style.display = "none";
                            //    document.getElementById('bonus-reminder').style.display = "none";
                            //   runExperiment(n, result);
                            //},7000)
                        },1500) // progress: 80%

                    } else if (now === n+1){
                        setTimeout(function(){
                            document.getElementById('progress-bar').style.display = "inline";
                            document.getElementById("progress-bar").innerHTML = "You've completed the experiment! Please wait briefly for the browser to be automatically directed to the next page.";
                            setTimeout(function(){
                                document.getElementById('progress-bar').style.display = "none";
                                show_cursor();
                                initialize_IMI();
                            },5000)
                        },1500)
                    } else if (now === 73 || now === 178 || now === 234) {  //insert three catch trials here: change it to 73 & 178 & 234; make sure to change line 37 as well
                        setTimeout(function(){
                            catch_trial();
                            setTimeout(function(){
                                $(document).off("keypress");
                                document.getElementById('demo-container').style.display = "block";
                                document.getElementById('catch-trial').style.display = "none";
                                runExperiment(n, result);
                            }, 4000) //the catch trial automatically expires after 4s and proceeds to the next trial
                        },1500)
                    }
                })

            }, 1000); //delay
        }, 50); //stimuli display time
    }, 500); //actual inter-trial time = 500 + (1500-1000) = 1000 ms

}


function count_down(n, result){
    setTimeout(function(){
        document.getElementById("progress-bar").innerHTML = "COUNT DOWN 5!";
        document.getElementById("progress-bar").style.color = "#ffee50";

        setTimeout(function(){
            document.getElementById("progress-bar").innerHTML = "COUNT DOWN 4!";
            setTimeout(function(){
                document.getElementById("progress-bar").innerHTML = "COUNT DOWN 3!";
                setTimeout(function(){
                    document.getElementById("progress-bar").innerHTML = "COUNT DOWN 2!";
                    setTimeout(function(){
                        document.getElementById("progress-bar").innerHTML = "COUNT DOWN 1!";
                        setTimeout(function(){
                            document.getElementById('progress-bar').style.display = "none";
                            document.getElementById('bonus-reminder').style.display = "none";
                            runExperiment(n, result);
                        },1000);
                    },1000);
                },1000)
            },1000);
        },1000);
    }, 5000);
}


function display_bonus_reminder(){
    document.getElementById("bonus-reminder").style.fontSize = "20pt";
    if (bonus_setting[0] % 1 == 0){
        document.getElementById("bonus-reminder").innerHTML = "Remember that you have the chance to earn a $" + bonus_setting[0] + " bonus!";
    } else {
        document.getElementById("bonus-reminder").innerHTML = "Remember that you have the chance to earn a $" + bonus_setting[0].toFixed(2) + " bonus!";
    }
}

//attention test:
var catches = 0;

function catch_trial(){

    document.getElementById('demo-container').style.display = "none";
    document.getElementById('catch-trial').style.display = "block";
    document.getElementById("catch-trial").innerHTML = "Please press the SPACE on your keyboard!";

    //listen for key
    $(document).keypress(function(e) {
        if (e.which === 32) {  //13 = Enter; 74 = J; 106 = j
            $(document).off("keypress");
            catches += 1;
            document.getElementById("catch-trial").innerHTML = "Key pressed!";
            //console.log("current catch: ", catches);


            setTimeout(function(){
                document.getElementById('catch-trial').style.display = "none";
                document.getElementById('demo-container').style.display = "block";
                //register the response as data output as well!
            }, 1000);
        }
    });
}





