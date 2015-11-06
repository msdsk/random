/*
/\/\---------------------------------------------------------------------/\/\

\/\/---------------------------------RASY--------------------------------\/\/
*/

function Race(races, seed){ //details for a single race
	var re = this;
	re.seed = seed;
	re.races = races;
	re.setting = races.setting;
	re.string = "";
	re.percentage = 0;
	re.name = "";
	re.flags = {};
	for(var key in re.races.flags){
		if(re.races.flags.hasOwnProperty(key) && re.races.flags[key] === true){
			re.flags[key] = true;
		}
	}
	re.perks = {
		data : [],
		text : ""
	};
	
	function proceduralRace(){ //creating a race from a scratch
		re.data = re.races.data.procedural;
		re.name = nameGen(re.seed+.5, re.setting.data.names);
		re.type = probRoll(re.data.type.val, re.data.type.prob, re.seed+.5);
		re.nameStr = `<div>${re.type.val.text} race <b>${re.name}</b>,`
		re.perks.data.push.apply(re.perks.data, perksRoll(re.seed + .77, re.data[re.type.val.flags[0]+"Perks"], re.flags, random(re.seed * 3.5 + 3, 1, 3)));
		re.perks.data.push.apply(re.perks.data, perksRoll(re.seed + .77, re.races.data.common, re.flags, random(re.seed * 3.5 + 3, 1, 3)));
		re.perks.text = perksText(re.perks.data);
	}
	
	function knownRace(){ //creating a race with a well-known properties
		re.data = re.races.data.known;
		re.type = probRoll(re.data.type.val, re.data.type.prob, re.seed+.5);
		re.subtype = (random(re.seed+.65, 0, 2) === 0 || re.races.flags[re.type.val.flags[0]]) ? probRoll(re.data.subtype.val, re.data.subtype.prob, re.seed+.75) : null;
		if(re.subtype){
			re.name = re.subtype.val.text + " " + re.type.val.text;
		} else {
			re.name = re.type.val.text;
			re.races.flags[re.type.val.flags[0]] = true;
		}
		re.nameStr = `<div><b>${re.name}</b>,` 
		
		re.perks.data.push.apply(re.perks.data, perksRoll(re.seed + .77, re.data[re.type.val.flags[0]+"Perks"], re.flags, random(re.seed * 3.5 + 3, 1, 3)));
		re.perks.data.push.apply(re.perks.data, perksRoll(re.seed + .77, re.races.data.common, re.flags, random(re.seed * 3.5 + 3, 1, 3)));
		re.perks.text = perksText(re.perks.data);
		
		console.log(re.perks.data);
	}
	
	function init(){
		
		var known = random(re.seed * 10, 0, 2); //let's check whether we have elves or spehshul snowflakes
		switch (known){
			case 0: //let's admit it, elves are awesomer than Qhth the flying shit
				proceduralRace();
				break;
			default:
				knownRace()
		};
		
		
		re.percentage = Math.round(randomNorm(re.seed * 10 + 1, 1, 100, 1.5) * re.races.perc)/100; //first, we need to check what part of alien population this race takes
		console.log(re.races.perc, re.percentage);
		re.percentage = re.percentage < re.races.currPerc ? re.percentage : re.races.currPerc;
		console.log(re.percentage);
		re.races.currPerc -= re.percentage;
		if(re.percentage < 5){
			re.flags["rare"] = true;
		}
		if(re.percentage > 30){
			re.flags["numerous"] = true;
		}
		
		re.string += `${re.nameStr} with population of ${Math.round(re.percentage*re.setting.pop/10e5)/100} milion.
<input type="checkbox" class="more-switch" id="gd-${re.seed}"><label for="gd-${re.seed}"><a class="more-text"></a></label>
<div class="more">${re.perks.text}</div>
</div>`
		re.races.string += re.string;	
	}
	init();
	
	return re;
}


