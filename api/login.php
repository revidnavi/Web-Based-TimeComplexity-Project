<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db/users.php';

$conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
$data = json_decode(file_get_contents("php://input"), true);

$hashed_pass = getHashedPass($conn, $data['email']);

if ($hashed_pass != null && password_verify($data['pass'], $hashed_pass)) {
    $_SESSION["user_id"] = getUserID($conn, $data['email']);
    echo json_encode([
        "redirect" => "home.html",
        "success" => true
    ]);
} 
else {
    echo json_encode([
        "success" => false
    ]);
}
?>