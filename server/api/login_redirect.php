<?php
require_once __DIR__ . "/cors.php";

header("Content-Type: application/json");
session_start();

require_once __DIR__ . "/../conf/dbase.php";
require_once __DIR__ . "/../db/users.php";

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
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

if (isset($loggedInUserID) && get_user_type($conn, $loggedInUserID) == null) {
    $_SESSION = array();
    session_destroy();
    echo json_encode(["redirect" => "auth.html"]);
    exit();
}

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