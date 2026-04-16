<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../config/back.php';
require_once __DIR__ . '/../db/results.php';
require_once __DIR__ . '/../lib/util.php';

loginBlock();

$conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
$data = json_decode(file_get_contents("php://input"), true);
$output = insertResult($conn, $_SESSION["user_id"], $data);

echo json_encode(["success" => true]);
?>