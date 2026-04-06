<?php
function insertResult($conn, $user_id, $data) {
    $algo = $data['algo'];
    $size = $data['size'];
    $time = $data['time'];
    $space = $data['space'];

    $stmt = $conn->prepare(
        "INSERT INTO results (
            user_id, 
            algo, input_size, 
            execution_time, space_usage
        ) 
        VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        "isidd", 
        $user_id, 
        $algo, $size, 
        $time, $space
    );
    
    $output = $stmt->execute();
    $stmt->close();
    return $output;
}
?>