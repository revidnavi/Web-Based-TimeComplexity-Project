<?php
header("Content-Type: application/json");

session_start();

require_once __DIR__ . "/../cors.php";
$_SESSION = array();
session_destroy();

echo json_encode([
    "success" => true,
    "redirect" => "auth.html"
]);