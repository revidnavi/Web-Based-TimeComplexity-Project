<?php

function insert_result($conn, $user_id, $algo_id, $size, $time, $space) {
    $stmt = $conn->prepare(
        "INSERT INTO results (
            user_id, 
            algo_id, input_size, 
            execution_time, space_usage
        ) 
        VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        "iiidd", 
        $user_id, 
        $algo_id, $size, 
        $time, $space
    );

    $success = $stmt->execute();
    
    $stmt->close();
    return $success;
}



function get_last_10results($conn, $user_id) {
    $stmt = $conn->prepare(
        "SELECT r.input_size, r.execution_time, r.space_usage, a.algo_name
        FROM results r
        JOIN algorithms a ON r.algo_id = a.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
        LIMIT 10"
    );
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    $input_size = null;
    $execution_time = null;
    $space_usage = null;
    $algo_name = null;
    $results = [];
    $stmt->bind_result($input_size, $execution_time, $space_usage, $algo_name);
    while ($stmt->fetch()) {
        $results[] = [
            "input_size" => $input_size,
            "execution_time" => $execution_time,
            "space_usage" => $space_usage,
            "algo_name" => $algo_name
        ];
    }

    $stmt->close();
    return $results;
}