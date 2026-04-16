<?php
function loginBlock() {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["redirect" => "auth.html"]);
        exit();
    }
} 
?>