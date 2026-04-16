<?php
function insertResult($conn, $user_id, $data) {
    $algo_id = $data['algoID'];
    $size = $data['size'];
    $time = $data['time'];
    $space = $data['space'];

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
    
    $output = $stmt->execute();
    $stmt->close();
    return $output;
}
?>