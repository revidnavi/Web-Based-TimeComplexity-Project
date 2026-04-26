<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/algorithms.php';
require_once __DIR__ . '/../../lib/util.php';

login_block();

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $userType = $_SESSION["userType"];

    echo json_encode([
        "success" => true,
        "data" => ["user type" => $userType]
    ]);
}
catch (Exception $e) {
    error_log("Error in get_user_type.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}