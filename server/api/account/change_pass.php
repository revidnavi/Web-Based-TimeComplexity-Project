<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/users.php';
require_once __DIR__ . '/../../lib/util.php';

login_block();

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);

    $userID = $_SESSION['userID'];
    $currPass = $inputs['currPass'];
    $newPass = $inputs['pass0'];

    $hashedPass = "" . get_hashed_pass_by_id($conn, $userID); // does not work without "" for some reason, returns null otherwise

    if (password_verify($currPass, $hashedPass)) {  
        $newHashedPass = password_hash($newPass, PASSWORD_DEFAULT);
        update_password($conn, $userID, $newHashedPass);
        echo json_encode([
            "success" => true,
            "message" => "Password changed"
        ]);
    } 
    else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect password"
        ]);
    }
}
catch (Exception $e) {
    error_log("Error in change_pass.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Error occurred"
    ]);
}