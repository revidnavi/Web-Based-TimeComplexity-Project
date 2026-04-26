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



function get_active_algorithms($conn) {
    $sql = "SELECT * FROM algorithms WHERE active = 1";

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



function insert_algorithm($conn, 
    $algoName, 
    $category,
    $timeBest,
    $timeAvg,
    $timeWorst,
    $spaceComplexity,
    $active
) {
    $stmt = $conn->prepare("INSERT INTO algorithms (algo_name, category, time_best, time_avg, time_worst, space_complexity, active) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssi", 
        $algoName, 
        $category,
        $timeBest,
        $timeAvg,
        $timeWorst,
        $spaceComplexity, 
        $active
    );
    
    $success = $stmt->execute();

    $stmt->close();
    return $success;
}



function update_algorithm($conn, 
    $id, 
    $algoName, 
    $category,
    $timeBest,
    $timeAvg,
    $timeWorst,
    $spaceComplexity,
    $active
) {
    $stmt = $conn->prepare("UPDATE algorithms SET algo_name = ?, category = ?, time_best = ?, time_avg = ?, time_worst = ?, space_complexity = ?, active = ? WHERE id = ?");
    $stmt->bind_param("ssssssii", 
        $algoName, 
        $category,
        $timeBest,
        $timeAvg,
        $timeWorst,
        $spaceComplexity,
        $active,
        $id
    );
    
    $success = $stmt->execute();

    $stmt->close();
    return $success;
}



function delete_algorithm($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM algorithms WHERE id = ?");
    $stmt->bind_param("i", $id);    
    $success = $stmt->execute();

    $stmt->close();
    return $success;
}