(function($) {
  function Annotate(el, options) {
    this.options = options;
    this.$el = $(el);
    this.clicked = false;
    this.fromx = null;
    this.fromy = null;
    this.fromxText = null;
    this.fromyText = null;
    this.tox = null;
    this.toy = null;
    this.points = [];
    this.storedUndo = [];
    this.storedElement = [];
    this.images = [];
    this.img = null;
    this.selectedImage = null;
    this.currentWidth = null;
    this.currentHeight = null;
    this.selectImageSize = {};
    this.compensationWidthRate = 1;
    this.linewidth = 1;
    this.fontsize = 1;
    this.init();
  }
  Annotate.prototype = {
    init: function() {
      var self = this;
      self.linewidth = self.options.linewidth;
      self.fontsize = self.options.fontsize;
      self.$el.addClass('annotate-container');
      self.$el.css({
        cursor: 'pointer'
      });
      self.baseLayerId = 'baseLayer_' + self.$el.attr('id');
      self.drawingLayerId = 'drawingLayer_' + self.$el.attr('id');
      self.toolOptionId = 'tool_option_' + self.$el.attr('id');
      self.$el.append($('<canvas class="zoom_concept"  id="' + self.baseLayerId + '"></canvas>'));
      self.$el.append($('<canvas class="zoom_concept" id="' + self.drawingLayerId +
        '"></canvas>'));
      self.baseCanvas = document.getElementById(self.baseLayerId);
      self.drawingCanvas = document.getElementById(self.drawingLayerId);
      self.baseContext = self.baseCanvas.getContext('2d');
      self.drawingContext = self.drawingCanvas.getContext('2d');
      self.baseContext.lineJoin = 'round';
      self.drawingContext.lineJoin = 'round';
      var classPosition1 = 'btn-group';
      var classPosition2 = '';
      if (self.options.position === 'left' || self.options.position ===
        'right') {
        classPosition1 = 'btn-group-vertical';
        classPosition2 = 'btn-block';
      }
      if (self.options.bootstrap) {
        self.$tool = '<div id="" class="btn-group" role="group" >' +
          '<div class="' + classPosition1 + '" data-toggle="buttons">' +
          '<button id="undoaction'+self.$el.attr('id')+'" title="Undo the last annotation"' +
          ' class="btn btn-primary ' + classPosition2 +
          ' annotate-undo">' +
          ' <i class="glyphicon glyphicon-trash"></i></button>';
        if (self.options.unselectTool) {
          self.$tool += '<label class="btn btn-danger active">' +
            '<input type="radio" name="' + self.toolOptionId +
            '" data-tool="null"' +
            ' data-toggle="tooltip" data-placement="top"' +
            ' title="No tool selected">' +
            '<i class="fa fa-check"></i>' +
            '</label>';
        }
        self.$tool += '<label class="btn btn-primary active">' +
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="rectangle"' +
          ' data-toggle="tooltip" data-placement="top"' +
          ' title="Draw an rectangle">' +
          ' <i class="fa fa-check"></i>' +
          '</label><label class="btn btn-primary">' +
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="circle"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="Write some text">' +
          ' <i class="fa fa-times"></i>' +
          '</label>' +  
          '<label class="btn btn-primary">' +
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="arrow"' +
          ' data-toggle="tooltip" data-placement="top" title="Draw an arrow">' +          
          ' <span class="glyphicon glyphicon-pencil"></span></label>' +  
 '<label class="btn btn-primary">' + 
  '<label class="btn btn-primary">' +
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="arrow1"' +
          ' data-toggle="tooltip" data-placement="top" title="Draw an arrow">' +          
          ' <span class="glyphicon glyphicon-pencil"></span></label>' +  
 '<label class="btn btn-primary">' + 
   '<label class="btn btn-primary">' +
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="arrow2"' +
          ' data-toggle="tooltip" data-placement="top" title="Draw an arrow">' +          
          ' <span class="glyphicon glyphicon-pencil"></span></label>' +  
 '<label class="btn btn-primary">' + 
   '<label class="btn btn-primary">' +
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="text_ver"' +
          ' data-toggle="tooltip" data-placement="top" title="Draw an text">' +          
          ' <span class="glyphicon glyphicon-pencil"></span></label>' +  
		  '<label class="btn btn-primary">' + 
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="pen"' +
          ' data-toggle="tooltip" data-placement="top" title="Pen Tool">' +
          ' <span class="glyphicon glyphicon-pencil"></span></label>' +  
 '<label class="btn btn-primary">' +
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="none_select"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="Write some text">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' +
		  
		  
		  '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="text"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="text">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' + 
		  
		  
'<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="zero_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="zero Marks">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' +  
 '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="half_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="half Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' +  
 '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="one_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="one Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' +  
   '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="two_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="two Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' + 
     '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="three_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="three Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' + 
       '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="four_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="four Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' + 
 '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="five_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="five Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' +
 '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="six_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="six Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' + 
 '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="seven_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="seven Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' + 
   '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="eight_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="eight Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' + 
   '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="nine_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="nine Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' + 
     '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="ten_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="ten Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' +		  
		   '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="eleven_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="elven Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' +		  
		   '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="twelve_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="twelve Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' +		  
		   '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="thirteen_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="thirteen Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' +		  
		   '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="fourteen_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="fourteen Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' +		  
		   '<label class="btn btn-primary">' +  
          '<input type="radio" name="' + self.toolOptionId +
          '" data-tool="fifteen_number"' +
          ' data-toggle="tooltip"' +
          'data-placement="top" title="fifteen Mark">' +
          ' <span class="glyphicon glyphicon-font"></span></label>' + 
          '</div></div>';
      }
      self.$tool = $(self.$tool);
      $('#'+self.$el.attr('id')+'.annotate-container').append(self.$tool);
      var canvasPosition = self.$el.offset();
      if (self.options.position === 'top' || self.options.position !==
        'top' && !self.options.bootstrap) {
        self.$tool.css({
          position: 'absolute',
          top: -35,          
 left: 0
        });
      }

  self.$textbox = $('<textarea id=""' +
        ' style="position:absolute;z-index:100000;display:none;top:0;left:0;' +
        'background:transparent;border:1px dotted; line-height:25px;' +
        ';font-size:' + self.fontsize +
        ';font-family:sans-serif;color:' + self.options.color +
        ';outline-width: 0;width:250px;overflow: hidden;' +
        'padding:0px"></textarea>');
      $('body').append(self.$textbox);
      if (self.options.images) {
        self.initBackgroundImages();
      } else {
        if (!self.options.width && !self.options.height) {
          self.options.width = 640;
          self.options.height = 480;
        }
        self.baseCanvas.width = self.drawingCanvas.width = self.options.width;
        self.baseCanvas.height = self.drawingCanvas.height = self.options
          .height;
      }

      
        self.initBackgroundImages();      
      self.$tool.on('change', 'input[name^="tool_option"]', function() {
        self.selectTool($(this));
      });          
      self.$tool.on('click', '.annotate-undo', function(event) {
        self.undoaction(event);
      });
      $(document).on(self.options.selectEvent, '.annotate-image-select',
        function(event) {
          event.preventDefault();
          var image = self.selectBackgroundImage($(this).attr(self.options
            .idAttribute));
          self.setBackgroundImage(image);
        });
      $('#' + self.drawingLayerId).on('mousedown touchstart', function(
  
        event) {
selectCanvasItem($(this).closest('.myCanvas').attr('id'),self);
self.annotatestart(event);
self.annotatemove(event);
      });
      $('#' + self.drawingLayerId).on('mouseup touchend', function(event) {
        self.annotatestop(event);
      });      
      $('#' + self.drawingLayerId).on('mouseleave touchleave', function(
        event) {        
      });
      $('#' + self.drawingLayerId).on('mousemove touchmove', function(
        event) {
        self.annotatemove(event);
      });    
      self.checkUndoRedo();
    },  

  generateId: function(length) {
      var chars =
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(
          '');
      var charsLen = chars.length;
      if (!length) {
        length = Math.floor(Math.random() * charsLen);
      }
      var str = '';
      for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * charsLen)];
      }
      return str;
    },
    addElements: function(newStoredElements, set, callback)
    {
      var self = this; 
      this.storedElement = newStoredElements; 
      //console.log('DJ: Adding new annotations'); 
      self.clear();
      self.redraw();
      
    }, 	
    pushImage: function(newImage, set, callback) {
      var self = this;
      var id = null;
      var path = null;      
        id = newImage;
        path = newImage;      
      if (id === '' || typeof id === 'undefined' || self.selectBackgroundImage(
          id)) {
        id = self.generateId(10);
        while (self.selectBackgroundImage(id)) {
          id = self.generateId(10);
        }
      }
      var image = {
        id: id,
        path: path,
        storedUndo: [],
        storedElement: []
      };
      self.images.push(image);
      if (set) {
        self.setBackgroundImage(image);
      }    
    },
    initBackgroundImages: function() {
      var self = this;
      $.each(self.options.images, function(index, image) {
        var set = false;
        if (index === 0) {
          set = true;
        }
        self.pushImage(image, set);
      });
    },
    selectBackgroundImage: function(id) {
      var self = this;
      var image = $.grep(self.images, function(element) {
        return element.id === id;
      })[0];
      return image;
    },
    setBackgroundImage: function(image) {
      var self = this;


      if (self.$textbox.is(':visible')) {
        self.pushText();
      }      
      var currentImage = self.selectBackgroundImage(self.selectedImage);
      if (currentImage) {
        currentImage.storedElement = self.storedElement;
        currentImage.storedUndo = self.storedUndo;
      }
      self.img = new Image();
      self.img.src = image.path;
      self.img.onload = function() {
        if ((self.options.width && self.options.height) !== undefined ||
          (self.options.width && self.options.height) !== 0) {
          self.currentWidth = 970;
          self.currentHeight = 1300;
          self.selectImageSize.width = 970;
          self.selectImageSize.height = 1300;
        } else {
          self.currentWidth = self.options.width;
          self.currentHeight = self.options.height;
        }
        self.baseCanvas.width = self.drawingCanvas.width = self.currentWidth;
        self.baseCanvas.height = self.drawingCanvas.height = self.currentHeight;
        self.baseContext.drawImage(self.img, 0, 0, self.currentWidth,
          self.currentHeight);
        self.$el.css({
          height: self.currentHeight,
          width: self.currentWidth
        });
        self.storedElement = image.storedElement;
        self.storedUndo = image.storedUndo;
        self.selectedImage = image.id;
        self.checkUndoRedo();
        self.clear();
        self.redraw();        
      };
    },
    checkUndoRedo: function() {
      var self = this;
      self.$tool.children('.annotate-redo').attr('disabled', self.storedUndo
        .length === 0);
      self.$tool.children('.annotate-undo').attr('disabled', self.storedElement
        .length === 0);
    },
    undoaction: function(event) {
		var self = this;
		  if (self.storedElement.length === 0) {       
      } else{    
     event.preventDefault();      
	   self.storedUndo.push(self.storedElement[self.storedElement.length - 1]);	  
var currentcanvasobject=canvaseventsorder[''+self.baseLayerId.split("_")[1]].pop();
if(currentcanvasobject != undefined)
	currentcanvasobject=currentcanvasobject.split(';;');
else
{	
	currentcanvasobject=['','',''];
}
var object_result=currentcanvasobject[1];
var object_result_ID =currentcanvasobject[2];
if(object_result=='zero_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_zero_val= '0';
var total_value=Number(current_val) - Number(add_zero_val);
if(total_value!=0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}else{
	var final_res=$('#q_marks_'+object_result_ID).val('');
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='half_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_zero_val= '0.5';
var total_value=Number(current_val) - Number(add_zero_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='one_number'){	
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var minus_one_val= '1';
var total_value=Number(current_val) - Number(minus_one_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='two_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_two_val= '2';
var total_value=Number(current_val) - Number(add_two_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='three_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_three_val= '3';
var total_value=Number(current_val) - Number(add_three_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='four_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_four_val= '4';
var total_value=Number(current_val) - Number(add_four_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='five_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_five_val= '5';
var total_value=Number(current_val) - Number(add_five_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='six_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_six_val= '6';
var total_value=Number(current_val) - Number(add_six_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='seven_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_seven_val= '7';
var total_value=Number(current_val) - Number(add_seven_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='eight_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_eight_val= '8';
var total_value=Number(current_val) - Number(add_eight_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='nine_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_nine_val= '9';
var total_value=Number(current_val) - Number(add_nine_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='ten_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_ten_val= '10';
var total_value=Number(current_val) - Number(add_ten_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='eleven_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_eleven_val= '11';
var total_value=Number(current_val) - Number(add_eleven_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='twelve_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_twelve_val= '12';
var total_value=Number(current_val) - Number(add_twelve_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='thirteen_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_thirteen_val= '13';
var total_value=Number(current_val) - Number(add_thirteen_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='fourteen_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_fourteen_val= '14';
var total_value=Number(current_val) - Number(add_fourteen_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
if(object_result=='fifteen_number'){
var question_number= $('#q_marks_'+object_result_ID).val();
var current_val=$('#q_marks_'+object_result_ID).val();
var add_fifteen_val= '15';
var total_value=Number(current_val) - Number(add_fifteen_val);
if(total_value==0){
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
$('#q_marks_'+object_result_ID).val("");
}else{
var final_res=$('#q_marks_'+object_result_ID).val(total_value);
$('#q_marks_'+object_result_ID).click();
}
}
  self.storedElement.pop();
      self.checkUndoRedo();
      self.clear();
      self.redraw();	  
	  }	  
    },
    redraw: function() {
      var self = this;
      self.baseCanvas.width = self.baseCanvas.width;
      if (self.options.images) {
        self.baseContext.drawImage(self.img, 0, 0, self.currentWidth,
          self.currentHeight);
      }
      if (self.storedElement.length === 0) {
        return;
      }      
      for (var i = 0; i < self.storedElement.length; i++) {
        var element = self.storedElement[i];
        switch (element.type) {
          case 'rectangle':
            self.drawRectangle(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
          case 'arrow':
            self.drawArrow(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;			
			case 'arrow1':
            self.drawArrow1(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;			
			case 'arrow2':
            self.drawArrow2(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;			
			case 'text_ver':
            self.draw_text_ver(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;			
			case 'zero_number':
            self.draw_zero_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
			case 'half_number':
            self.draw_half_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
			case 'one_number':
            self.draw_one_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
			case 'two_number':
            self.draw_two_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;			
			case 'three_number':
            self.draw_three_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
			case 'four_number':
            self.draw_four_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
			case 'five_number':
            self.draw_five_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
			case 'six_number':
            self.draw_six_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
			case 'seven_number':
            self.draw_seven_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
			case 'eight_number':
            self.draw_eight_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
			case 'nine_number':
            self.draw_nine_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
			case 'ten_number':
            self.draw_ten_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;			
				case 'eleven_number':
            self.draw_eleven_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;			
				case 'twelve_number':
            self.draw_twelve_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;			
				case 'thirteen_number':
            self.draw_thirteen_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;			
				case 'fourteen_number':
            self.draw_fourteen_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;			
				case 'fifteen_number':
            self.draw_fifteen_number(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
            break;
          case 'pen':
            for (var b = 0; b < element.points.length - 1; b++) {
              var fromx = element.points[b][0];
              var fromy = element.points[b][1];
              var tox = element.points[b + 1][0];
              var toy = element.points[b + 1][1];
              self.drawPen(self.baseContext, fromx, fromy, tox, toy);
            }
            break;
			case 'text':
            self.drawText(self.baseContext, element.text, element.fromx,
              element.fromy, element.maxwidth);
            break;
          case 'circle':
            self.drawCircle(self.baseContext, element.fromx, element.fromy,
              element.tox, element.toy);
 break;          
        }
      }
    },
    clear: function() {
      var self = this;      
      self.drawingCanvas.width = self.drawingCanvas.width;
    },
   drawRectangle: function(context, x, y, w, h) {    
var self = this;
	 context.strokeStyle = self.options.color;
	 context.beginPath();    
	 context.moveTo(x - 30, y - 0);
     context.lineTo(x + 1, y + 40);     
     context.moveTo(x + 60, y - 24);
     context.lineTo(x + 0, y + 40);
	 context.fillStyle = 'green';
     context.fill();
	 context.lineWidth = 4;
     context.strokeStyle = '#008000';	
     context.stroke(); 	 
    },
drawCircle: function(context, x, y, w, h) {
  var self = this;	 	 
	   context.beginPath();    
    context.moveTo(x - 20, y - 20);
    context.lineTo(x + 20, y + 20);  
    context.moveTo(x + 20, y - 20);
    context.lineTo(x - 20, y + 20);
	 context.fillStyle = '#FF0000';
     context.fill();
     context.lineWidth = 4;
     context.strokeStyle = '#FF0000';	
    context.stroke(); 
    },
  drawArrow: function(context, x, y, w, h) {
    var self = this;	 
      context.beginPath();
      context.lineWidth = self.linewidth;
      context.lineTo(w, h);
	  context.moveTo(x + 400, y - 0);// Arrow 
	context.lineTo(x - 0, y + 0);// Arrow 
      context.moveTo(x - 0 * 5 * Math.cos( Math.PI /
        1), y - 0 * 5 * Math.sin( Math.PI / 1));     
      context.lineTo(x - 0 * 5 * Math.cos(Math.PI /
        1), y - 0 * 5 * Math.sin( Math.PI / 1));
      context.strokeStyle = self.options.color;
      context.stroke();	 
    },	
	drawArrow1: function(context, x, y, w, h) {
    var self = this;	 
      context.beginPath();
      context.lineWidth = self.linewidth;
      context.lineTo(w, h);	  
	  context.moveTo(x + 0, y - 0);// Arrow 1
	  context.lineTo(x - 400, y - 400);// Arrow 1
      context.moveTo(x - 0 * 5 * Math.cos( Math.PI /
        1), y - 0 * 5 * Math.sin( Math.PI / 1));     
      context.lineTo(x - 0 * 5 * Math.cos(Math.PI /
        1), y - 0 * 5 * Math.sin( Math.PI / 1));
      context.strokeStyle = self.options.color;
      context.stroke(); 
    },	
	drawArrow2: function(context, x, y, w, h) {
    var self = this;	 
      context.beginPath();
      context.lineWidth = self.linewidth;
      context.lineTo(w, h);	  
	  context.moveTo(x + 400, y - 350); // Arrow 2
     context.lineTo(x - 0, y + 0);// Arrow 2
      context.moveTo(x - 0 * 5 * Math.cos( Math.PI /
        1), y - 0 * 5 * Math.sin( Math.PI / 1));     
      context.lineTo(x - 0 * 5 * Math.cos(Math.PI /
        1), y - 0 * 5 * Math.sin( Math.PI / 1));
      context.strokeStyle = self.options.color;
      context.stroke();	 
    },	
	draw_text_ver: function(context, x, y, w, h) {	
      var self = this;	      
	  context.beginPath();
      context.lineWidth = self.linewidth;
      context.moveTo(x, y);
      context.lineTo(w, h);
      context.fillStyle = "transparent";
      context.fillRect(0,0, 200, 200);
      context.fillStyle = "red";
      context.font = "20pt sans-serif";
      context.fillText("Blank Page", 450, 90);	   
    },
draw_zero_number: function(context, x, y, w, h) {
	     var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("0  Q"+w, x-12, y-12);
          context.strokeStyle = "red";
		  context.beginPath();   
		  context.moveTo(x - 6, y - 6);
          context.lineTo(x + 6, y + 6);  
          context.moveTo(x + 6, y - 6);
          context.lineTo(x - 6, y + 6);
          context.fillStyle = '#FF0000';
		  context.fill();
		  context.lineWidth = 3;
		  context.strokeStyle = '#FF0000';	//right mark color
		  context.stroke();
    },
 draw_half_number: function(context, x, y, w, h) {	 
        var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("0.5  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
          context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left    
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();   
    },
draw_one_number: function(context, x, y, w, h) {
	     var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("1  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();  
    },
draw_two_number: function(context, x, y, w, h) {
	     var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("2  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();       
    },
draw_three_number: function(context, x, y, w, h) { 
	     var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("3  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();     	      	   
    },
	draw_four_number: function(context, x, y, w, h) {	
          var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("4  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();     	   
    },
		draw_five_number: function(context, x, y, w, h) { 
	     var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("5  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();     	   
    },	
		 draw_six_number: function(context, x, y, w, h) { 
	     var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("6  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();       	   
    },	
		draw_seven_number: function(context, x, y, w, h) { 
	     var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("7  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();     	   
    },	
			draw_eight_number: function(context, x, y, w, h) { 
         var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("8  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();       	   
    },	
	draw_nine_number: function(context, x, y, w, h) { 
  var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("9  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();        	   
    },
	draw_ten_number: function(context, x, y, w, h) { 
 var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("10  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();       	   
    },	
	draw_eleven_number: function(context, x, y, w, h) { 
 var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("11  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();       	   
    },	
	draw_twelve_number: function(context, x, y, w, h) { 
 var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("12  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();       	   
    },	
	draw_thirteen_number: function(context, x, y, w, h) { 
 var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("13  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();       	   
    },	
	draw_fourteen_number: function(context, x, y, w, h) { 
 var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("14  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();       	   
    },	
	draw_fifteen_number: function(context, x, y, w, h) { 
 var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("15  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();       	   
    },	
	draw_ten_number: function(context, x, y, w, h) { 
 var self = this;
          context.beginPath();
          context.fillStyle = "LightGray";
          context.strokeStyle = "green";
          context.font = "40px arial";
          context.lineWidth = self.linewidth;
          context.arc(x, y, 40, 0, 2 * Math.PI, false);
		  context.fillStyle = "rgba(255, 255, 0, 0.2)";
          context.fill();		  
          context.beginPath();
          context.fillStyle = "red";//Font color
		  context.fillText("10  Q"+w, x-7, y);
          context.strokeStyle = "red";
		  context.beginPath();    
		  context.moveTo(x - 8, y + 5);//left
		  context.lineTo(x + 2, y + 15);//left     
		  context.moveTo(x + 24, y - 10);//right
		  context.lineTo(x + 2, y + 16);//right
		  context.fillStyle = 'green';//right mark color
		  context.fill();
		  context.lineWidth = 4;
		  context.strokeStyle = '#008000';	//right mark color
		  context.stroke();       	   
    },
    drawPen: function(context, fromx, fromy, tox, toy) {
      var self = this;
 context.beginPath();
      context.lineWidth = self.linewidth;
      context.moveTo(fromx, fromy);
      context.lineTo(tox, toy);
      context.strokeStyle = self.options.color;
      context.stroke();
    },  
	
	 wrapText: function(drawingContext, text, x, y, maxWidth, lineHeight) {
      var lines = text.split('\n');
      for (var i = 0; i < lines.length; i++) {
        var words = lines[i].split(' ');
        var line = '';
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = drawingContext.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            drawingContext.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        drawingContext.fillText(line, x, y + i * lineHeight);
      }
    },
    drawText: function(context, text, x, y, maxWidth) {
		//debugger;
      var self = this;
      context.font = self.fontsize + ' sans-serif';
      context.textBaseline = 'top';
      context.fillStyle = self.options.color;
      self.wrapText(context, text, x + 3, y + 4, maxWidth, 25);
    },
    pushText: function() {
      var self = this;
      var text = self.$textbox.val();
      self.$textbox.val('').hide();
      if (text) {
        self.storedElement.push({
          type: 'text',
          text: text,
          fromx: self.fromx,
          fromy: self.fromy,
          maxwidth: self.tox
        });
        if (self.storedUndo.length > 0) {
          self.storedUndo = [];
        }
      }
      self.checkUndoRedo();
      self.redraw();
    },
	
	
	
	

    
    selectTool: function(element) {
      var self = this;
      self.options.type = element.data('tool');    
    },
        annotatestart: function(event) {
      var self = this;
      self.clicked = true;
      var offset = self.$el.offset();
      if (self.$textbox.is(':visible')) {
        var text = self.$textbox.val();
        self.$textbox.val('').hide();
        if (text !== '') {
          if (!self.tox) {
            self.tox = 100;
          }
          self.storedElement.push({
            type: 'text',
            text: text,
            fromx: (self.fromxText - offset.left) * self.compensationWidthRate,
            fromy: (self.fromyText - offset.top) * self.compensationWidthRate,
            maxwidth: self.tox
          });
          if (self.storedUndo.length > 0) {
            self.storedUndo = [];
          }
        }
        self.checkUndoRedo();
        self.redraw();
        self.clear();
      }
      self.tox = null;
      self.toy = null;
      self.points = [];
      var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      self.fromx = (pageX - offset.left) * self.compensationWidthRate;
      self.fromy = (pageY - offset.top) * self.compensationWidthRate;
      self.fromxText = pageX;
      self.fromyText = pageY;
      if (self.options.type === 'text') {
        self.$textbox.css({
          left: self.fromxText + 2,
          top: self.fromyText,
          width: 0,
          height: 0
        }).show();
      }
      if (self.options.type === 'pen') {
        self.points.push([
          self.fromx,
          self.fromy
        ]);
      }
    },
    annotatestop: function() {
      var self = this;
      self.clicked = false;
      if (self.toy !== null && self.tox !== null) {
        switch (self.options.type) {
          case 'rectangle':
            break;
          case 'circle':
            break;
          case 'arrow':     
            break;			
			 case 'arrow1':     
            break;
			 case 'arrow2':     
            break;			
			          case 'text_ver':     
            break;			
     case 'zero_number':
            break;
          case 'half_number':
            break;
          case 'one_number':
  break;
          case 'two_number':		  
		   break;
			case 'three_number':      
            break;
			case 'four_number':           
            break;
			case 'five_number':         
            break;
			case 'six_number':           
            break;
			case 'seven_number':           
            break;
			case 'eight_number':           
            break;
			case 'nine_number':            
            break;
			case 'ten_number':            
            break;			
				case 'eleven_number':            
            break;
	case 'twelve_number':            
            break;
case 'thirteen_number':            
            break;
	case 'fourteen_number':            
            break;
	case 'fifteen_number':            
            break;
			
			case 'text': 

          			
            break;	
          case 'pen':
            self.storedElement.push({
              type: 'pen',
              points: self.points
            });
            for (var i = 0; i < self.points.length - 1; i++) {
              self.fromx = self.points[i][0];
              self.fromy = self.points[i][1];
              self.tox = self.points[i + 1][0];
              self.toy = self.points[i + 1][1];
              self.drawPen(self.baseContext, self.fromx, self.fromy, self
                .tox,
                self.toy);
            }
            self.points = [];
            break;
          default:
        }
       if (self.storedUndo.length > 0) {
          self.storedUndo = [];
        }
        self.checkUndoRedo();
        self.redraw();
      } else if (self.options.type === 'text') {
        self.$textbox.css({
          left: self.fromxText + 2,
          top: self.fromyText,
          width: 100,
          height: 50
        });
      }
    },
    annotatemove: function(event) {
      var self = this;
      if (self.options.type) {
        event.preventDefault();
      }
      if (!self.clicked) {
        return;
      }
      var offset = self.$el.offset();
      var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      
      switch (self.options.type) {
        case 'rectangle':         
          break;
        case 'arrow':
          break;		  
		  case 'arrow1':
          break;		  
		   case 'arrow2':     
            break;
			    case 'text_ver':	          
          break; 
case 'zero_number':      
          break; 
 case 'half_number':    
          break;
 case 'one_number':  
  break; 
			case 'two_number':      
            break; 
			case 'three_number':      
            break;
			case 'four_number':           
            break;
			case 'five_number':         
            break;
			case 'six_number':           
            break;
			case 'seven_number':           
            break;
			case 'eight_number':           
            break;
			case 'nine_number':            
            break;
			case 'ten_number':            
            break;
	        case 'eleven_number':            
            break;
	        case 'twelve_number':            
            break;
            case 'thirteen_number':            
            break;
	        case 'fourteen_number':            
            break;
	        case 'fifteen_number':            
            break;
			case 'text': 

			
            break;
			
            case 'pen':
          self.tox = (pageX - offset.left) * self.compensationWidthRate;
          self.toy = (pageY - offset.top) * self.compensationWidthRate;
          self.fromx = self.points[self.points.length - 1][0];
          self.fromy = self.points[self.points.length - 1][1];
          self.points.push([
            self.tox,
            self.toy
          ]);
          self.drawPen(self.drawingContext, self.fromx, self.fromy, self.tox,
            self.toy);
          break;        
        case 'circle': 
          break;    
      }
    },     
  };  
  $.fn.annotate = function(options, cmdOption, callback) {  
    var $annotate = $(this).data('annotate');    
      var opts = $.extend({}, $.fn.annotate.defaults, options);
      var annotate = new Annotate($(this), opts);
      $(this).data('annotate', annotate);    
  };  
  $.fn.annotate.defaults = {    
    linewidth: 3,
    fontsize: '20px',
    bootstrap: false,
    position: 'top'  
  };  
})(jQuery);
var currentSelectedEvent;
function canvasClickEvents(type){
currentSelectedEvent=type;
}
 var LastId = ""; 
 var canvasidarray=[];

 var canvaseventsorder=[];
function selectCanvasItem(currentcanvasid,obj){
	 debugger;
if(currentSelectedEvent == 'undoaction'){	
	if(canvasObjects[currentcanvasid].length ==1){		
				$('#undoaction'+currentcanvasid).click();
				$('#'+currentcanvasid+' input[data-tool=none_select]').change();				
				$('.'+currentcanvasid).addClass("btn-danger");
				canvasidarray = jQuery.grep(canvasidarray, function(value) {
return value != currentcanvasid;
});
		$('.'+currentcanvasid).removeClass("error");
		//setTimeout(function() {   //calls click event after a certain time
  //fun100();
//}, 500);
return 'undoaction';
		}else{
				$('#undoaction'+currentcanvasid).click();
				$('#'+currentcanvasid+' input[data-tool=none_select]').change();		
		}
}else if(currentSelectedEvent == 'rectangle'){
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
var offset=obj.$el.offset();
				var pageX = event.pageX || event.originalEvent.touches[0].pageX;
				var pageY = event.pageY || event.originalEvent.touches[0].pageY;
				obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
				obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;		
				obj.drawRectangle(obj.drawingContext, obj.fromx, obj.fromy,
            obj.tox,
            obj.toy);
				obj.storedElement.push({
              type: 'rectangle',
              fromx: obj.fromx,
              fromy: obj.fromy,
              tox: obj.tox,
              toy: obj.toy
            });
				$('#'+currentcanvasid+' input[data-tool=rectangle]').change();
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}	
	canvasidarray[canvasidarray.length]=currentcanvasid;
}else if(currentSelectedEvent == 'circle'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");	
		var offset=obj.$el.offset();
				var pageX = event.pageX || event.originalEvent.touches[0].pageX;
				var pageY = event.pageY || event.originalEvent.touches[0].pageY;
				obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
				obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;			
				obj.drawCircle(obj.drawingContext, obj.fromx, obj.fromy,
            obj.tox,
            obj.toy);
				obj.storedElement.push({
              type: 'circle',
              fromx: obj.fromx,
              fromy: obj.fromy,
              tox: obj.tox,
              toy: obj.toy
            });
				$('#'+currentcanvasid+' input[data-tool=circle]').change();
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}	
	canvasidarray[canvasidarray.length]=currentcanvasid;
}else if(currentSelectedEvent == 'arrow'){
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
var offset=obj.$el.offset();
				var pageX = event.pageX || event.originalEvent.touches[0].pageX;
				var pageY = event.pageY || event.originalEvent.touches[0].pageY;
				obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
				obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;		
				obj.drawArrow(obj.drawingContext, obj.fromx, obj.fromy,
            obj.tox,
            obj.toy);
				obj.storedElement.push({
              type: 'arrow',
              fromx: obj.fromx,
              fromy: obj.fromy,
              tox: obj.tox,
              toy: obj.toy
            });
				$('#'+currentcanvasid+' input[data-tool=arrow]').change();
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}	
	canvasidarray[canvasidarray.length]=currentcanvasid;
}else if(currentSelectedEvent == 'arrow1'){
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
var offset=obj.$el.offset();
				var pageX = event.pageX || event.originalEvent.touches[0].pageX;
				var pageY = event.pageY || event.originalEvent.touches[0].pageY;
				obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
				obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;		
				obj.drawArrow1(obj.drawingContext, obj.fromx, obj.fromy,
            obj.tox,
            obj.toy);
				obj.storedElement.push({
              type: 'arrow1',
              fromx: obj.fromx,
              fromy: obj.fromy,
              tox: obj.tox,
              toy: obj.toy
            });
				$('#'+currentcanvasid+' input[data-tool=arrow1]').change();
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}	
	canvasidarray[canvasidarray.length]=currentcanvasid;
}else if(currentSelectedEvent == 'arrow2'){
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
var offset=obj.$el.offset();
				var pageX = event.pageX || event.originalEvent.touches[0].pageX;
				var pageY = event.pageY || event.originalEvent.touches[0].pageY;
				obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
				obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;		
				obj.drawArrow2(obj.drawingContext, obj.fromx, obj.fromy,
            obj.tox,
            obj.toy);
				obj.storedElement.push({
              type: 'arrow2',
              fromx: obj.fromx,
              fromy: obj.fromy,
              tox: obj.tox,
              toy: obj.toy
            });
				$('#'+currentcanvasid+' input[data-tool=arrow2]').change();
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}	
	canvasidarray[canvasidarray.length]=currentcanvasid;

}else if(currentSelectedEvent == 'pen'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
$('#'+currentcanvasid+' input[data-tool=pen]').change();
canvasidarray[canvasidarray.length]=currentcanvasid;
}else if(currentSelectedEvent == 'none_select'){
$('#'+currentcanvasid+' input[data-tool=none_select]').change();
}else if(currentSelectedEvent == 'text_ver'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");	
	var offset=obj.$el.offset();
				var pageX = event.pageX || event.originalEvent.touches[0].pageX;
				var pageY = event.pageY || event.originalEvent.touches[0].pageY;
				obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
				obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;		
				obj.draw_text_ver(obj.drawingContext, obj.fromx, obj.fromy,
            obj.tox,
            obj.toy);
				obj.storedElement.push({
              type: 'text_ver',
              fromx: obj.fromx,
              fromy: obj.fromy,
              tox: obj.tox,
              toy: obj.toy
            });
				$('#'+currentcanvasid+' input[data-tool=text_ver]').change();
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());			
			}
	canvasidarray[canvasidarray.length]=currentcanvasid;
	}
else if(currentSelectedEvent == 'zero_number'){
			var question_number= $('.directMarkingQuestionNumber').val();
			var na_res=$('#q_marks_'+question_number).val();
			if(na_res=='' || na_res=='NA'){
			if(na_res=='NA'){
				$('#q_marks_'+question_number).val('');
			}	
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '0';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
				alert("It is exceeding the max marks of the question.please check.");
			}else{				
				var offset=obj.$el.offset();
				var pageX = event.pageX || event.originalEvent.touches[0].pageX;
				var pageY = event.pageY || event.originalEvent.touches[0].pageY;
				obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
				obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
				obj.draw_zero_number(obj.drawingContext, obj.fromx, obj.fromy,
            obj.tox,
            obj.toy);
				obj.storedElement.push({
              type: 'zero_number',
              fromx: obj.fromx,
              fromy: obj.fromy,
              tox: obj.tox,
              toy: obj.toy
            });
				$('#'+currentcanvasid+' input[data-tool=zero_number]').change();
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}			
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;			
			if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");			
			}
			}else{
				alert("already annatation is available remove previous annotations");
			}
}else if(currentSelectedEvent == 'half_number'){

if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();			
			var na_res=$('#q_marks_'+question_number).val();			
			if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}			
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '0.5';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
				alert("It is exceeding the max marks of the question.please check.");
			}else{				
				var offset=obj.$el.offset();
				var pageX = event.pageX || event.originalEvent.touches[0].pageX;
				var pageY = event.pageY || event.originalEvent.touches[0].pageY;
				obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
				obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
				obj.draw_half_number(obj.drawingContext, obj.fromx, obj.fromy,
            obj.tox,
            obj.toy);
				obj.storedElement.push({
              type: 'half_number',
              fromx: obj.fromx,
              fromy: obj.fromy,
              tox: obj.tox,
              toy: obj.toy
            });
				$('#'+currentcanvasid+' input[data-tool=half_number]').change();
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}
			}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'one_number'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();			
			var na_res=$('#q_marks_'+question_number).val();
			if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}			
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '1';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
				alert("It is exceeding the max marks of the question.please check.");
			}else{				
				var offset=obj.$el.offset();
				var pageX = event.pageX || event.originalEvent.touches[0].pageX;
				var pageY = event.pageY || event.originalEvent.touches[0].pageY;
				obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
				obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
				obj.draw_one_number(obj.drawingContext, obj.fromx, obj.fromy,
            obj.tox,
            obj.toy);
				obj.storedElement.push({
              type: 'one_number',
              fromx: obj.fromx,
              fromy: obj.fromy,
              tox: obj.tox,
              toy: obj.toy
            });
				$('#'+currentcanvasid+' input[data-tool=one_number]').change();
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}
			}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'two_number'){

if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();			
			var na_res=$('#q_marks_'+question_number).val();
			if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '2';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{				
				var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;				
				obj.tox=question_number;
			obj.draw_two_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);
			
			obj.storedElement.push({
				type: 'two_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=two_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}
}else{
				alert("please remove previous annotations");
			}

}else if(currentSelectedEvent == 'three_number'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();			
			var na_res=$('#q_marks_'+question_number).val();
			if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}	
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '3';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{				
var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;				
				obj.tox=question_number;
			obj.draw_three_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'three_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=three_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}
}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'four_number'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
			var na_res=$('#q_marks_'+question_number).val();
			if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '4';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{
				var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_four_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'four_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=four_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}
}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'five_number'){
	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
			var na_res=$('#q_marks_'+question_number).val();
			if(na_res!='0'){
			if(na_res=='NA'){
				$('#q_marks_'+question_number).val('');
			}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '5';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{
				var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_five_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);
			
			obj.storedElement.push({
				type: 'five_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=five_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}
}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'six_number'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
			var na_res=$('#q_marks_'+question_number).val();
			if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '6';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{				
var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_six_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'six_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=six_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}
}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'seven_number'){
	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
			var na_res=$('#q_marks_'+question_number).val();
			if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '7';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{				
var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_seven_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'seven_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=seven_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}
}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'eight_number'){
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
			var na_res=$('#q_marks_'+question_number).val();
			if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '8';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{				
var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_eight_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'eight_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=eight_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}
}else{
				alert("please remove previous annotations");
			}

}else if(currentSelectedEvent == 'nine_number'){
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
			var na_res=$('#q_marks_'+question_number).val();
			if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '9';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{
				var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_nine_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);
			
			obj.storedElement.push({
				type: 'nine_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=nine_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}
}else{
				alert("please remove previous annotations");
			}

}else if(currentSelectedEvent == 'ten_number'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
    var na_res=$('#q_marks_'+question_number).val();
	if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '10';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{
				var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_ten_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'ten_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=ten_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}			
			}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'eleven_number'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
    var na_res=$('#q_marks_'+question_number).val();
	if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '11';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{
				var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_eleven_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'eleven_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=eleven_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}			
			}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'twelve_number'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
    var na_res=$('#q_marks_'+question_number).val();
	if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '12';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{
				var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_twelve_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'twelve_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=twelve_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}			
			}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'thirteen_number'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
    var na_res=$('#q_marks_'+question_number).val();
	if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '13';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{
				var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_thirteen_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'thirteen_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=thirteen_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}			
			}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'fourteen_number'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
    var na_res=$('#q_marks_'+question_number).val();
	if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '14';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{
				var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_fourteen_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'fourteen_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=fourteen_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}			
			}else{
				alert("please remove previous annotations");
			}
}else if(currentSelectedEvent == 'fifteen_number'){	
if(LastId != '' ){
$('.'+currentcanvasid).removeClass("btn-danger");
}
LastId = currentcanvasid;
$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");
			var question_number= $('.directMarkingQuestionNumber').val();
    var na_res=$('#q_marks_'+question_number).val();
	if(na_res!='0'){
	if(na_res=='NA'){
		$('#q_marks_'+question_number).val('');
	}
			var current_val=$('#q_marks_'+question_number).val();
			var add_zero_val= '15';
			var total_value=Number(current_val) + Number(add_zero_val);
			var max_marks= $('#max_'+question_number).val();
			if(total_value > max_marks){
			alert("It is exceeding the max marks of the question.please check.");
			}else{
				var offset=obj.$el.offset();
var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      obj.fromx = (pageX - offset.left) * obj.compensationWidthRate;
      obj.fromy = (pageY - offset.top) * obj.compensationWidthRate;
				obj.tox=question_number;
			obj.draw_fifteen_number(obj.drawingContext, obj.fromx, obj.fromy,obj.tox,obj.toy);			
			obj.storedElement.push({
				type: 'fifteen_number',
				fromx: obj.fromx,
				fromy: obj.fromy,
				tox: obj.tox,
				toy: obj.toy
			});				
				$('#'+currentcanvasid+' input[data-tool=fifteen_number]').change();				
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
			var final_res=$('#q_marks_'+question_number).val(total_value);
			$('#q_marks_'+question_number).click();
			canvasidarray[canvasidarray.length]=currentcanvasid;
			}			
			}else{
				alert("please remove previous annotations");
			}
	}
	
	
	
	else if(currentSelectedEvent == 'text'){

		

$('#none_select_radio').click();
			
				$('#'+currentcanvasid+' input[data-tool=text]').change();
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}	
	canvasidarray[canvasidarray.length]=currentcanvasid;



	}
}