<?php
session_start(); // Start the session
if (isset($_SESSION['user_id'])) {
    // User is logged in, retrieve the user's user_info_id
    $user_id = $_SESSION['user_id'];
    $name = $_SESSION['user_name'];
    //$user_email = $_SESSION['user_email'];
    // You can use $user_id as needed
    // echo $user_id;
    // echo $name;
} else {
    // Redirect to login page if user is not logged in
    header("Location: login.php");
    exit(); // Stop further execution
}
 ?>
<?php 
include('class/Form.php');
include('include/header.php');
?>

<html>
<head>

<style type="">
    body{background:#0050b3;}
    .bg-default{ background:#f1f1f1;}
    .mt-5{margin-top:5rem;}
    .mb-3{margin-bottom:3rem;}
    .error{
        color:red !important; 
}
</style>
</head>
<body>
    <div class="container bg-default mt-5">
        <div class="row">
              <?php
               if (isset($_SESSION['message'])) {
    echo "<div id='message' style='color:green'>{$_SESSION['message']}</div>"; // Display success message in green
    unset($_SESSION['message']); // Remove the message from session after displaying
}

if (isset($_SESSION['error'])) {
    echo "<div id='message' style='color:red'>{$_SESSION['error']}</div>"; // Display error message in red
    unset($_SESSION['error']); // Remove the error message from session after displaying
}
        ?>       
        <div class="col-md-12">
        <h3>Registration Form<a href="logout.php" class="btn btn-danger pull-right">Logout</a></h3>
        <div class="form-group">

</div>
    </div>
    
    </div>

        <!-- Registration Form -->
        <form method="POST" action="<?= htmlspecialchars($_SERVER["PHP_SELF"]); ?> " enctype="multipart/form-data">

            <!-- Form fields -->
            <div class="row">
                <!-- Full Name -->
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="control-label">Full Name <span class="required">*</span></label>
                        <input type="text" id="name" name="name" class="form-control txtCharacter" autocomplete="off" value="<?= $name?>" required />
                    </div>
                </div>
                <!-- Role -->
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="control-label"> Role <span class="required">*</span></label>
                        <select name="val_type" id="val_type" class="form-control" required>
                           <option value="">---Select---</option>
            <option value="Internal" <?= ($userss[0]->mrvi_role == 'Internal') ? 'selected' : '' ?>>Internal</option>
            <option value="External" <?= ($userss[0]->mrvi_role == 'External') ? 'selected' : '' ?>>External</option>  <!-- Options -->
                        </select>
                    </div>
                </div>
                <!-- Gender -->
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="control-label"> Gender <span class="required">*</span></label>
                        <select name="gender" id="gender" class="form-control" required >
                           <option value="">---Select---</option>
                 <option value="M" <?= ($userss[0]->mrvi_gender == 'M') ? 'selected' : '' ?>>Male</option>
                 <option value="F" <?= ($userss[0]->mrvi_gender == 'F') ? 'selected' : '' ?>>Female</option>
                 <option value="O" <?= ($userss[0]->mrvi_gender == 'O') ? 'selected' : '' ?>>Others</option>
                        </select>
                    </div>
                </div>
                <!-- Other form fields -->
            </div>




<div class="row">
                <!-- Full Name -->
                <div class="col-md-4">       
       <div class="form-group">
       <label class="control-label">Email Id <span class="required">*</span></label>     
        <input type="email" maxlength="100" class="form-control" value="<?= $emailValue;?>" name="email" id="email" autocomplete="off"  required>
        <span class="error email">&nbsp;</span>
        </div>      
    </div>
        <div class="col-md-4">       
       <div class="form-group">
       <label class="control-label">Confirm Email Id <span class="required">*</span></label>     
        <input type="email" maxlength="100" name="cemail" id="cemail" value="<?= $emailValue;?>" class="form-control" onpaste="return false" autocomplete="off" required>
        <span class="error cemail">&nbsp;</span>
        </div>  

    </div>
    
    <div class="col-md-4">
         <div class="form-group">
            <label class="control-label">Mobile Number <span class="required">*</span></label>
            <input type="text" minlength="10" name="phoneNumber" id="phoneNumber" value="<?= $userss[0]->mrvi_mobile ?>" onchange="fun1(this.value,this.id)" class="form-control num onlyNumeric" maxlength="10" autocomplete="off" required>
            <span class="error phoneNumber">&nbsp;</span>
        </div>
                <!-- Other form fields -->
            </div>
        </div>
        <div class="row">
    
    
     
     <div class="col-md-4">
         <div class="form-group">
            <label class="control-label">Confirm Mobile Number <span class="required">*</span></label>
            <input type="text" minlength="10" name="cphoneNumber" id="cphoneNumber" value="<?= $userss[0]->mrvi_mobile ?>" class="form-control num onlyNumeric" maxlength="10" onpaste="return false" autocomplete="off" required><span class="error cphoneNumber">&nbsp;</span>
        </div>
     </div>
    
     <div class="col-md-4">
    <div class="form-group">
        <label class="control-label">Date of Birth <span class="required">*</span></label>
        <input type="text" minlength="10" name="dob" id="dob" value="<?= $userss[0]->mrvi_date_of_birth ?>" class="form-control  " maxlength="10" placeholder="YYYY-MM-DD" autocomplete="off" required>
    </div>
</div>


    <div class="col-md-4">
                    
                    <div class="form-group">
    <label class="control-label">Photograph<span class="">*</span></label>
    <input class="form-control" onchange="readURL_photo(this)" type="file" id="photo" name="photo" accept="image/jpeg, image/png, image/gif" autocomplete="off" required>
    <?php if (!empty($userss[0]->mrvi_photo)): ?>
    <a href="uploads/photo/<?=$userss[0]->mrvi_photo?>" target="_blank">view</a>
<?php endif; ?>
  
    <span class="error photo"></span><br>   
    <span>(<b style="color:red;">Note:</b> Upload files in .gif/.jpg/.png format and file size should be less than 300 kb)</span> <br>                          
</div>
<img id="photo-preview" src="#" alt="Preview" style="display: none; max-width: 200px; max-height: 200px; margin-top: 10px;">
                 </div>

</div>
    <div class="row">
    
     
                    
                 <div class="col-md-4">
                     <div class="form-group">
                        <label class="control-label">Signature<span class="">*</span></label>
                        <input class="form-control" onchange="readURL_sign(this)" type="file" id="faculty_signature" name="faculty_signature" accept="image/jpeg" autocomplete="off" required >
                        <?php if (!empty($userss[0]->mrvi_signature)): ?>
    <a href="uploads/sign/<?=$userss[0]->mrvi_signature?>" target="_blank">view</a>
<?php endif; ?>
                        <span class="error faculty_signature"></span><br>
                        <span>(<b style="color:red;">Note:</b> Upload files in .gif/.jpg/.png format and file size should be less than 300 kb)</span> <br>                          
                    </div>
                    <img id="sign-preview" src="#" alt="Preview" style="display: none; max-width: 200px; max-height: 200px; margin-top: 10px;">
                 </div>
                  <div class="col-md-4">
         <div class="form-group">
            <label class="control-label">Upload PAN Card<span class="">*</span></label>
            <input type="file" onchange="readURL_pan(this)" name="panfile" id="panfile" class="form-control fileVal"  required>
          <?php if (!empty($userss[0]->mrvi_pancard_photo)): ?>
    <a href="uploads/pan/<?=$userss[0]->mrvi_pancard_photo?>" target="_blank">view</a>
<?php endif; ?>
            <span class="error panfile"></span><br>
             <span>(<b style="color:red;">Note:</b> Upload files in .gif/.jpg/.png/.pdf format and file size should be less than 300 kb)</span> <br>
        </div>
        <img id="pan-preview" src="#" alt="Preview" style="display: none; max-width: 200px; max-height: 200px; margin-top: 10px;">
     </div>

     <div class="col-md-4">
    <div class="form-group">
        <label class="control-label">Address</label>
        <textarea name="address" id="address" class="form-control" rows="4" placeholder="Enter your address"><?= $userss[0]->mrvi_address ?></textarea>
    </div>
</div>

                 </div>     


            <!-- Form submission buttons -->
            <div class="row">
                <div class="col-md-12 mb-3">
                    <input type="submit" id="btnSave" value="Submit" class="btn btn-primary" name="btnSave">
                    <a href="logout.php" class="btn btn-danger">Close</a>
                </div>
            </div>
        </form>
    </div>

<script>
    setTimeout(function() {
    var message = document.getElementById('message');
    if (message) {
        message.style.display = 'none';
    }
}, 2000);
</script>
<script type="text/javascript">


   
     function Validate1() {
        var phoneNumber = document.getElementById("phoneNumber").value;
        var cphoneNumber = document.getElementById("cphoneNumber").value;
        if (phoneNumber != cphoneNumber) {
            alert("MobileNo And Confirm MobileNo Is Not Matched.");
            return false;
        }else{
        return true;
        }
    }   
   
    function Validate3() {
        var email = document.getElementById("email").value;
        var cemail = document.getElementById("cemail").value;
        if (email != cemail) {
            alert("Email And Confirm Email Is Not Matched.");
            return false;
        }else{
        return true;
        }
    }
</script>
<script>
$(function () {
$('.txtCharacter').keydown(function (e) {
if (e.ctrlKey || e.altKey) {
e.preventDefault();
} else {
var key = e.keyCode;
if (!((key == 8) || (key == 9) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
e.preventDefault();
}
}
});
});

$('body').on('focus',".onlyNumeric", function(){
$('.onlyNumeric').keydown(function (e) {
if (e.shiftKey || e.ctrlKey || e.altKey) {
e.preventDefault();
} else {
var key = e.keyCode;
if (!((key == 8) || (key == 9)|| (key == 32) || (key == 46) ||(key == 144) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
e.preventDefault();
}
}
});
});
</script>   
   <script>   
  
  
        $(document).ready(function() {
            $(".num").keypress(function(test) {
                if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                    return false;
                }
            });
        });   
    $(function() {
        $('body').on('keydown', '.form-control', function(e) {
            if (e.which === 32 && e.target.selectionStart === 0) {
                return false;
            }
        });
    });     
        function readURL_pan(input) {   


if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#pan-preview').attr('src', e.target.result);
            $('#pan-preview').show();
        }

        reader.readAsDataURL(input.files[0]);
    }       

             var pan_status=0;
          var file_ext = $('#panfile').val().split('.').pop().toLowerCase();
          if($.inArray(file_ext, ['gif','png','jpg','jpeg','pdf']) == -1) {
           $('.panfile').html('Please upload only gif,png,jpg,jpeg,pdf format files.'); pan_status=1;
           $('#panfile').val('');      
       }else if($('#panfile').prop('files')[0].size>300000){
          $('.panfile').html('File Maximum Size Should Be < 300 kb');
          pan_status=1;
          $('#panfile').val('');
      }else{
         $('.panfile').html('');
         pan_status=0; 
      }         
            if(input.files[0].type=='image/jpeg'){
      $('.pan_certificate_modal').trigger('click');
            }
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#pan_card')
                        .attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        }   
        function readURL_photo(input) { 

        if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#photo-preview').attr('src', e.target.result);
            $('#photo-preview').show();
        }

        reader.readAsDataURL(input.files[0]);
    }       
             var user_photo=0;
          var file_ext = $('#photo').val().split('.').pop().toLowerCase();
          if($.inArray(file_ext, ['gif','png','jpg','jpeg']) == -1) {
           $('.photo').html('Please upload only gif,png,jpg,jpeg format files.'); user_photo=1;
           $('#photo').val('');      
       }else if($('#photo').prop('files')[0].size>300000){
          $('.photo').html('File Maximum Size Should Be < 300 kb');
          user_photo=1;
          $('#photo').val('');
      }else{
         $('.photo').html('');
         user_photo=0; 
      }     
        }
        function readURL_sign(input) {  


if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#sign-preview').attr('src', e.target.result);
            $('#sign-preview').show();
        }

        reader.readAsDataURL(input.files[0]);
    }       

             var user_sign=0;
          var file_ext = $('#faculty_signature').val().split('.').pop().toLowerCase();
          if($.inArray(file_ext, ['gif','png','jpg','jpeg']) == -1) {
           $('.faculty_signature').html('Please upload only gif,png,jpg,jpeg format files.'); user_sign=1;
           $('#faculty_signature').val('');      
       }else if($('#faculty_signature').prop('files')[0].size>300000){
          $('.faculty_signature').html('File Maximum Size Should Be < 300 kb');
          user_sign=1;
          $('#faculty_signature').val('');
      }else{
         $('.faculty_signature').html('');
         user_sign=0; 
      }     
        }
</script>
<script>  
  

function fun1(value,id)
      {
      errors=0;
      var phoneNumber=$("#phoneNumber").val();
      if(phoneNumber.length<10){
          $("#" + id).val('');
          $(".phoneNumber").html('Please Enter 10  Digit Contact Number');
      return false;
      }
      var first_array=Array('6','7','8','9');
      if(value.length <=1)
      {
      
      for(i=0;i<first_array.length;i++)
      {
      if(value==first_array[i])
      {
      errors++;
      }
      }
      }
      else
      {
      var pattern = /^[6-9]{1}[0-9]{1,9}$/;
      if(pattern.test(value))
      {
      errors++;
      }
      }
      if(errors > 0)
      {
      $(".phoneNumber").html('');
      return true;
      
      }
      else
      {
      $("#" + id).val('');
      $(".phoneNumber").html('Invalid Mobile No.,please enter valid no');
      }
      }
</script>

   
</body>
</html>



