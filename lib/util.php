<?php
function loginRedirect() {
    if (isset($_SESSION['user_id'])) {
        echo json_encode(["redirect" => "home.html"]);
    }
    else {
        echo json_encode(["redirect" => "auth.html"]);
    }
    exit();
} 
?>