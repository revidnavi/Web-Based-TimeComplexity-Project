<?php
require_once __DIR__ . "/../cors.php";

header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/results.php';
require_once __DIR__ . '/../../lib/util.php';

login_block();

try {
    $inputs = json_decode(file_get_contents("php://input"), true);
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    
    $resultStored = insert_result($conn, $_SESSION["userID"], $inputs['algoID'], $inputs['size'], $inputs['time'], $inputs['space']);
    echo json_encode(["success" => true]);
}
catch (Exception $e) {
    error_log("Error in save_result.php : " . $e->getMessage());
    echo json_encode(["success" => false]);
}