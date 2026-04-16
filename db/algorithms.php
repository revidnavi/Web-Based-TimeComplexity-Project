<?php
function getAlgorithms($conn) {
    $sql = "SELECT * FROM algorithms";
    $result = $conn->query($sql);
    $output = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $output[] = $row;
        }
    }
    return $output;
}

function getAlgorithm($conn, $id) {
    $sql = "SELECT * FROM algorithms WHERE id = $id LIMIT 1";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    return null;
}
?>