function Races(seed, setting) { //creating races
	var rc = this
	rc.seed = seed;
	rc.setting = setting;
	rc.data = rc.setting.data.races;
	rc.string = "";
	rc.numText = "";
	rc.flags = {};
	
	for(var key in rc.setting.flags){
		if(rc.setting.flags.hasOwnProperty(key) && rc.setting.flags[key] === true){
			rc.flags["world-" + key] = true;
		}
	}
	
	rc.perks = {
		data : [],
		text : ""
	};
	rc.races = [];
	rc.perc = (function(){
		var n = random(seed, 0, 4); //once every 5 settings there are no aliens at all
		if(n === 0){
			rc.string = "There are no alien races."
			return 0;
		} else {
			var perc = randomNorm(seed, 1, 100, 3);
			rc.numText = `, out of which ${Math.round(rc.setting.pop*perc/10e5)/100} milion (${perc}%) are alien`
			return perc;
		}
	})()
	rc.currPerc = rc.perc;
	
	if( rc.perc !== 0) { //let's generate existing races
		var i = 1;
		while(rc.currPerc > 0 && i < 5) {
			rc.races.push(new Race(rc, seed * 10 + i/10));
			i++;
		}
	}
	return rc;
}

/*
/\/\---------------------------------RASY--------------------------------/\/\

\/\/-------------------------------BOGOWIE-------------------------------\/\/
*/

