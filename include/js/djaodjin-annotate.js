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
			selectCanvasItem($(this).closest('.myCanvas').attr('id'));
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
      event.preventDefault();
      var self = this;
      self.storedUndo.push(self.storedElement[self.storedElement.length -
        1]);
		var currentcanvasobject=canvaseventsorder[''+self.baseLayerId.split("_")[1]].pop();
if(currentcanvasobject != undefined)
	currentcanvasobject=currentcanvasobject.split(';;');
else
{	
	currentcanvasobject=['','',''];
}		
      self.storedElement.pop();
      self.checkUndoRedo();
      self.clear();
      self.redraw();
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
			case 'text_ver':
            self.draw_text_ver(self.baseContext, element.fromx, element.fromy,
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
      context.moveTo(x, y);
      context.lineTo(w, h);
      context.moveTo(w - self.linewidth * 5 * Math.cos( Math.PI /
        6), h - self.linewidth * 5 * Math.sin( Math.PI / 6));     
      context.lineTo(w - self.linewidth * 5 * Math.cos(Math.PI /
        6), h - self.linewidth * 5 * Math.sin( Math.PI / 6));
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
      context.fillText("Verified Page", 450, 90);
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
    selectTool: function(element) {
      var self = this;
      self.options.type = element.data('tool');     
    },
    annotatestart: function(event) {
      var self = this;
      self.clicked = true;
      var offset = self.$el.offset();     
      self.tox = null;
      self.toy = null;
      self.points = [];
      var pageX = event.pageX || event.originalEvent.touches[0].pageX;
      var pageY = event.pageY || event.originalEvent.touches[0].pageY;
      self.fromx = (pageX - offset.left) * self.compensationWidthRate;
      self.fromy = (pageY - offset.top) * self.compensationWidthRate;
      self.fromxText = pageX;
      self.fromyText = pageY;    
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
            self.storedElement.push({
              type: 'rectangle',
              fromx: self.fromx,
              fromy: self.fromy,
              tox: self.tox,
              toy: self.toy
            });
            break;
          case 'circle':
            self.storedElement.push({
              type: 'circle',
              fromx: self.fromx,
              fromy: self.fromy,
              tox: self.tox,
              toy: self.toy
            });
            break;
          case 'arrow':
            self.storedElement.push({
              type: 'arrow',
              fromx: self.fromx,
              fromy: self.fromy,
              tox: self.tox,
              toy: self.toy
            });
            break;
case 'text_ver':
            self.storedElement.push({
              type: 'text_ver',
              fromx: self.fromx,
              fromy: self.fromy,
              tox: self.tox,
              toy: self.toy
            });
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
          self.clear();
          self.tox = (pageX - offset.left) * self.compensationWidthRate -
            self.fromx;
          self.toy = (pageY - offset.top) * self.compensationWidthRate -
            self.fromy;
          self.drawRectangle(self.drawingContext, self.fromx, self.fromy,
            self.tox, self.toy);
          break;
        case 'arrow':		
          self.clear();
          self.tox = (pageX - offset.left) * self.compensationWidthRate;
          self.toy = (pageY - offset.top) * self.compensationWidthRate;
          self.drawArrow(self.drawingContext, self.fromx, self.fromy,
            self.tox,
            self.toy);
          break; 		  
		   case 'text_ver':		  
		    self.clear();
            self.tox = (pageX - offset.left) * self.compensationWidthRate;
            self.toy = (pageY - offset.top) * self.compensationWidthRate;
            self.draw_text_ver(self.drawingContext, self.fromx, self.fromy,
            self.tox,
            self.toy);       
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
          self.clear();		  
        self.tox = (pageX - offset.left) * self.compensationWidthRate;
          self.toy = (pageY - offset.top) * self.compensationWidthRate;
          self.drawCircle(self.drawingContext, self.fromx, self.fromy,
            self.tox, self.toy);  
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
  var canvaseventsorder=[];
 var canvasidarray=[];	 
function selectCanvasItem(currentcanvasid){
	$('#'+currentcanvasid).css('border-left','3px solid green');	
	if(LastId != '' ){		
				//$('.'+LastId).removeClass("error1");				
			}
	LastId = currentcanvasid;	
	if(currentSelectedEvent == 'undoaction'){

if(canvasObjects[currentcanvasid].length ==1){
		$('#undoaction'+currentcanvasid).click();
		$('#'+currentcanvasid+' input[data-tool=none_select]').change();
		canvasidarray = jQuery.grep(canvasidarray, function(value) {
			return value != currentcanvasid;
		});
		$('.'+currentcanvasid).removeClass("btn-success");
		$('.'+currentcanvasid).addClass("btn-danger");	
		fun100();
		}else{
$('#undoaction'+currentcanvasid).click();
		$('#'+currentcanvasid+' input[data-tool=none_select]').change();
		fun100();
		}
	}else if(currentSelectedEvent == 'rectangle'){
		
		$('.'+currentcanvasid).removeClass("btn-danger");
		$('.'+currentcanvasid).addClass("btn-success");	
				if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}
		$('#'+currentcanvasid+' input[data-tool=rectangle]').change();
		canvasidarray[canvasidarray.length]=currentcanvasid;
		$("#btn_cnvimg_2").trigger("click");
		fun100();
	}else if(currentSelectedEvent == 'circle'){
		
		$('.'+currentcanvasid).removeClass("btn-danger");
		$('.'+currentcanvasid).addClass("btn-success");	
if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}		
		$('#'+currentcanvasid+' input[data-tool=circle]').change();
		canvasidarray[canvasidarray.length]=currentcanvasid;
		$("#btn_cnvimg_2").trigger("click");	
fun100();		
	}else if(currentSelectedEvent == 'arrow'){
		$('.'+currentcanvasid).removeClass("btn-danger");
		$('.'+currentcanvasid).addClass("btn-success");	
		if(canvaseventsorder[''+currentcanvasid] == undefined)
			canvaseventsorder[''+currentcanvasid] = [];
			if(currentSelectedEvent != 'undoaction'){
			canvaseventsorder[''+currentcanvasid].push(currentcanvasid+';;'+currentSelectedEvent+';;'+$('.directMarkingQuestionNumber').val());
			}		
		$('#'+currentcanvasid+' input[data-tool=arrow]').change();
		canvasidarray[canvasidarray.length]=currentcanvasid;
		$("#btn_cnvimg_2").trigger("click");
		fun100();
	}else if(currentSelectedEvent == 'pen'){
		
		$('.'+currentcanvasid).removeClass("btn-danger");
		$('.'+currentcanvasid).addClass("btn-success");	
		$('#'+currentcanvasid+' input[data-tool=pen]').change();
		canvasidarray[canvasidarray.length]=currentcanvasid;
		$("#btn_cnvimg_2").trigger("click");
		fun100();
	}else if(currentSelectedEvent == 'none_select'){
        $("#btn_cnvimg_2").trigger("click");		
		$('#'+currentcanvasid+' input[data-tool=none_select]').change();
	}else if(currentSelectedEvent == 'text_ver'){
		$('#'+currentcanvasid+' input[data-tool=text_ver]').change();
		canvasidarray[canvasidarray.length]=currentcanvasid;		
		$("#btn_cnvimg_2").trigger("click");		
		$('#'+currentcanvasid).css('border-left','3px solid green');
		$('.'+currentcanvasid).removeClass("btn-danger");
$('.'+currentcanvasid).addClass("btn-success");			
		if(canvasObjects[currentcanvasid].length ==1){
	fun100();
	}		
	}
	fun100();
}