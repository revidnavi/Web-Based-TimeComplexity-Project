<?php

function insert_signup_code($conn, $email, $code) {
    $stmt = $conn->prepare(
        "INSERT INTO signup_codes (email, code) VALUES (?, ?)"
    );
    $stmt->bind_param("si", $email, $code);

    $success = $stmt->execute();

    $stmt->close();
    return $success;
}



function get_valid_signup_code($conn, $email) {
    $stmt = $conn->prepare("SELECT code
        FROM signup_codes
        WHERE email = ? AND created_at >= NOW() - INTERVAL 5 MINUTE
        ORDER BY id DESC
        LIMIT 1
    ");
    $stmt->bind_param("s", $email);
    
    $stmt->execute();

    $code = null;
    $stmt->bind_result($code);
    $stmt->fetch();

    $stmt->close();
    return $code;
}