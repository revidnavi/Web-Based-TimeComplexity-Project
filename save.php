<?php
$conn = new mysqli("localhost", "root", "", "aco_db");
$data =json_decode(
    file_get_contents("php://input"),
    true
);
$size = $data['size'];
$time = $data['time'];
$sql = "INSERT INTO results (input_size,execution_time) VALUES ('$size','$time')";
$conn->query($sql);
?>