function Pantheon(seed, setting) { //generating gods
	
	function godGenderRoll(seed, god){
		switch(random(seed, 0, 3)){ //god's gender
			case 0:
				god.pron = {"nom":"she", "poss":"her"};
				god.flags["female"] = true;
				break;
			case 1:
			case 2:
				god.pron = {"nom":"he", "poss":"his"};
				god.flags["male"] = true;
				break;
			default:
				god.pron = {"nom":"it", "poss":"its"};
				god.flags["agendered"] = true;
				break;
		}
	}
	
	function MonoGod(seed, pantheon, falseGod){ //generating single monotheistic god ----------------------------------------------------------
		var gd = this;
		gd.type = "monotheistic";
		gd.string = "";
		gd.seed = seed;
		gd.pantheon = pantheon;
		gd.name = nameGen(gd.seed+.5, gd.pantheon.setting.data.names);
		gd.flags = {};
		gd.perksData = gd.pantheon.data.monoPerks.slice();
		gd.seed = seed;
		gd.perks = {
			data : [],
			text : ""
		};
		
		
		function init(){
			godGenderRoll(seed * 3, gd)
			gd.perks.data.push.apply(gd.perks.data, perksRoll(gd.seed * 3 + 1, gd.perksData, gd.flags, random(gd.seed * 3 + 1.5, 1, 4)));
			gd.perks.text = perksText(gd.perks.data, {"#nom" : gd.pron.nom, "#poss" : gd.pron.poss});

			if(!falseGod){
				gd.string = `<div>There is a single ${gd.pron.nom === "she"? "goddes" : "god"} named <b>${gd.name}. </b>`;
			} else {
				gd.string = `<div><b>${gd.name},</b> a monotheistic ${gd.pron.nom === "she"? "goddes" : "god"}. `
			}
			gd.string += `<input type="checkbox" class="more-switch" id="gd-${gd.seed}"><label for="gd-${gd.seed}"><a class="more-text"></a></label>
	<div class="more">${gd.perks.text}</div></div>`
			gd.pantheon.string += gd.string;
		}
		init();
		
		return gd;
	}
	
	function PoliGod(seed, pantheon, falseGod){ //generating single polytheistic god ----------------------------------------------------------
		var gd = this;
		gd.type = "politheistic";
		gd.pantheon = pantheon;
		gd.seed = seed;
		gd.string = "";
		gd.perksData = gd.pantheon.data.poliPerks.slice();
		gd.perks = {
			data : [],
			text : ""
		};
		gd.flags = {};
		gd.pron = "";
		gd.evil = false;
		function init(){
			gd.name = nameGen(gd.seed+.5, gd.pantheon.setting.data.names);
			
			if(falseGod !== true){ //if a god ain't false, let's give him some real power and real domain
				gd.domain = probRoll(gd.pantheon.realDomains.val, gd.pantheon.realDomains.prob, seed);
				gd.pantheon.realDomains.val.splice(gd.domain.index, 1);
				gd.pantheon.realDomains.prob.splice(gd.domain.index, 1);
				gd.power = randomNorm(seed, 1, gd.pantheon.powerLeft, 3);
				if(gd.power > 30){
					gd.perks.data.push({text:"#nom is very powerful"});
					gd.flags["powerful"]
				}
				if(gd.power < 4){
					gd.perks.data.push({text:"#nom is a weak god"});
					gd.flags["weak"]
				}
				gd.pantheon.powerLeft = gd.pantheon.powerLeft - gd.power;		
			} else {
				gd.domain = probRoll(gd.pantheon.data.domains.val, gd.pantheon.data.domains.prob, seed);
			}
			gd.flags[gd.domain] = true;
			
			gd.evil = (function(){ //evil gods may be fun, but they shouldn't appear too often
				if(random(gd.seed*3+1, 0, 3) === 0){
					gd.flags["evil"] = true;
					gd.perks.data.push({text:"#nom is evil"})
					gd.pantheon.flags["evil gods"] = true;
					return true;
				} else {
					return false;
				}
			})()
			
			godGenderRoll(seed * 3 + 2, gd)
			
			//gd.perks.data.push(perksRoll(gd.seed * 3 + 3, gd.perksData, gd.flags, random(gd.seed * 3.5 + 3, 1, 4)));
			gd.perks.data.push.apply(gd.perks.data, perksRoll(gd.seed * 3 + 3, gd.perksData, gd.flags, random(gd.seed * 3.5 + 3, 1, 4)));
			gd.perks.text = perksText(gd.perks.data, {"#nom" : gd.pron.nom, "#poss" : gd.pron.poss});	
		}
		init();
		
		gd.string = `<div><b>${gd.name},</b> ${gd.pron.nom === "she"? "goddes" : "god"} of ${gd.domain.val.text}. 
<input type="checkbox" class="more-switch" id="gd-${gd.seed}"><label for="gd-${gd.seed}"><a class="more-text"></a></label>
<div class="more">${gd.perks.text}</div></div>`;
		gd.pantheon.string += gd.string;
		return gd;
	}
	///\ /\ /\ PoliGod /\ /\ /\------------------------------------------------
	
	var pt = this;
	pt.seed = seed ? seed : Math.round(Math.random()*1500);
	pt.p = 10;
	pt.setting = setting;
	pt.data = pt.setting.data.gods;
	pt.string = ``;
	pt.flags = {};
	pt.powerLeft = 100;
	pt.realDomains = { //real gods never have overlapping domains
		val : pt.data.domains.val.slice(),
		prob : pt.data.domains.prob.slice(),
	}
	pt.gods = [];
	pt.false = [];
	pt.perks = {
		data : [],
		text : ""
	};
	pt.num = (function(){ //generating real gods ----------------------------------------------------------
		var t = random(pt.seed, 0, 5),
			i = 0;
		switch(t){
			case 0:
				i = 0;
				pt.flags["no gods"] = true;
				pt.string = `<p>There are no gods.</p>`
				break;
			case 1:
				i = 1;
				pt.flags["monotheism"] = true;
				pt.gods.push(new MonoGod(pt.seed*pt.p+1, pt));
				break;
			case 2:
			case 3:
				i = random((pt.seed * pt.p + 1), 2, 6);
				pt.flags["small pantheon"] = true;
				pt.string = `<p>There are ${i} gods.</p>`;
				for(i; i>0; i--){
					pt.gods.push(new PoliGod(pt.seed*pt.p + i, pt));
				}
				break;
			default:
				i = random((pt.seed * pt.p + 1), 2, 6);
				pt.string = `<p>There are countless gods, and amongs them there are ${i} major ones:</p>`;
				pt.flags["large pantheon"] = true;
				for(i; i>0; i--){
					pt.gods.push(new PoliGod(pt.seed*pt.p + i, pt));
				}
				break;
		}
		return i;
	})()
	
	pt.false = (function(){ //creatign false gods ----------------------------------------------------------
		var f = random(pt.seed, 0, 2),
			fg = [];
		if((f > 0 && pt.num === 0) || (f === 0 && pt.num > 0)){ //false god appear more often when there are no real gods
			pt.perks.data.push({text:"false gods"});
			pt.flags["false gods"] = true;
			pt.string += `<p><strong class="divider">People also worship false gods:</strong></p>`
			var i = 0, ii = random(pt.seed*pt.p*2, 1, (6 - Math.floor(pt.num / 2)));
			for(i; i<ii; i++){
				if(random(pt.seed*pt.p*2+i, 0, 3) > 0 && ii !== 1){
					fg.push(new PoliGod(pt.seed*pt.p*3+i, pt, true));
				} else {
					fg.push(new MonoGod(pt.seed*pt.p*3+i, pt, true));
				}
			}
		}
		return fg;
	})()
	
	if(pt.gods.length === 0 && pt.false.length === 0){
		pt.perks.data.push({text:"People don't worship any gods, real of false."});
		pt.flags["no worship"] = true;
	}
	
	pushFlags(pt.flags, pt.setting.flags);
	
	pt.string = pt.string + ``;
	
	return pt;
}

