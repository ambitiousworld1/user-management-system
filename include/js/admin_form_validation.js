// JavaScript Document
var a = new Array();/*key and value of input fields of array*/
/*
	condition failed of inputbox 
	a[inputid]=1 else  a[om[inputid]=0;
*/
function regular_experssion(validation,inputid,inputval,minl,maxl){	
	 a[inputid] = 0;	
		$('span.'+inputid).html('');
		var pattern = new RegExp(validation_list[validation]);
	if(inputval.length<minl){
				a[inputid] = 1;
					$('span.'+inputid).html('Minimum Characters '+minl);				
		}else if(inputval.length>maxl){
					a[inputid] = 1;
					$('span.'+inputid).html('Maximum Characters '+maxl);		
		}else if(!pattern.test(inputval)){	
				a[inputid] = 1;
					$('span.'+inputid).html(msg[validation+'_msg']);					
		}

}
function compare(textboxid,beforetextboxid){
	if(a[textboxid]!= 1){
		a[textboxid]=0;
	$('div #div_'+textboxid).html('');
	var scored = $('#'+textboxid).val();
	var max_value = $('#'+beforetextboxid).val();
		if(Number(scored)>Number(max_value)){	
			a[textboxid]=1;
			$('div #div_'+textboxid).append('<span class="text-danger">Not greater than '+$('#'+beforetextboxid).val()+'</span>');	
			}			
	}
}
/*var avoid_duplicates = {};
function duplicates(inputid,inputval){
	if(inputval!=false){
			alert(avoid_duplicates.inputval)
			if(!( inputid in avoid_duplicates)){
				if($.inArray( inputval, avoid_duplicates )!=-1){
						$('input[id='+inputid+']').val('');
							$('div #div_'+inputid).append('<span class="text-danger">"'+inputval+'", its duplicate value</span>');	
					}else{				
						avoid_duplicates[inputid]=inputval;
					}
			}
				alert(avoid_duplicates);
		}
	}*/
$(function(){
$('form[id="form_registeration"]').submit(function() {	
												  // alert('');
	  $('#add_button').attr('disabled','disabled');												   
    // get all the inputs into an array.
		var $inputs = $('#form_registeration :input');
		var i=0;	
		//$('span.error').html('');
		//$('span.text-danger').html('');
		// not sure if you wanted this, but I thought I'd add it.
		// get an associative array of just the values.
		var values = {};
		$inputs.each(function() {		
				var inputId = this.id;
				 if(a[inputId]==1){/*If not empty of input box means thats already validated */							
					//alert(a[inputId]);
							i=1;
					}else if(this.id!=''){
					if($(this).val()==false){/*If empty of input box */							
						//alert(inputId)
					$('span.'+inputId).html('Required field');
					//alert($('div #'+inputId).html())
						i=1;						
					}
					
			}
			
		});
	//alert(i);
		if(i==1){
			$('#add_button').removeAttr('disabled');
			return false;
		}
		else
			'';	
	});
$('form[id="update_form"]').submit(function() {	
							//$('.text-danger').html('');
	//$('#profile_edit_submit').disable(true);	 
		var $inputs = $('#update_form :input');
		i=0;				
		$inputs.each(function() {		
				var inputId = this.id;					
				//alert($(this).val())				
					if($(this).val()==false ){/*If empty of input box */													
						$('.err_'+inputId).html("Required field");												
						i=1;						
						//alert(i);
					}else if(a[inputId]==1){/*If not empty of input box means thats already validated */							
						i=1;
					}else $('.err_'+inputId).html('');
						
		});	
		
		if(i==1){
			//$('#profile_edit_submit').disable(false);
			return false;
		}
		else
			'';	
	
	});
$('form[id="uploadForm"]').submit(function() {		
		$('#upload_button').attr('disabled','disabled');									   
		$('span.uploadfile').html('');		
	if($('input[id="uploadfile"]').val()==false){
		$('upload_button').removeAttr('disabled');
		$('span.uploadfile').html('This field Required');
		return false;
	}
	var ext = $('input[id="uploadfile"]').val().split('.').pop().toLowerCase();
	//alert(ext);return false;
	if(ext != 'csv') {
		$('upload_button').removeAttr('disabled');
		$('span.uploadfile').html('This flie type not accepted'); 
		return false;//alert('invalid extension!');
	}
	
	});

});
