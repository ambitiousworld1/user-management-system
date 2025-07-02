<?php
// Connect to your database (modify this according to your database configuration)
include('include/config.php');

// Fetch data from your database
$sql = "SELECT mrvi_name, mrvi_role, mrvi_mobile, mrvi_email, mrvi_address,user_info_id, mrvi_gender, mrvi_date_of_birth FROM tbl_user";
$result = $conn->query($sql);

// Initialize an array to store fetched data
$data = array();

// Check if there are rows in the result
if ($result->num_rows > 0) {
    // Loop through each row in the result set
    while($row = $result->fetch_assoc()) {
        // Add each row to the data array
        $data[] = $row;
    }
}

// Close connection
$conn->close();

// Convert the data array to JSON and output it
echo json_encode($data);
?>
