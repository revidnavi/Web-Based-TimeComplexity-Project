<?php

function insert_user($conn, $email, $hashedPass) {
    $stmt = $conn->prepare("INSERT INTO users (email, hashed_pass) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hashedPass);

    $success = $stmt->execute();

    $stmt->close();
    return $success;
}



function get_hashed_pass_by_email($conn, $email) {
    $stmt = $conn->prepare("SELECT hashed_pass FROM users WHERE email = ? AND activated = 1 LIMIT 1");
    $stmt->bind_param("s", $email); 

    $stmt->execute();
    $stmt->store_result();

    $hashed_pass = null;
    $stmt->bind_result($hashed_pass);
    $stmt->fetch();

    $stmt->close();
    return $hashed_pass;
}



function get_hashed_pass_by_id($conn, $id) {
    $stmt = $conn->prepare("SELECT hashed_pass FROM users WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $id); 

    $stmt->execute();
    $stmt->store_result();

    $hashed_pass = null;
    $stmt->bind_result($hashed_pass);
    $stmt->fetch();

    $stmt->close();
    return $hashed_pass;
}



function get_user_id($conn, $email) {
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



function get_user_type($conn, $id) {
    $stmt = $conn->prepare("SELECT user_type FROM users WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $id); 

    $stmt->execute();
    $stmt->store_result();

    $type = null;
    $stmt->bind_result($type);
    $stmt->fetch();

    $stmt->close();
    return $type;
}



function update_password($conn, $id, $newHashedPass) {
    $stmt = $conn->prepare("UPDATE users SET hashed_pass = ? WHERE id = ?");
    $stmt->bind_param("si", $newHashedPass, $id);

    $success = $stmt->execute(); // if this fails, is there an exception thrown? ans:

    $stmt->close();
    return $success; 
}



function get_user_info($conn, $userID) {
    $stmt = $conn->prepare("SELECT email, created_at FROM users WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $userID); 

    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        $stmt->close();
        return null;
    }

    $email = null;
    $created_at = null;
    $stmt->bind_result($email, $created_at);
    $stmt->fetch();

    $stmt->close();

    return [
        "email" => $email,
        "created_at" => $created_at
    ];
}



function edit_user($conn, $userID, $attribute, $newValue) {
    $query = "UPDATE users SET $attribute = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $newValue, $userID);

    $success = $stmt->execute();

    $stmt->close();
    return $success;
}



function get_users($conn) {
    $query = "SELECT id, email, created_at, activated FROM users";
    $result = $conn->query($query);

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            "id" => $row["id"],
            "email" => $row["email"],
            "created_at" => $row["created_at"],
            "activated" => $row["activated"]
        ];
    }

    return $users;
}