<?php error_reporting(E_ALL);
ini_set('display_errors', 1); ?>
<?php
// Establish connection to the database
/*$servername = "localhost"; // Change this to your MySQL server's hostname
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



  
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name = $_POST['name'];
    $val_type = $_POST['val_type'];
    $gender = $_POST['gender'];
    $email = $_POST['email'];
    $phoneNumber = $_POST['phoneNumber'];
    $dob = $_POST['dob'];
    $address = $_POST['address'];
    
    // Handle file upload for PAN card photo

    if (isset($_FILES["panfile"]["name"])) {
        $upload_dir = "uploads/pan/";
        $allowed_types = ["jpg", "jpeg", "png", "gif", "pdf"];
        $username = $name;
        $filename = basename($_FILES["panfile"]["name"]);
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $new_filename =$username."_Pancard_" . date("YmdHis") . "_" . $filename;
    
        if (in_array($extension, $allowed_types)) {
           if (move_uploaded_file($_FILES["panfile"]["tmp_name"], $upload_dir . '/' . $new_filename)) {
    $pancard = $new_filename;
} else {
    $pancard = ""; // Error uploading file
}
        } else {
            $pancard = ""; // File type not allowed
        }
    } else {
        $pancard = ""; // No file uploaded
    }



    if (isset($_FILES["photo"]["name"])) {
        $upload_dir = "uploads/photo/";
        $allowed_types = ["jpg", "jpeg", "png", "gif", "pdf"];
    $username = $name;
        $filename = basename($_FILES["photo"]["name"]);
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $new_filename = $username."_Photo_" . date("YmdHis") . "_" . $filename;
    
        if (in_array($extension, $allowed_types)) {
           if (move_uploaded_file($_FILES["photo"]["tmp_name"], $upload_dir . '/' . $new_filename)) {
    $photo = $new_filename;
} else {
    $photo = ""; // Error uploading file
}
        } else {
            $photo = ""; // File type not allowed
        }
    } else {
        $photo = ""; // No file uploaded
    }

    if (isset($_FILES["faculty_signature"]["name"])) {
        $upload_dir = "uploads/sign/";
        $allowed_types = ["jpg", "jpeg", "png", "gif", "pdf"];
    $username = $name;
        $filename = basename($_FILES["faculty_signature"]["name"]);
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $new_filename = $username."_Signature_" . date("YmdHis") . "_" . $filename;
    
        if (in_array($extension, $allowed_types)) {
           if (move_uploaded_file($_FILES["faculty_signature"]["tmp_name"], $upload_dir . '/' . $new_filename)) {
    $faculty_signature = $new_filename;
} else {
    $faculty_signature = ""; // Error uploading file
}
        } else {
            $faculty_signature = ""; // File type not allowed
        }
    } else {
        $faculty_signature = ""; // No file uploaded
    }


    
   $user_id = $_SESSION['user_id']; // Fetch user_id from session directly

// Construct and execute SQL UPDATE statement for tbl_user
$sql = "UPDATE tbl_user SET 
            mrvi_name = '$name', 
            mrvi_role = '$val_type', 
            mrvi_mobile = '$phoneNumber', 
            mrvi_email = '$email', 
            mrvi_address = '$address', 
            mrvi_gender = '$gender', 
            mrvi_date_of_birth = '$dob', 
            mrvi_pancard_photo = '$pancard',
            mrvi_signature = '$faculty_signature',
            mrvi_photo = '$photo' 
        WHERE user_info_id = '$user_id'"; // Use user_id directly, no need for subquery

// Execute the SQL query for tbl_user
$result = mysqli_query($conn, $sql);



// Check if the UPDATE query for tbl_user was successful
if ($result) {
    $_SESSION['message'] = "Record updated successfully"; // Store message in session
} else {
    $_SESSION['error'] = "Error updating record: " . mysqli_error($conn); // Store error message in session
}

$sql_email = "UPDATE tblusers SET 
                Email = '$email'
             WHERE id = '$user_id'";
//echo $sql_email; die();
$result_email = mysqli_query($conn, $sql_email);
if ($result_email) {
    // Email updated successfully
} else {
    // Handle error
}
}



$sqlid = "SELECT Email FROM tblusers WHERE id = '$user_id'";
$resultid = $conn->query($sqlid);

if ($resultid->num_rows > 0) {
    $row = $resultid->fetch_assoc();
    $emailValue = $row['Email'];
} else {
    $emailValue = ''; // Set a default value if no email found
}

// Fetch user details for displaying after update
$sql1 = "SELECT mrvi_name, mrvi_role, mrvi_mobile, mrvi_email, mrvi_address, mrvi_gender, mrvi_date_of_birth, mrvi_photo, mrvi_pancard_photo, mrvi_signature FROM tbl_user WHERE user_info_id = '$user_id'";

//echo $sql1; die();
$result1 = $conn->query($sql1);

if ($result1->num_rows > 0) {
    $users = array(); // Initialize an empty array to hold user objects

    while ($row = $result1->fetch_assoc()) {
        $users = new stdClass(); 
        $users->mrvi_name = $row['mrvi_name'];
        $users->mrvi_role = $row['mrvi_role'];
        $users->mrvi_mobile = $row['mrvi_mobile'];
        $users->mrvi_email = $row['mrvi_email'];
        $users->mrvi_address = $row['mrvi_address'];
        $users->mrvi_gender = $row['mrvi_gender'];
        $users->mrvi_date_of_birth = $row['mrvi_date_of_birth'];
        $users->mrvi_photo = $row['mrvi_photo'];
         $users->mrvi_pancard_photo = $row['mrvi_pancard_photo'];
          $users->mrvi_signature = $row['mrvi_signature'];
        
        
        
        $userss[] = $users;
    }
} else {
    echo "No records found";
}



// Step 6: Close the database connection
$conn->close();
?>
