<?php
require_once __DIR__ . "/../cors.php";

header("Content-Type: application/json");

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/signup_codes.php';
require_once __DIR__ . '/../../db/users.php';
require_once __DIR__ . '/../../lib/emailer.php';

try {
    $inputs = json_decode(file_get_contents("php://input"), true);
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);

    if (get_user_id($conn, $inputs['email']) !== null) {
        echo json_encode([
            "success" => false,
            "message" => "Already registered"
        ]);
        exit();
    }
    
    $generatedCode = rand(100000, 999999);

    $codeStored = insert_signup_code($conn, $inputs['email'], $generatedCode);
    $emailSent = send_email($inputs['email'], "Sign Up Code", $generatedCode); // email content, add 5 minutes code expiration message

    if ($codeStored && $emailSent) {
        echo json_encode([
            "success" => true,
            "message" => "Code sent"
        ]);
        exit();
    } 
}
catch (Exception $e) {
    error_log("Error in signup_code.php : " . $e->getMessage());
}
finally {
    echo json_encode([
        "success" => false,
        "message" => "Error occured"
    ]);
}