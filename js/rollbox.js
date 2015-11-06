function randomRange(num, min, max){
	if(typeof max === "number"){
		if(typeof min !== "number"){
			min = 0;
		}
		num = (num*(max - min) + min)
		if(min % 1 === 0 && max % 1 === 0){
			num = Math.round(num);
		}
	}
	return num;
}

function random(seed, min, max) {
	if(typeof seed !== "number" || seed < 0){
		throw new Error("Seed must be an int greater than zero");
	}
	seed = seed + 2;
	var x = (Math.sin(seed)+1) * 1001;
    x = x - Math.floor(x);
	x = randomRange(x, min, max);
	return x
}

function randomNorm(seed, min, max, skew){
	var x = (random(seed) - random(seed + 1) + 1)/2;
	if(typeof skew === "number"){
		x = Math.pow(x, skew);
	}
	x = randomRange(x, min, max);
	return x;
}

function pushFlags(newFlags, oldFlags, noPush){
	//noPush - keyword put in flags that should not return to a higher object (usually one denoting already borrowed from it)
	if(Array.isArray(newFlags)){
		var i = 0, ii = newFlags.length;
		for(i; i<ii; i++){
			if(!oldFlags[newFlags[i]] && newFlags[i].indexOf(noPush) < 0){
				oldFlags[newFlags[i]] = true;
			}
		}
	} else if(typeof newFlags === "object"){
		for(var key in newFlags){
			if(newFlags.hasOwnProperty(key) && newFlags[key] === true && key.indexOf(noPush) < 0){
				oldFlags[key] = true;
			}
		}
	}
}

function perksText(perks, replace){ //turning text from perks object into a nice string
	var perskstring = "",
		i = 0, ii = perks.length;
	for (i; i<ii; i++){
		var txt = perks[i].text;
		if (replace) for (var key in replace) {
			txt = txt.replace(key, replace[key]);
		}
		perskstring += txt + "<br>"
	}
	return perskstring;
}

function checkFlags(flags, oldFlags, prevOk) {
	var ok = prevOk ? prevOk : true;
	if(flags.length == 0){
		return ok;
	}
	var i = 0, ii = 1;
	if(Array.isArray(flags)){
		ii = flags.length;
	}
	for(i; i<ii; i++){
		var flag;
		if(Array.isArray(flags)){
			flag = flags[i];
		} else {
			flag = flags;
		}
		if(Array.isArray(flag) && flag.length > 0){
			var groupOk = true;
			ok = ok ? checkFlags(flag, groupOk, ok) : ok;
		} else {
			var firstChar = flag[0]
			switch (firstChar) {
				case "!":
					ok = ok ? !checkFlags(flag.slice( 1 ), oldFlags, ok) : ok;
					break;
				case "|":
					ok = ok ? ok : checkFlags(flag.slice( 1 ), oldFlags, ok);
					break;
				default:
					ok = ok ? (oldFlags[flag] ? oldFlags[flag] : false) : ok
			}
		}
	}
	return ok;
}

function perksRoll(seed, data, flags, times){
	times = times ? times : 1;
	var perksArr = [];
	for(i=0; i<times; i++){
		if(data.length < 1){
			var err = Error("too much perks, too little data");
			console.log(err.stack);
			throw err;
		}
		var roll = random(seed, 0, data.length - 1);
		if(checkFlags(data[roll].req, flags)){
			pushFlags(data[roll].flags, flags);
			perksArr.push(data[roll]);
			data.splice(roll, 1);
		} else {
			data.splice(roll, 1);
			i--;
		}
		seed = random(seed + 1);
	}
	return perksArr;
}

function ajax(url, type) {
	if(!type){
		type = "text";
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
		req.open("GET", url);
		req.responseType = type;
		req.send();
		});
	return promise;
}

function probRoll(resArr, probArr, seed){
	var cumulativeProbArr = [0, probArr[0]],
		i = 2, ii = Math.min(resArr.length+1, probArr.length+1);
	if(ii < 1){
		throw "No table to roll on!"
	}
	if(typeof seed !== "number"){
		throw "No seed to roll on table!"
	}
	for(i; i<ii; i++){
		var prob = cumulativeProbArr[i-1] + probArr[i-1]
		cumulativeProbArr.push(prob);
	}
	var rand = random(seed, 0, cumulativeProbArr[cumulativeProbArr.length-1]-1),
		res = {};
	var a = 1, aa = cumulativeProbArr.length;

	for(a; a < aa; a++){
		if(rand >= cumulativeProbArr[a-1] && rand < cumulativeProbArr[a]){
			res = { 'index' : a-1, 'val' : resArr[a-1]}
			break;
		}
	}
	return res;
}

function nameGen(seed, nameTable){
	var nameArray = nameTable;
	var vowels = "aioueAIOUE", diphthongs = ["ch"];
	var newName = "";
	var syllabeNo = 0;
	
	function syllabize(toSyllabize){
		var syllabesArr = [], 
			syl = "",
			vo = "", co = [], lastVowelIndex = 0, start = "";
		var i = 0, ii = toSyllabize.length;
		
		function endSyllabe(){
				lastVowelIndex = i;
				if(co.length > 1){
					syl = co.slice(-Math.floor(co.length/2)).join("") + vo + start;
					start = co.slice(0, Math.ceil(co.length/2)).join("");
				} else {
					syl = co.join("") + vo + start;
					start = "";
				}
				syllabesArr.unshift(syl);
				co = [];			
		}
		
		for(i; i<ii; i++){
			//var letter = word.slice(-i-1, -i);
			var letter = i>0 ? toSyllabize.slice(-i-1, -i) : toSyllabize.slice(-i-1),
				nextLetter = i + 1 < ii ? toSyllabize.slice(-i-2, -i-1) : "";
			
			while(nextLetter && (diphthongs.indexOf(nextLetter + letter) > -1 || 
				  (diphthongs.indexOf(letter) === -1 && vowels.indexOf(letter[0]) > -1 && vowels.indexOf(nextLetter) > -1 ))
				 ){
				letter = nextLetter + letter;
				i++;
				nextLetter = i+1 < ii ? toSyllabize.slice(-i-2, -i-1) : "";
			}
			
			if(!vo && vowels.indexOf(letter[0]) === -1){
				start = letter + start;
			}
			
			if((vo && vowels.indexOf(letter[0]) > -1) || i == ii - 1){	
				endSyllabe();
			} else if(vo) {
				co.unshift(letter);
			}
			
			if(vowels.indexOf(letter[0]) > -1){
				vo = letter;
			}
		}
		
		if(vowels.indexOf(letter[0]) > -1){
			syllabesArr.unshift(co + vo + start);
		} else {
			syllabesArr[0] = (lastVowelIndex !== 0 ? (toSyllabize.slice(0, ii - lastVowelIndex)) : "") + start + syllabesArr[0];
		}
		return syllabesArr;
	}
	function word(wordSeed){
		return nameArray[random(wordSeed, 0, nameArray.length - 1)];
	}
	
	var w = word(seed),
		syl = syllabize(w);
	
	do{
		newName += syl[syllabeNo];
		syllabeNo ++;
		w = word(seed + syllabeNo);
		syl = syllabize(w);
		if(syl.length === 1 && syllabeNo < 2){
			w = word(seed + syllabeNo + .5);
			syl = syllabize(w);
		}
		if(syllabeNo > 15){
			break;
		}
	} while(syl.length > syllabeNo);
	return newName;
}