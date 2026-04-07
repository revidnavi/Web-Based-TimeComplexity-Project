<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "redirect" => "auth.html"
    ]);
}
else {
    echo json_encode([
        "authenticated" => true
    ]);
}
exit();
?>