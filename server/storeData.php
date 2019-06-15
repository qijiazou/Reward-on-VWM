<?php
/**
 * Created by PhpStorm.
 * User: We
 * Date: 23.12.2017
 * Time: 13:58
 */

//functions
function is_ajax() {
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function serverSideResponse($message){
    $return = $_POST;
    $return["message"] = $message;
    $return["json"] = json_encode($return);
    echo json_encode($return);
}

function uploadDemo($TurkCode,$MTurkID,$BonusCondition,$Data){
    $fileName = $TurkCode."_".$MTurkID."_".$BonusCondition.".csv";
    $myfile = fopen("demoData/".$fileName, "w") or die(serverSideResponse("Unable to open file!"));
    foreach ($Data as $fields) {
        fputcsv($myfile, $fields);
    }
    fclose($myfile);
    //serverSideResponse("OK: 201");
}

function uploadFull($TurkCode,$MTurkID,$BonusCondition,$ActualBonus,$PickedTrial,$CatchTrialResult,$Data){
    $fileName = $TurkCode."_".$MTurkID."_".$BonusCondition."_".$ActualBonus."_".$PickedTrial."_".$CatchTrialResult.".csv";
    $myfile = fopen("serverData/".$fileName, "w") or die("Unable to open file!");
    foreach ($Data as $fields) {
        fputcsv($myfile, $fields);
    }
    fclose($myfile);
    //serverSideResponse("OK: 201");
}

//Main part
//Check if ajax request is as expected
if (is_ajax()) {

    //check if all parameters are set and not empty
    //Don't check empty() for actual bonus condition!

    if (
        isset($_POST["type"]) && !empty($_POST["type"]) &&
        isset($_POST["turkCode"]) && !empty($_POST["turkCode"]) &&
        isset($_POST["MTurkID"]) && !empty($_POST["MTurkID"]) &&
        isset($_POST["BonusCondition"]) &&
        isset($_POST["Trials"]) && !empty($_POST["Trials"])
    ) { //Check if action value exists
        $type = $_POST["type"];
        $trials = json_decode($_POST['Trials']);
        $MTurkID = json_decode($_POST["MTurkID"]);
        switch($type) { //Switch case w.r.t. DEMO or FULL version
            case "DEMO":
                uploadDemo($_POST["turkCode"], $MTurkID, $_POST["BonusCondition"], $trials);
                break;
            case "FULL":
                if(
                    //extra checks for FULL
                    //note that for PHP "0" is empty! Don't check empty() for actual bonus and catches since they might be 0
                    isset($_POST["ActualBonus"]) &&
                    isset($_POST["PickedTrial"]) && !empty($_POST["PickedTrial"]) &&
                    isset($_POST["CatchTrialResult"])
                ){
                    uploadFull($_POST["turkCode"], $MTurkID, $_POST["BonusCondition"], $_POST["ActualBonus"],
                        $_POST["PickedTrial"],$_POST["CatchTrialResult"], $trials);
                }else{
                    serverSideResponse("ERROR: not all parameters are set");
                }
                break;
            default:
                serverSideResponse("ERROR: don't understand parameter:" . $_POST["type"]);
        }
    }else{
        serverSideResponse("ERROR: params not set");
    }
}else{
    serverSideResponse("ERROR: not AJAX request");
}

/*
function uploadDemo($Type,$TurkCode,$MTurkID,$BonusCondition,$ActualBonus,$PickedTrial,$CatchTrialResult){
    //https://www.w3schools.com/php/php_mysql_prepared_statements.asp
    // Create connection
    $servername = "127.0.0.1";
    $username = "nicole";
    $password = "password";
    $dbname = "mydatabase";
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection

    if ($conn->connect_error) {
        serverSideResponse("ERROR: "+$conn->connect_error);
        //die("Connection failed: " . $conn->connect_error);
    }
    serverSideResponse("InDemo");

    $stmt = $conn->prepare("INSERT INTO Result (TYPE, TURKCODE, MTURKID,BONUSCONDITION,ActualBonus,PickedTrial,CatchTrialResult) VALUES (?, ?, ?, ?, ?, ?, ?)");


    //s = string
    //i = integer
    //d = double
    $stmt->bind_param("sssssss", $Type, $TurkCode, $MTurkID,$BonusCondition,$ActualBonus,$PickedTrial,$CatchTrialResult);


    //execute_statement
    $stmt->execute();
    $stmt->close();
    $conn->close();
    serverSideResponse("OK: 201");

}
*/
?>
