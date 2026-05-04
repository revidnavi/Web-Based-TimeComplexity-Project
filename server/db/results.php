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

function get_results($conn, $limit, $offset) {

    $stmt = $conn->prepare(
        "SELECT 
            a.algo_name,
            a.category,
            r.input_size,
            r.execution_time,
            r.created_at
         FROM results r
         INNER JOIN algorithms a ON r.algo_id = a.id
         ORDER BY r.created_at DESC
         LIMIT ? OFFSET ?"
    );

    $stmt->bind_param("ii", $limit, $offset);

    $stmt->execute();

    $result = $stmt->get_result();

    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $stmt->close();

    return $data;
}

function clear_history($conn, $user_id) {
    $stmt = $conn->prepare(
        "DELETE FROM results 
         WHERE user_id = ?"
    );
    $stmt->bind_param(
        "i", 
        $user_id
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



function get_more_chart_data($conn) {
    $stmt = $conn->prepare(
        "SELECT input_size, execution_time, algo_name FROM (
            SELECT r.input_size, r.execution_time, a.algo_name,
                ROW_NUMBER() OVER (
                    PARTITION BY a.algo_name 
                    ORDER BY r.id DESC
                ) as rn
            FROM results r
            JOIN algorithms a ON r.algo_id = a.id
        ) t
        WHERE rn <= 50
        ORDER BY algo_name, input_size ASC"
    );
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