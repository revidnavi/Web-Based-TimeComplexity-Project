<?php
require_once __DIR__ . "/../cors.php";

header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/results.php';
require_once __DIR__ . '/../../lib/util.php';

login_block();
admin_block();

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);
    $chartData = get_more_chart_data($conn);

    echo json_encode([
        "success" => true,
        "data" => $chartData
    ]);
}
catch (Exception $e) {
    error_log("Error in get_chart_data.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}