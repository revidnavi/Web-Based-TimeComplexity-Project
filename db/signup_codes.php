<?php
function insertSignupCode($conn, $email, $code) {
    $stmt = $conn->prepare(
        "INSERT INTO signup_codes (email, code) 
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE 
            code = VALUES(code), 
            created_at = CURRENT_TIMESTAMP"
    );
    $stmt->bind_param("si", $email, $code);
    
    $output = $stmt->execute();

    $stmt->close();
    return $output;
}

function verifySignupCode($conn, $email, $inputcode) {
    $stmt = $conn->prepare("SELECT 1 FROM signup_codes WHERE email = ? AND code = ? LIMIT 1"); // add 5 minutes old = expired
    $stmt->bind_param("si", $email, $inputcode); 

    $stmt->execute();
    $stmt->store_result();

    $isValid = $stmt->num_rows > 0;

    $stmt->close();
    return $isValid;
}
?>