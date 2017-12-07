
//////// The functions used here are stored within the other two js files


function runExperiment(n){

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
                start_time = new Date();
                make_response();

                //var mouse_move_angle = all_start_angle[now-1] - response_array[now-1];
                //response_check(mouse_move_angle);

                now++;

                $("#demo-container").click(function(){
                    if ((now <= n) && (now !== (0.2*n+1)) && (now !== (0.4*n+1)) && (now !== (0.6*n+1)) && (now !== (0.8*n+1)) && (now !== 3)){
                        setTimeout(function(){
                            runExperiment(n);
                        }, 1500);  //the timer will be triggered only after the key is down.
                        // need to be greater than 1000, since it contains 1000ms of result display time
                    } else if (now === (0.2*n+1)){
                        setTimeout(function(){
                            document.getElementById('progress-bar').style.display = "inline";
                            document.getElementById("progress-bar").innerHTML = "You've completed 20% of the experiment!";

                            setTimeout(function(){
                                document.getElementById('progress-bar').style.display = "none";
                                runExperiment(n);
                            },5000)
                        },1000) // progress: 20%

                    } else if (now === (0.4*n+1)) {
                        setTimeout(function(){
                            document.getElementById('progress-bar').style.display = "inline";
                            document.getElementById("progress-bar").innerHTML = "You've completed 40% of the experiment!";

                            setTimeout(function(){
                                document.getElementById('progress-bar').style.display = "none";
                                runExperiment(n);
                            },5000)
                        },1000) // progress: 40%
                    } else if (now === (0.6*n+1)){
                        setTimeout(function(){
                            document.getElementById('progress-bar').style.display = "inline";
                            document.getElementById("progress-bar").innerHTML = "You've completed 60% of the experiment!";

                            setTimeout(function(){
                                document.getElementById('progress-bar').style.display = "none";
                                runExperiment(n);
                            },5000)
                        },1000) // progress: 60%
                    } else if (now === (0.8*n+1)) {
                        setTimeout(function(){
                            document.getElementById('progress-bar').style.display = "inline";
                            document.getElementById("progress-bar").innerHTML = "You've completed 80% of the experiment!";

                            setTimeout(function(){
                                document.getElementById('progress-bar').style.display = "none";
                                runExperiment(n);
                            },5000)
                        },1000) // progress: 80%

                    } else if (now === n+1){
                        setTimeout(function(){
                            document.getElementById('progress-bar').style.display = "inline";
                            document.getElementById("progress-bar").innerHTML = "You've completed the experiment! Please wait briefly for the browser to be automatically directed to the next page.";

                            setTimeout(function(){
                                document.getElementById('progress-bar').style.display = "none";
                                initialize_final_page();
                            },5000)
                        },1000)
                    } else if (now === 3) {  //insert three catch trials here: change it to 73 & 178 & 234; make sure to change line 37 as well
                        setTimeout(function(){
                            catch_trial();
                            setTimeout(function(){
                                document.getElementById('demo-container').style.display = "block";
                                document.getElementById('catch-trial').style.display = "none";
                                runExperiment(n);
                            }, 4000) //the catch trial automatically expires after 4s and proceeds to the next trial
                        },1000)
                    }
                })

            }, 1000); //delay
        }, 70); //stimuli display time
    }, 500); //actual inter-trial time = 500 + (1500-1000) = 1000 ms

}





//attention test:
function catch_trial(){

    document.getElementById('demo-container').style.display = "none";
    document.getElementById('catch-trial').style.display = "block";
    document.getElementById("catch-trial").innerHTML = "Please press SPACE on your keyboard! The next trial will be automatically shown within 4 seconds.";

    //listen for key
    $(document).keypress(function(e) {
        if (e.which === 32) {  //32 is space
            document.getElementById('catch-trial').style.display = "none";
            document.getElementById('demo-container').style.display = "block";
            //register the response as data output as well!
        }
    });
}





