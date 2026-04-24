<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/signup_codes.php';
require_once __DIR__ . '/../../db/users.php';

try {
    $inputs = json_decode(file_get_contents("php://input"), true);
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);

    $validCode = get_valid_signup_code($conn, $inputs['email']);

    if ($validCode == $inputs['code']) {
        if (get_user_id($conn, $inputs['email']) !== null) {
            echo json_encode([
                "success" => false,
                "message" => "Already registered"
            ]);
            exit();
        }
        $output = insert_user($conn, $inputs['email'], password_hash($inputs['pass0'], PASSWORD_DEFAULT));
        echo json_encode([
            "success" => true,
            "message" => "User created"
        ]);
    }
    else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid code"
        ]);
    }
}
catch (Exception $e) {
    error_log("Error in signup.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Error occurred"
    ]);
}