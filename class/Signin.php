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


session_start(); // Start the session

// Check if the form is submitted using POST method and if the login button is pressed
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['login'])) {
    // Include your database connection file or establish connection here
    // Example: include_once('db_connection.php');
    // Assuming $conn is your database connection object

    // Sanitize and validate input
   $loginId = mysqli_real_escape_string($conn, $_POST['loginId']);
$loginPass = mysqli_real_escape_string($conn, $_POST['loginPass']);

// Check if the user exists in the database
$sql = "SELECT * FROM tblusers WHERE Email = '$loginId' AND Password = '$loginPass'";
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows == 1) {
        // Fetch user data
        $user = $result->fetch_assoc();
        $userName = $user['FirstName'];
        $userRole = $user['role']; // Assuming 'Role' is the column in your database representing the user's role
        $userId = $user['id'];
        // Set session variables
         $_SESSION['user_id'] = $userId;
        $_SESSION['user_email'] = $loginId;
        $_SESSION['user_name'] = $userName;
        // Redirect based on user role
        if ($userRole == 'admin') {
            header("Location: dashboard.php");
        } else {
            header("Location: welcome.php");
        }
        exit(); // Stop further execution
    } else {
        // User does not exist or invalid credentials
        $_SESSION['login_error'] = "Invalid email or password";
        // Redirect back to login page with error message
        header("Location: login.php");
        exit(); // Stop further execution
    }
} else {
    // Handle query errors
    echo "Error: " . $conn->error;
}

}


// Close connection
$conn->close();
?>
