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
$loggedInUserType = $_SESSION['userType'] ?? null;

if ($currentPage != "auth.html" && ($loggedInUserID === null || $loggedInUserType === null)) {   // if on user page  - but not logged in
    echo json_encode(["redirect" => "auth.html"]);
}
elseif ($currentPage == "admin.html" && $loggedInUserType != "admin") {                          // if on admin page - but not admin
    echo json_encode(["redirect" => "home.html"]);
}
elseif ($currentPage == "auth.html" && $loggedInUserID !== null && $loggedInUserType !== null) { // if on login page - but logged in
    if ($loggedInUserType == "admin") {
        echo json_encode(["redirect" => "admin.html"]);
    }
    else {
        echo json_encode(["redirect" => "home.html"]);
    }
}
else {
    echo json_encode(["redirect" => null]);
}