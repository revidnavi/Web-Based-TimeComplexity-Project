<?php

function get_algorithms($conn) {
    $sql = "SELECT * FROM algorithms";

    $result = $conn->query($sql);
    $algorithms = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $algorithms[] = $row;
        }
    }

    return $algorithms;
}



function get_algorithm($conn, $id) {
    $sql = "SELECT * FROM algorithms WHERE id = $id LIMIT 1";
    
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        return $result->fetch_assoc();
    }

    return null;
}