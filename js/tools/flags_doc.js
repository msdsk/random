var container = document.getElementById("flags");

function listFlags(d){
	console.log(d);
	
	var worldFlags = [],
		godsFlags = [],
		racesFlags = []
	
	function scan(obj, flagsArr){
		if(typeof(obj) === "object"  && obj.constructor !== Array) {
			for(var key in obj){
				if(key === "flags"){
					var flags = obj[key],
						i = 0, ii = flags.length;
					for(i; i<ii; i++){
						if(flagsArr.indexOf(flags[i]) === -1){
							flagsArr.push(flags[i]);
						}
					}
					
					break;
				}
				scan(obj[key], flagsArr);
			}
		}
		if(obj.constructor === Array){
			var i = 0, ii = obj.length;
			for(i; i<ii; i++){
				scan(obj[i], flagsArr);
			}
		}
	}
	
	scan([d.technology, d.magic, d.perks], worldFlags);
	scan([d.gods], godsFlags);
	scan([d.races], racesFlags);
	container.innerHTML = `<h1>World's flags:</h1><div class="columned">${worldFlags.sort().join("<br>")}</div>
<h1>Gods' Flags</h1><div class="columned">${godsFlags.sort().join("<br>")}</div>
<h1>Races' Flags</h1><div class="columned">${racesFlags.sort().join("<br>")}</div>`
	console.log(worldFlags);
}

var promise = new Promise( function (resolve, reject) {
	var req = new XMLHttpRequest();
	req.onload = function() {
		if(req.status === 200 && req.response != null){
			resolve(req.response);
		} else {
			reject(req.response);
		}
	}
	req.open("GET", "json/setting.json");
	req.responseType = "json";
	req.send();
});

promise.then(function(d){
	listFlags(d);
}).catch(function(e){
	throw e
})