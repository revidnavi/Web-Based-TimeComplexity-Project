<?php
function insertSignupCode($conn, $email, $code) {
    $stmt = $conn->prepare(
        "INSERT INTO signup_codes (email, code) VALUES (?, ?)"
    );
    $stmt->bind_param("si", $email, $code);
    $output = $stmt->execute();

    $stmt->close();
    return $output;
}

function verifySignupCode($conn, $email, $inputcode) {
    $stmt = $conn->prepare("SELECT 1
        FROM signup_codes
        WHERE email = ? AND code = ? AND created_at >= NOW() - INTERVAL 5 MINUTE
        ORDER BY id DESC LIMIT 1;
    ");
    $stmt->bind_param("si", $email, $inputcode); 

    $stmt->execute();
    $stmt->store_result();

    $isValid = $stmt->num_rows > 0;

    $stmt->close();
    return $isValid;
}
?>