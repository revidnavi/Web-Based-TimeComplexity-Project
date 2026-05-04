<?php
require_once __DIR__ . "/../cors.php";

header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/algorithms.php';
require_once __DIR__ . '/../../lib/util.php';

login_block();
admin_block();

try {
    $inputs = json_decode(file_get_contents("php://input"), true);
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);

    $success = delete_algorithm($conn, $inputs['algoID']);

    if ($success) {
        echo json_encode([
            "success" => true,
            "message" => "Algorithm deleted"
        ]);
    }
    else throw new Exception("Insert algorithm failed...");
}
catch (Exception $e) {
    error_log("Error in delete_algo.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Error occurred"
    ]);
}