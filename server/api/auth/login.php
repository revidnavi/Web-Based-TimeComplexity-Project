<?php
require_once __DIR__ . "/../cors.php";

header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/users.php';

try {
    $inputs = json_decode(file_get_contents("php://input"), true);
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $hashedPass = get_hashed_pass_by_email($conn, $inputs['email']);
    
    if ($hashedPass != null && password_verify($inputs['pass'], $hashedPass)) {
        $_SESSION["userID"] = get_user_id($conn, $inputs['email']);
        $_SESSION["userType"] = get_user_type($conn, $_SESSION["userID"]);
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "redirect" => "home.html"
        ]);
    } 
    else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect email or password",
            "redirect" => ""
        ]);
    }
}
catch (Exception $e) {
    error_log("Error in login.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Error occured",
        "redirect" => ""
    ]);
}