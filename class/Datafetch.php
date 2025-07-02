<?php
/*
$servername = "localhost"; 
$username = "root"; 
$password = ""; // 
$database = "ci_db"; // 


$conn = new mysqli($servername, $username, $password, $database);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

*/

include('include/config.php');


$sql = "SELECT mrvi_name, mrvi_role, mrvi_mobile, mrvi_email, mrvi_address,user_info_id, mrvi_gender, mrvi_date_of_birth FROM tbl_user";
$result = $conn->query($sql);


if ($result->num_rows > 0) {
    $users = array(); // Initialize an empty array to hold user objects

    
    while ($row = $result->fetch_assoc()) {
        $user = new stdClass(); 
        $user->mrvi_name = $row['mrvi_name'];
        $user->mrvi_role = $row['mrvi_role'];
        $user->mrvi_mobile = $row['mrvi_mobile'];
        $user->mrvi_email = $row['mrvi_email'];
        $user->mrvi_address = $row['mrvi_address'];
        $user->mrvi_gender = $row['mrvi_gender'];
        $user->mrvi_date_of_birth = $row['mrvi_date_of_birth'];
        $user->user_info_id= $row['user_info_id'];
        
        
        $users[] = $user;
    }
} else {
    echo "No records found";
}

// Close the database connection
$conn->close();
?>

