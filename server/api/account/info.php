<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . "/../cors.php";
require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/users.php';
require_once __DIR__ . '/../../lib/util.php';

login_block();

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $userID = $_SESSION['userID'];
    $userInfo = get_user_info($conn, $userID);

    if ($userInfo) {
        echo json_encode([
            "success" => true,
            "data" => [
                "email" => $userInfo['email'],
                "created_at" => $userInfo['created_at']
            ]
        ]);
    }
    else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid user",
            "data" => []
        ]);
    }
}
catch (Exception $e) {
    error_log("Error in info.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Error occurred",
        "data" => []
    ]);
}