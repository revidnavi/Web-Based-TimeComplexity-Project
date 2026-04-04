<?php
function insertResult($conn, $user_id, $data) {
    $algo = $data['algo'];
    $size = $data['size'];
    $time = $data['time'];
    $space = $data['space'];
    $time_complexity = 'time_complexity-PLACEHOLDER';
    $space_complexity = 'space_complexity-PLACEHOLDER';

    $stmt = $conn->prepare(
        "INSERT INTO results (
            user_id, 
            algo, input_size, 
            execution_time, space_usage,
            time_complexity, space_complexity
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        "isiddss", 
        $user_id, 
        $algo, $size, 
        $time, $space,
        $time_complexity, $space_complexity
    );
    
    $output = $stmt->execute();
    $stmt->close();
    return $output;
}
?>