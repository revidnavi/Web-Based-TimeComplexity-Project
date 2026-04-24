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