<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/results.php';
require_once __DIR__ . '/../../lib/util.php';

login_block();

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = 10;
    $offset = ($page - 1) * $limit;

    $data = get_results($conn, $limit, $offset);
    $totalResult = $conn->query("SELECT COUNT(*) as total FROM results");
    $total = $totalResult->fetch_assoc()['total'];

    echo json_encode([
        "success" => true,
        "data" => $data,
        "total" => $total,
        "page" => $page,
        "pages" => ceil($total / $limit)
    ]);
}
catch (Exception $e) {
    error_log("Error in get_results.php : " . $e->getMessage());

    echo json_encode([
        "success" => false
    ]);
}