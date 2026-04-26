<?php

function login_block() {
    if (!isset($_SESSION['userID']) || !isset($_SESSION['userType'])) {
        echo json_encode([
            "success" => false,
            "redirect" => "auth.html",
            "data" => [],
            "message" => "Invalid session"
        ]);
        exit();
    }
}



function admin_block() {
    if ($_SESSION['userType'] != "admin") {
        echo json_encode([
            "success" => false,
            "redirect" => "home.html",
            "data" => [],
            "message" => "Invalid admin"
        ]);
        exit();
    }
}