<?php
/*class dbConfig {
    protected $serverName;
    protected $userName;
    protected $password;
    protected $dbName;

    function __construct() {
        $this->serverName = 'localhost';
        $this->userName = 'root';
        $this->password = '';
        $this->dbName = 'ci_db';
    }
}*/


// Establish connection to the database
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

?>
