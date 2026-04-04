<?php
header("Content-Type: application/json");
session_start();

$_SESSION["user_id"] = 1; // replace with auth after login feature is added

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db/results.php';

$conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
$data = json_decode(file_get_contents("php://input"), true);
$output = insertResult($conn, $_SESSION["user_id"], $data);

if ($output) {
    echo json_encode([
        "success" => true
    ]);
} 
else {
    echo json_encode([
        "success" => false
    ]);
}

$conn->close();
?>