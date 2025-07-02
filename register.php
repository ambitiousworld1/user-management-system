<?php 
include('class/Signup.php');
include('include/header.php');
?>

<title></title>
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

	<div  class="signup-form">
		<h2>Register</h2> 
			
				<form id="signupform" class="form-horizontal" role="form" method="POST" action="">				
					
					<div class="form-group">
						<?php
//session_start(); // Start the session

// Display success message if set
if(isset($_SESSION['success_message'])){ 
?>
    <p style="color:green"><?php echo $_SESSION['success_message']; ?></p>    
<?php 
    unset($_SESSION['success_message']); // Unset the session variable after displaying
} 

// Display error message if set
if(isset($_SESSION['error_message'])){ 
?>
    <p style="color:red"><?php echo $_SESSION['error_message']; ?></p>    
<?php 
    unset($_SESSION['error_message']); // Unset the session variable after displaying
} 
?>
						<div class="row">
							<div class="col">
							
							<input type="text" class="form-control" name="firstname" placeholder="First Name" value="" required>
							</div>
							<div class="col">
							<input type="text" class="form-control" name="lastname" placeholder="Last Name" value="" >	
							</div>
						</div>
						
					</div>
								
					<div class="form-group">
						
						
							<input type="email" class="form-control" name="email" placeholder="Email Address" value="" required>
						
					</div>					
					<div class="form-group">
						
						
							<input type="password" class="form-control" name="passwd" placeholder="Password" required>
						
					</div>								
					<div class="form-group">						                                  
						
							<button id="btn-signup" type="submit" name="register" value="register" class="btn btn-success btn-lg btn-block"><i class="icon-hand-right"></i> &nbsp Register</button>			
						
					</div>					
					<div class="form-group">
						<div class="col-md-12 control">
							<div style="border-top: 1px solid#888; padding-top:15px; font-size:85%" >
								If You've already an account! 
							<a href="login.php">
								Log In 
							</a>Here
							</div>
						</div>
					</div>  				
				</form>
			</div>
		

<?php include('include/footer.php');?>