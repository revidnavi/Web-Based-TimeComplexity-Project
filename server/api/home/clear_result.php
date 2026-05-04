<?php
ini_set('display_errors', 0);
set_exception_handler(function($e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
});
set_error_handler(function($errno, $errstr) {
    echo json_encode(['success' => false, 'message' => $errstr]);
    exit;
});
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/dbase.php';
require_once __DIR__ . '/../../db/results.php';
require_once __DIR__ . '/../../lib/util.php';

login_block();

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request');
    }

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $conn->set_charset("utf8mb4");

    $user_id = $_SESSION['userID'];

    $success = clear_history($conn, $user_id);

    if (!$success) {
        throw new Exception('Failed to clear history');
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>