(function($){
	//input 0-1000 , textarea 2000,select 9999,similer -100
	//test data
	//	var chElem 	= [
	//		{'item'	: 'checkbox'	,'num'		: 9999, 'label'		: 'form > dl:nth-of-type(1) > dd > label'},
	//	];

	//used class
	//.check	-> form check mode
	//.read		-> form's items value. read only text 
	//.textarea-> form's textarea value. read only text 
	//.red 		-> attention text message
	//.hidden 	-> hidden wrap
	//.zip 		-> address area's class

	var frmOpts		={
		defColor	:'#cfbec4',
		defLColor	:'#404040',
		chColor		:'#ea1f32',
		errorP		: -1
	}

	var frm				= function(){return this;};
	var cookie			= function(){return this;};
		
	frm.prototype.Init			= function(data){
		var flag =0;

		for(var i in data){
			if(! frm.prototype.Check(data[i])){
				 flag++;
				 if(frmOpts.errorP == -1) frmOpts.errorP = i;
			}else{
				 if(frmOpts.errorP == i) frmOpts.errorP = -1;
			}
		}
						
		if(flag){
			$('.read').remove();
			$('.textarea').remove();
			return false;
		}

		$('form').addClass('check');
		return true;
	}

	frm.prototype.Check	= function(elems){
		var juge;
		var elem;
		var val		= '';
		var num	= elems.num;
			
		if(elems.num <= 1000){
			elem = $('input[name = '+elems.item+']');				
			val 	= elem.val();
		}else if(elems.num == 2000){
			elem = $('textarea[name = '+elems.item+']');				
			val 	= elem.val();
		}else if(elems.num == 9999){
			elem = $('select[name = '+elems.item+']');
			val 	= elem.find('option:selected').val() == '' || !elem.find('option:selected').val() ? '' : elem.find('option:selected').val();
		}else{
			elem = $('input[name = '+elems.item+']');
		}

		if(val == '' && elems.num != 999 && elems.num != 9999){
			num =-1;
		}
			
		switch(num){
			case -100:
				if(val == $('input[name = '+elems.origin+']').val()){
					elem.css({'border-color':frmOpts.defColor});
					return true;
				}
				elem.css({'border-color':frmOpts.chColor});
				return false;
			case 0:
				juge =/^([^ ~｡-ﾟ]|\s)+$/;
				hen = val.replace(/[\‐||ー||―||−]/g,function(s){
					return '-';
         		});
				val	= hen;
				elem.val(hen);
				break;
			case 1:
				juge =/^([^ ~｡-ﾟ])([a-zA-Z0-9])+$/;
				break;
			case 2:
				juge =/^([a-zA-Z0-9])+$/;
				break;
			case 10:
				juge =/^(\d{7})|(\d{3}-\d{4})$/;
				var hen = val.replace(/[０-９]/g,function(s){
					return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
          		});
				hen = hen.replace(/[\‐||ー||―||−]/g,function(s){
					return '-';
          		});

				if(hen.match(juge)){
					elem.css('border','solid 1px '+frmOpts.defColor) ;
					elem.val(hen);
					return true;
				}

				elem.css('border','solid 1px '+frmOpts.chColor);
				return false;
			case 11:
				juge =/^(\d{16})$/;
				break;
			case 12:
				juge	= /^(\+?\d{9,13})|(\+?(\d{1,5}(?:-)){2,3}\d{1,5})$/;
				var hen = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g,function(s){
					return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
          		});
					
				hen = hen.replace(/[\‐||ー||―||−]/g,function(s){
					return '-';
          		});

				hen = hen.replace(/[＋]/g,function(s){
					return '+';
          		});

				if(hen.match(juge)){
					$(elem).css('border','solid 1px '+frmOpts.defColor) ;
					$(elem).val(hen);
					elem.val(elem.val().replace(/(\+)/g,function(s){
						return '';
    	    			 		}));
					return true;
				}

				$(elem).css('border','solid 1px '+frmOpts.chColor);
				return false;
			case 100:
				juge = /^[A-Za-z0-9]+[\w\.+-]+@[\w\.-]{2,}\.\w{2,}$/;
				break;
			case 999:
				if(!elem.is(':checked')){
					if(!$(elem).parents('dd').find('p.red').length){
						var p =document.createElement('p');
						p.setAttribute('class','red');
						p.style.width			= 'auto';
						p.style.lineHeight	= '27px';
						p.style.color	= '#ea1f32';
						p.appendChild(document.createTextNode('※選択してください'));
						$(elem).parents('dd').append(p);
					}
					return false;
				}else{
					elem.filter(':checked').parent().removeClass('hidden');
					elem.parents('dd').find('.red:last-of-type').remove();
				}
				return true;
			case 1000:
				if(!$(elem).is(':checked')){
					elem.parent().css('color',frmOpts.chColor);
					return false;
				}
				elem.parent().css('color',frmOpts.defLColor);
				return true;
			case 2000:
				juge =/^([^ ~｡-ﾟ]|\s)+$/;
				if($(elem).attr('maxlength') < $(elem).val().length || $(elem).attr('minlength') > $(elem).val().length){
					elem.css({'border-color':frmOpts.chColor});
					return false;
				}
				
				break;
			case 9999:
				if(val =='' || val =='def' || !val){
					elem.parent().css({'border-color':frmOpts.chColor});
					return false;
				}else{
					elem.parent().css({'border-color':frmOpts.defColor});
				}
	
				return true;
			default:
				elem.css({'border-color':frmOpts.chColor});
				return false;
		}
			
		if(val.match(juge)){
			elem.css({'border-color':frmOpts.defColor});
			return true;
		}
			
		elem.css({'border-color':frmOpts.chColor});
		return false;
	}

	frm.prototype.Reset		= function(){
		$('form').removeClass('check');
		$('.read').remove();
		$('.textarea').remove();
		$('.hidden').removeClass('hidden');
		window.scroll(0,0);
	}
		
	cookie.prototype.read	= function(){
		var arr	= new Array();
		if(document.cookie){
			var cookies	= document.cookie.split(';');
			for(var i =0 ; i < cookies.length; i++){
				var str	= cookies[i].split('=');
				arr[str[0]]	= unescape(str[1]);
			}
			return arr;
		}
		return false;
	}

	cookie.prototype.write	= function(name,value){
		var period	= 7;
		var now	= new Date().getTime();
		var clear	= new Date(now + (60 * 60 * 24 * 1000 * period));
		var expires= clear.toGMTString();
			
		document.cookie	= name+ '=' +escape(value)+ ';expires=' +expires;
	}
	
	$.fn.cookie 	= function(){
		return new cookie();
	}	
	
	$.fn.frmChk 		= function(data){
		var fc	= new frm();
		return data ? fc.Init(data) : fc;
	}	
})(jQuery);