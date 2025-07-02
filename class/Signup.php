<?php
// Establish connection to the database
/*
$servername = "localhost"; // Change this to your MySQL server's hostname
$username = "root"; // Change this to your MySQL username
$password = ""; // Change this to your MySQL password
$database = "ci_db"; // Change this to your MySQL database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

*/
include('include/config.php');

session_start();
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register'])) {
    // Sanitize and validate input
    $firstname = mysqli_real_escape_string($conn, $_POST['firstname']);
$lastname = mysqli_real_escape_string($conn, $_POST['lastname']);
$email = mysqli_real_escape_string($conn, $_POST['email']);
$password = mysqli_real_escape_string($conn, $_POST['passwd']); // Note: Hash password before storing in the database for better security

// Check if email already exists in any table
$check_email_query = "SELECT COUNT(*) as count FROM tblusers WHERE Email='$email' UNION SELECT COUNT(*) FROM tbl_user WHERE mrvi_email='$email'";
$check_result = $conn->query($check_email_query);
$row = $check_result->fetch_assoc();
$email_count = $row['count'];

if ($email_count > 0) {
    $_SESSION['error_message'] = "Error: Email already exists";
    header("Location: register.php");
    exit();
} else {
    // Prepare SQL insert statement for tblusers
    $sql = "INSERT INTO tblusers (FirstName, LastName, Email, Password) VALUES ('$firstname', '$lastname', '$email', '$password')";

    // Execute the insert statement for tblusers
    if ($conn->query($sql) === TRUE) {
        // Retrieve the ID of the last inserted row in tblusers
        $last_inserted_id = $conn->insert_id;

        // Prepare SQL insert statement for tbl_user with user_info_id
        $data1 = "INSERT INTO tbl_user (user_info_id, mrvi_name, mrvi_email) VALUES ('$last_inserted_id', '$firstname', '$email')";

        // Execute the insert statement for tbl_user
        if ($conn->query($data1) === TRUE) {
            $_SESSION['success_message'] = "New records created successfully";
            header("Location: register.php");
            exit();
        } else {
            // Handle the case where the insertion into tbl_user fails
            $_SESSION['error_message'] = " " . $conn->error;
            header("Location: register.php");
            exit();
        }
    } else {
        // Handle the case where the insertion into tblusers fails
        $_SESSION['error_message'] = "Error: " . $conn->error;
        header("Location: register.php");
        exit();
    }
}

}


// Close connection
$conn->close();
?>