/*
/\/\-------------------------------BOGOWIE-------------------------------/\/\

\/\/-------------------------------SETTING-------------------------------\/\/
*/

function Setting(seed) {
	var st = this;
	var resultCont = document.getElementById("result")
	st.mod = 1;
	st.seed = seed*10+st.mod;
	st.p = 100;
	st.data = set;
	st.string = "";
	st.name = nameGen(seed*3+.5, st.data.names);
	st.pop = 0;
	st.size = 0;
	st.land = 0;
	st.flags = {};
	st.tech = {};
	st.magic = {};
	st.gods = {};
	st.perks = {
		data : [],
		text : ""
	};
	st.races = {};
	st.civs = [];
	
	st.init = function () { //let's get down to business and generate the setting
		var roll;
		st.tech.seed = st.seed * st.p + 1; //technology!
		roll = probRoll(st.data.technology.val, st.data.technology.prob, seed);
		st.tech.text = roll.val.text;
		st.tech.index = roll.index;
		pushFlags(roll.val.flags, st.flags);
		
		st.magic.seed = st.seed * st.p + 2; //and magic
		roll = probRoll(st.data.magic.val, st.data.magic.prob, seed);
		st.magic.text = roll.val.text;
		st.magic.index = roll.index;
		pushFlags(roll.val.flags, st.flags);
		
		st.size = randomNorm((st.seed * st.p + 3), 100, 1500, 1.3); //planet's size in mln km^2
		st.land = randomNorm((st.seed * st.p * 10 + 30 + 1), 10, 95, 2); //land percentage
		if(st.land < 10){
			st.perks.data.push({text : "this world is nothing more but small chains of islands on an endless ocean"});
			st.flags["water world"] = true;
		}
		if(st.land > 70){
			st.perks.data.push({text : "this world is a single supercontinent ravaged by extreme weather"});
			st.flags["dry"] = true;
			st.flags["extreme weather"] = true;
			st.flags["supercontinent"] = true;
		}
		st.dayLength =( function(){
			var norm = random((st.seed * st.p * 10 + 30 + 2), 0, 6);
			switch(norm){
				case 0:
					return randomNorm((st.seed * st.p * 10 + 30 + 2), 2, 20, .7);
					break;
				case 1:
					return randomNorm((st.seed * st.p * 10 + 30 + 2), 30, 500, 3);
					break;
				default:
					return randomNorm((st.seed * st.p * 10 + 30 + 2), 15, 30);
			}
		})()
		
		if(st.daylength > 80 || !st.flags["extreme weather"]){
			st.flags["extreme weather"] = true;
			st.perks.data.push({text : "this world is ravaged by extreme weather due to a very long day"});
		}
		st.temperature = randomNorm((st.seed * st.p * 10 + 30 + 2), 8, 21);
		if(st.temperature > 18){
			st.flags["infertile"] = true;
			st.flags["dry"] = true;
			st.flags["hot"] = true;
			st.perks.data.push({text : "most of this world is a desert, too hot for humans to live in"});
		}
		if(st.temperature < 10){
			st.flags["infertile"] = true;
			st.flags["cold"] = true;
			st.flags["dry"] = true;
			st.perks.data.push({text : "most of this world is a snowy desert, too cold for humans to live in"});
		}
		
		st.perks.data.push.apply(st.perks.data, perksRoll(st.seed*st.p + 4, st.data.perks, st.flags, random(seed * st.p + 4.5, 2, 7))) //all curious perks
		st.perks.text = perksText(st.perks.data)
		
		st.pop = (function(){
			var popProb = st.data.pop[st.tech.index + Math.floor(st.magic.index/3)];
			var roll = randomNorm((seed * st.p + 5), popProb[0], popProb[1])
			var pop = Math.round(roll * st.size * st.land * 10e4);
			if(roll < 1.3 * popProb[0]){ //setting some flags depending on pop
				st.flags["low population"]
			}
			if(roll > .85 * popProb[1]){
				st.flags["overpopulated"]
			}
			/*if(st.flags["fertile"]){ //all the shit that may drastically change population
				console.log("a!")
				pop = pop * 2
			}
			if(st.flags["infertile"] || st.flags["long war"] || st.flags["plague"]){
				pop = pop * .5;
			}
			if(st.flags["postapoc"]){
				pop = pop * Math.round(random(seed * st.p + 5.5, 1, 3)/10+1);
			}*/
			var popLow = ["infertile", "long war", "post apoc", "plague", "extreme weather", "dry", "cold", "hot"],
				popHigh = ["fertile", "peace"],
				popMod = 0;
			popLow.forEach(function(el){
				if(st.flags[el]){
					popMod --;
				}
			});
			popHigh.forEach(function(el){
				if(st.flags[el]){
					popMod ++;
				}
			})
			pop = Math.round(pop * Math.pow(2, popMod));
			
			return pop;
		})()
		
		st.gods = new Pantheon(st.seed * st.p + 6, st);
		
		st.races = new Races(st.seed * st.p + 7, st);
		
		/* TESKT TO WYPISANIA ----------------------------------------------------------------------------------------------------------------------------*/
		st.string = `<h1>The world of ${st.name}</h1><section><h2>Basic data</h2><p>This world's technological level is that of ${st.tech.text} and ${st.magic.text}.</p>
<p>The planet's surface ${st.size} mln km² (${Math.round(st.size/510*100)/100} area of Earth), with land taking ${st.land}% of it. Its day lasts ${st.dayLength} hours.</p>
<p>The average temperature is ${st.temperature}°C (${
		(function(){
			if(15 - st.temperature === 0){
					return "same as on Earth";
			}
			if(15 - st.temperature > 0){
					return "Cooler by " + (15 - st.temperature) + "°C than Earth";
			}
			if(15 - st.temperature < 0){
					return "Warmer by " + (st.temperature - 15) + "°C than Earth";
			}
		})()
	}).</p>
<p>The planet is inhabitated by ${Math.round(st.pop/10e3)/100} milion people${st.races.numText}.</p>
</section>
<section>
<h2>Gods</h2>
${st.gods.string}
</section>
<section>
<h2>Races</h2>
${st.races.string}
</section>
<section>
<h2>World's traits:</h2>
<p>${st.perks.text}</p>
</section>`
			
		resultCont.innerHTML = st.string;
	}
	st.init();
	
	return st;
}

