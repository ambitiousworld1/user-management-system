<?php 
include('class/Datafetch.php');
include('include/header.php');
include('include/config.php');
if(isset($_GET['delid']))
{
$rid=intval($_GET['delid']);
$sql=mysqli_query($conn,"delete from tbl_user where user_info_id=$rid");
 $sql2 = mysqli_query($conn, "DELETE FROM tblusers WHERE id=$rid");
//echo "<script>alert('Data deleted');</script>"; 
 echo "<script>window.location.href = 'dashboard.php'</script>";      
} 
?>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
    <!-- Include CSS files -->
    <link href="/include/css/style.default.css" rel="stylesheet"> 

<link href="include/css/jquery.dataTables.min.css" rel="stylesheet">
<link href="include/css/buttons.dataTables.min.css" rel="stylesheet">

<!-- Include JavaScript files -->
<script src="include/js/jquery-1.10.2.min.js"></script>
<script src="include/js/regular_expression_msg.js"></script>
<script src="include/js/admin_form_validation.js"></script>
</head>
<body>
<div class="panel-heading">
            <div style="display: flex; justify-content: space-between; align-items: center;background-color: green;">
    <h4 class="panel-title" style=" color: white; padding: 10px; margin: 10px 0;">All Users List</h4>
    <a href="logout" style="color: white; text-decoration: none; padding: 5px 10px; background-color: red;">Logout</a>
</div>


            <div class="row">
                <div class="col-md-10">
                    <h3 class="panel-title"></h3>
                </div>
            </div>
        </div>
        <div class="row" >
            <div class="col-sm-12 col-md-12">
                <div class="block-flat">
                    <div class="content">
                        <div class="table-responsive">
                          

<div id="data-container">
    <!-- Fetched data will be displayed here -->
</div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    
   

    <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/dataTables.buttons.min.js"></script>
<script src = "https://cdn.datatables.net/buttons/1.2.1/js/buttons.print.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.html5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.colVis.min.js"></script>





<script src="include/js/bootstrap.min.js"></script>
<script src="include/js/modernizr.min.js"></script>
<script src="include/js/toggles.min.js"></script>
<script src="include/js/custom.js"></script>
<script>
$(document).ready(function() {  
   
    
    $('#inward_script').DataTable( {
        dom: 'lBfrtip',
        "aLengthMenu": [[25, 50, 75, -1], [25, 50, 75, "All"]],
        buttons: [
            { extend: 'copy', className: 'copyButton' },
            { extend: 'excel', className: 'excelButton',filename:'Users list' },
            { extend: 'csv', className: 'excelButton',filename:'Users list' },
            { extend: 'pdf', className: 'excelButton',filename:'Users list' }
        ]
    } );
} );
</script>
<script>
$(document).ready(function(){
    // Send AJAX request to fetch data
    $.ajax({
        url: 'fetch_data.php', // PHP script that fetches data
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Handle successful response
            // Display fetched data
            var html = '<thead class="no-border">';
            html += '<tr>';
            html += '<th><strong>Sl.No</strong></th>';    
            html += '<th><strong>Name</strong></th>';
            html += '<th><strong>Role</strong></th>';
            html += '<th><strong>Mobile</strong></th>';
            html += '<th><strong>Email</strong></th>';                                            
            html += '<th><strong>Address</strong></th>';
            html += '<th><strong>Gender</strong></th>';                                        
            html += '<th>Date Of Birth</th>';
            html += '<th>Action</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody class="no-border-y">';
            $.each(data, function(index, item) {
                html += '<tr>';
                html += '<td>' + (index + 1) + '</td>'; // Increment the index for Sl.No
                html += '<td>' + item.mrvi_name + '</td>';
                html += '<td>' + item.mrvi_role + '</td>';
                html += '<td>' + item.mrvi_mobile + '</td>';
                html += '<td>' + item.mrvi_email + '</td>';
                html += '<td>' + item.mrvi_address + '</td>';
                html += '<td>' + item.mrvi_gender + '</td>';
                html += '<td>' + item.mrvi_date_of_birth + '</td>';
                html += '<td>';
                html += '<a href="edit_user.php?editid=' + item.user_info_id + '" class="btn btn-primary">Edit</a>'; // Edit button
                html += '<a href="dashboard.php?delid=' + item.user_info_id + '" class="btn btn-primary" title="Delete" data-toggle="tooltip" onclick="return confirm(\'Do you really want to Delete ?\');">Delete</a>';
                html += '</td>';
                html += '</tr>';
            });
            html += '</tbody>';
            $('#data-container').html(html);
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error(xhr.responseText);
        }
    });
});
</script>
</body>
</html>