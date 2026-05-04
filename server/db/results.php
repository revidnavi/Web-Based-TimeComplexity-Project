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



function get_chart_data($conn, $user_id) {
    $stmt = $conn->prepare(
        "SELECT input_size, execution_time, algo_name FROM (
            SELECT r.input_size, r.execution_time, a.algo_name,
                ROW_NUMBER() OVER (
                    PARTITION BY a.algo_name 
                    ORDER BY r.id DESC
                ) as rn
            FROM results r
            JOIN algorithms a ON r.algo_id = a.id
            WHERE r.user_id = ?
        ) t
        WHERE rn <= 10
        ORDER BY algo_name, input_size ASC"
    );

    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    $input_size = null;
    $execution_time = null; 
    $algo_name = "";
    $stmt->bind_result($input_size, $execution_time, $algo_name);

    $grouped = [];

    while ($stmt->fetch()) {
        $grouped[$algo_name][] = [
            "input_size" => $input_size,
            "execution_time" => $execution_time
        ];
    }

    $stmt->close();
    return $grouped;
}