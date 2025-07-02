<?php 
include('class/Signin.php');
include('include/header.php');
?>
<html>
<title></title>
<head>
	<style>
body {
	color: #fff;
	background: #63738a;
	font-family: 'Roboto', sans-serif;
}
.form-control {
	height: 40px;
	box-shadow: none;
	color: #969fa4;
}
.form-control:focus {
	border-color: #5cb85c;
}
.form-control, .btn {        
	border-radius: 3px;
}
.signup-form {
	width: 450px;
	margin: 0 auto;
	padding: 30px 0;
  	font-size: 15px;
}
.signup-form h2 {
	color: #fff;
	margin: 0 0 15px;
	position: relative;
	text-align: center;
}
.signup-form h2:before, .signup-form h2:after {
	content: "";
	height: 2px;
	width: 30%;
	background: #d4d4d4;
	position: absolute;
	top: 50%;
	z-index: 2;
}	
.signup-form h2:before {
	left: 0;
}
.signup-form h2:after {
	right: 0;
}
.signup-form .hint-text {
	color: #fff;
	margin-bottom: 30px;
	text-align: center;
}
.signup-form form {
	color: #999;
	border-radius: 3px;
	margin-bottom: 15px;
	background: #f2f3f7;
	box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
	padding: 30px;
}
.signup-form .form-group {
	margin-bottom: 20px;
}
.signup-form input[type="checkbox"] {
	margin-top: 3px;
}
.signup-form .btn {        
	font-size: 16px;
	font-weight: bold;		
	min-width: 140px;
	outline: none !important;
}
.signup-form .row div:first-child {
	padding-right: 10px;
}
.signup-form .row div:last-child {
	padding-left: 10px;
}    	
.signup-form a {
	color: #fff;
	text-decoration: underline;
}
.signup-form a:hover {
	text-decoration: none;
}
.signup-form form a {
	color: #5cb85c;
	text-decoration: none;
}	
.signup-form form a:hover {
	text-decoration: underline;
}  
</style>
</head>
<div class="signup-form">
		<h2>Signin</h2>
		<div class="form-group">
		</div>
		 <?php
               if (isset($_SESSION['login_error'])) {
    echo "<div id='message' style='color:red'>{$_SESSION['login_error']}</div>"; // Display success message in green
    unset($_SESSION['login_error']); // Remove the message from session after displaying
}


?>

				<form id="loginform" class="form-horizontal" role="form" method="POST" action="">
    <div class="form-group">
        <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
        <input type="text" class="form-control" id="loginId" name="loginId" value="" placeholder="Email">
    </div>

    <div class="form-group">
        <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
        <input type="password" class="form-control" id="loginPass" name="loginPass" value="" placeholder="Password">
    </div>

    <div class="form-group">
        <input type="submit" name="login" value="Login" class="btn btn-success btn-lg btn-block">
    </div>
    <div class="text-center">Not Registered Yet? <a href="register.php">Sign up here</a></div>
</form>

</div>

	
	
<?php include('include/footer.php');?>

<script>
    setTimeout(function() {
    var message = document.getElementById('message');
    if (message) {
        message.style.display = 'none';
    }
}, 2000);
</script>
</html>