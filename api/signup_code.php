<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../config/backend.php';
require_once __DIR__ . '/../db/signup_codes.php';
require_once __DIR__ . '/../lib/emailer.php';

$conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
$data = json_decode(file_get_contents("php://input"), true);

$new_code = rand(100000, 999999);

$output1 = sendEmail($data['email'], "Sign Up Code", $new_code); // add 5 minutes code expiration message
$output2 = insertSignupCode($conn, $data['email'], $new_code);

if ($output1 && $output2) {
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