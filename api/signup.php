<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db/signup_codes.php';
require_once __DIR__ . '/../db/users.php';

$conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
$data = json_decode(file_get_contents("php://input"), true);

if (!verifySignupCode($conn, $data['email'], $data['code'])) {
    echo json_encode([
        "invalid_code" => true,
        "success" => false
    ]);
    exit();
}

$output = insertUser($conn, $data['email'], password_hash($data['pass0'], PASSWORD_DEFAULT));

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
?>