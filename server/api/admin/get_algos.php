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
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $algorithms = get_algorithms($conn);
    echo json_encode([
        "success" => true,
        "data" => $algorithms
    ]);
}
catch (Exception $e) {
    error_log("Error in get_algos.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}