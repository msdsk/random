var config = {
	mainAdjProb : 2
}

function Item(seed){
	var item = this;
	
	item.seed = seed;
	item.data = itemsData;
		
	item.flags = {};
	item.type = {};
	item.mainAdj = {};
	item.string = ``;
	
	item.init = function(){
		function rollType(){
			item.type = rb.probRoll(item.data.type, [], item.seed).val;
			rb.pushFlags(item.type.flags, item.flags);
			item.seed += .01;
		}
		rollType();
		
		function rollMainAdj(){
			if(rb.random(seed + 1, 0, config.mainAdjProb) > 0){
				item.mainAdj = rb.perksRoll(item.seed, item.data.adjectives, item.flags)[0];
			}
		}
		rollMainAdj();
		
		function secondaryDesc(){
			
		}
		
		item.string += `<b>${item.mainAdj.name?item.mainAdj.name:""} ${item.type.name}</b>`
	}
	item.init();
	
	return item;
}


/*/\/\FACTORY--------------------------------------------------------*/

var itemsData;
function setItAllUp(){

	//all the stuff that happens before actually generating the content
	var form = document.getElementById("optionsForm"),
		seedInput = document.getElementById("seed"),
		noInput = document.getElementById("no"),
		itemButton = document.getElementById("itemButton"),
		resultCont = document.getElementById("result");
	seedInput.value = Math.floor(Math.random()*10000); //DEBUG!


	function generate(d){
		console.log("\n-------------------");
		var items = [];
		var seed = parseInt(seedInput.value),
			no = parseInt(noInput.value),
			i=0;
		itemsData = JSON.parse(JSON.stringify(d[0]));
		itemsData.names = JSON.parse(JSON.stringify(d[1]));

		//seed = (seed !== "") ? seed : Math.floor(Math.random()*10000);
		if(seed !== seed || seed > 10000000 || seed < 0){ //fixing bad values
			seedInput.value = seed = Math.round(Math.random()*10000);
			window.alert("The seed was just so wrong, you got something random. Sorry!\nHint: a seed can be a number between 0 and 10.000.000")
		}

		if(!no){
			noInput.value = no = 5;
		}
		if(no !== no || no > 20 || no < 1){
			noInput.value = no = 1;
			window.alert("Number of items must be less than 20. We've generated one item for you.")
		}

		var finalString = ``;
		for(i; i<no; i++){
			items.push(new Item(seed));
			seed++;
			finalString += `<div>${items[i].string}</div>`;
		}
		resultCont.innerHTML = finalString;
		
		itemButton.removeAttribute("disabled");
		console.log(itemsData);
		console.log(items);
		layout.touchUp();
	}

	Promise.all([rb.ajax("json/items.json", "json"), rb.ajax("json/names.json", "json")])
		.then(function(d){
			generate(d);
			itemButton.addEventListener("click", function(e){
				if(layout.checkValidity(form)){
					itemButton.setAttribute("disabled","true");
					e.preventDefault();
					generate(d);
				}
			})
		})
		.catch(function(err) {
			console.log("rollbox error: ", err);
			console.error("Whoops, something went very wrong. I bet it's your fault.\nYou monster.");
		})
}
setItAllUp();