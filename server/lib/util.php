<?php

function login_block() {
    if (!isset($_SESSION['userID'])) {
        echo json_encode([
            "success" => false,
            "redirect" => "auth.html",
            "data" => [],
            "message" => "Invalid session"
        ]);
        exit();
    }
}