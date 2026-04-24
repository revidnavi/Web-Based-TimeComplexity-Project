<?php
header("Content-Type: application/json");
session_start();

try {
    $inputs = json_decode(file_get_contents("php://input"), true);
    $currentPage = $inputs['currentPage'];
}
catch (Exception $e) {
    error_log("Error in login_redirect.php : " . $e->getMessage());
    echo json_encode(["redirect" => "auth.html"]);
    exit();
}

$loggedInUserID = $_SESSION['userID'] ?? null;

if ($currentPage != "auth.html" && $loggedInUserID === null) {
    echo json_encode(["redirect" => "auth.html"]);
}
elseif ($currentPage == "auth.html" && $loggedInUserID !== null) {
    echo json_encode(["redirect" => "home.html"]);
}
else {
    echo json_encode(["redirect" => false]);
}