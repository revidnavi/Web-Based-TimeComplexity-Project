<?php
require_once __DIR__ . "/../cors.php";

header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/users.php';
require_once __DIR__ . '/../../lib/util.php';

login_block();
admin_block();

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);

    if ($inputs['attribute'] == "password") {
        $inputs["value"] = password_hash($inputs["value"], PASSWORD_DEFAULT);
    }
    
    $success = edit_user($conn, $inputs["user_id"], $inputs["attribute"], $inputs["value"]);

    echo json_encode([
        "success" => $success,
    ]);
}
catch (Exception $e) {
    error_log("Error in edit_user_attribute.php : " . $e->getMessage());
    echo json_encode([
        "success" => false
    ]);
}