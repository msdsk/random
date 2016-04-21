var layout = {
	
	checkValidity : function(el){
		if(el.tagName === "INPUT" || el.tagName === "SELECT" || el.tagName === "TEXTAREA"){
			return el.validity.valid;
		} else {
			var inputs = el.querySelectorAll("input, select, textarea"),
				i = 0, ii = inputs.length;
			for(i; i<ii; i++){
				if(!layout.checkValidity(inputs[i])){
					return false;
				}
			}
		}
		return true;
	},
	
	touchUp : function(){
		layout.moreLinks();
	},
	
	moreLinks : function (){
		var details = document.querySelectorAll(".more"),
			i = 0, ii = details.length;
		for(i; i<ii; i++){
			layout.setHeight.call(details[i]);
		}
	},
	
	setHeight : function(){
		this.style.height = this.scrollHeight + "px";
	}
}