function touchUp(){
	var details = document.querySelectorAll(".more"),
		i = 0, ii = details.length;
	for(i; i<ii; i++){
		layout.setHeight.call(details[i]);
	}
}

//all the stuff that happens before actually generating the content
var seedInput = document.getElementById("seed"),
	settingButton = document.getElementById("settingButton");
seedInput.value = Math.floor(Math.random()*10000);

var set

function generate(d){
		var setting;
		set = JSON.parse(JSON.stringify(d[0]));
		set.names = JSON.parse(JSON.stringify(d[1]));
		var seed = parseInt(seedInput.value) 
		seed = seed ? seed : Math.floor(Math.random()*10000);
		if(seed > 10000000){
			seed = Math.random()*10000;
			window.alert("The seed was too big for us to handle, so you got something random. Sorry!")
			return 0;
		}
		console.log(set);
		setting = new Setting(parseInt(seedInput.value));
		settingButton.removeAttribute("disabled");
		console.log(setting);
		touchUp();
}

Promise.all([ajax("json/setting.json", "json"), ajax("json/names.json", "json")])
	.then(function(d){
		generate(d);
		settingButton.addEventListener("click", function(e){
			settingButton.setAttribute("disabled","true");
			e.preventDefault();
			generate(d);
		})
	})
	.catch(function(err) {
		window.alert("Whoops, something went very wrong. I bet it's your fault.")
		console.log("rollbox error: ", err);
	})