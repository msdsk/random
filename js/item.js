var config = {
	materialProb : 90,
	mainAdjProb : 60,
	secondaryDecProb : 50
}

function Item(seed){
	var item = this;
	
	item.seed = seed;
	item.data = rb.deepCopy(itemsData);
		
	item.flags = {};
	item.type = {};
	item.mainAdj = {};
	item.material = {};
	item.string = `<b>`;
	
	item.init = function(){
		
		function rollMaterial(){
			if(rb.random(seed + 1, 0, 100) < config.materialProb && !item.flags["liquid"]){
				item.material = rb.perksRoll(item.seed, item.data.materials, item.flags)[0];
				rb.pushFlags(item.material.flags, item.flags);
				item.seed += .01;
				
			}			
		}
		rollMaterial();
		
		function rollType(){
			console.log(item.flags);
			item.type = rb.perksRoll(item.seed, item.data.type, item.flags)[0];
			//rb.pushFlags(item.type.flags, item.flags);
			item.seed += .01;
		}
		rollType();
		
		function rollMainAdj(){
			if(rb.random(seed + 2, 0, 100) < config.mainAdjProb){
				item.mainAdj = rb.perksRoll(item.seed, item.data.adjectives, item.flags)[0];
				rb.pushFlags(item.mainAdj.flags, item.flags);
				item.seed += .01;
				
				item.string += `${item.mainAdj.name} `;
			}
		}
		rollMainAdj();
		
		
		item.string += `${item.material.name?item.material.name+" ":""}${item.type.name}</b>`;
		
		
		function secondaryDesc(){
			
		}
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