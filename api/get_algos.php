<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../config/backend.php';
require_once __DIR__ . '/../db/algorithms.php';

$conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
$output = getAlgorithms($conn);

echo json_encode(["data" => $output]);
?>