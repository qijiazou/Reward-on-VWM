# Reward-on-VWM

This experiment is used for a human visual working memory research launched in 2018 on Amazon Mechanical Turk by Ma Lab @NYU Center for Neural Science.

The code can also be used offline if you have a web server (e.g.: XAMPP) installed. To see the online version of the experiment, please go to the following link (it will ask you for your AMT ID-- just type in anything to proceed):
> http://malab-nyu.com/N30981a/

The stimuli of the experiment is a modified Gabor based on jtth's ```gaborgen.js``` function. The full repository is linked below:
> https://github.com/jtth/gaborgen-js

The main functions used in the experimental design is contained in ```experiment_demo.js``` file. After completing the experiment, the server will receive 3 seperate csv files that contains the data for 
- demo (10 trials) 
- full experiment (250 trials)
- the answers to 20 questions of the Intrinsic Motivation Inventory scale (full IMI scale see the link: http://selfdeterminationtheory.org/intrinsic-motivation-inventory/)

One feature of this code is that it provides a template for trial-based human behavior researches to easily upload data onto a web server with minimal adaptation. The exact functions are defined in ```all_functions.js``` and ```/server/storeData.php```.
