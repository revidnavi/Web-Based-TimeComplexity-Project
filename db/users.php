<?php
function insertUser($conn, $email, $hashedPass) {
    $stmt = $conn->prepare("INSERT INTO users (email, hashed_pass) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hashedPass);
    $output = $stmt->execute();
    $stmt->close();
    return $output;
}

function getHashedPass($conn, $email) {
    $stmt = $conn->prepare("SELECT hashed_pass FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email); 

    $stmt->execute();
    $stmt->store_result();
    $hashed_pass = null;
    $stmt->bind_result($hashed_pass);

    $stmt->fetch();

    $stmt->close();
    return $hashed_pass;
}

function getUserID($conn, $email) {
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email); 

    $stmt->execute();
    $stmt->store_result();
    $id = null;
    $stmt->bind_result($id);

    $stmt->fetch();

    $stmt->close();
    return $id;
}
?>