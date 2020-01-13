//TODO:
// [ ] save state
// [ ] refresh button
// [x] add a heading
// [x] center the thing vertically (maybe pin to bottom of screen instead of top?)
// [x] random emojis
// [x] double clicking leads to zooming
// [x] show a gallery of values so far
// [ ] decrease/alter the likelihood of the most powerful emojis
// [ ] make test version: given parameter test it will.........
//      [ ] ALLOW you to configure the divisor used in the setting of the parameters
//      [  ] show (as emojis) the list of things that are selected from when it is sending you new things
// [x] only show 4 at first. once level is > 4 -- begin showing more items.
//Done:
// [x] Dark mode
// [no] Each time you replace one another arrives in the empty spot forever argh
// [x] Make adding things slightly higher chance of bigger values
// [x] Remove a snowman
// [x] Remove lotion emoji
// [x] Work out why button gets replaced with new thing added to it
// [x] Indicate level
// [x] Button font: not emoji font
// [x] Button text "no spaces left" nah just disable button
// [no] xx Have them randomly arrive too
// [x] webmanifest and favicon based on emoji
// [no] Centre button
// [x] Make button a button 


var values = [];
var mode = 'ready';
var source = '';
var target = '';
var score = 0;
var largestElement = 1;
var emojiMenu = ['🌑','🌒','🌓','🌔','🌕','☁','🌤','⛅','⛈','❄','⛄','🔥','🌊','☔','🌠','☄',
'💛','💚','💜','👻','👽','👾','🤖','🤓','🧐','💀','☠',
'😸','🙉','🦒','🦔','🦑','🐙','🦞','🦀','🦋','👣','😀','😫','🙈',
'👺','🚝','🥜','👹','💴','💵','💌','🔏','🥑','☕','🤹‍♀️','🌆','🥓',
'🧁','🥝','🍉','🌺','🍹','🍖','🍝','🍣','💩','🦄','🐟','🐠','🦚',
'🦠','🦢','🦷','🥶','🤢','👩‍🎤','👩‍🚀','🧶','👙','💎','🎯','🔮','🎲','🎼','⚗','💊','🗿','💡','💰','🕰'];

var emojis = [];
var selections = {}; //a cache of the possible values...
var numCells = 4;
function ready(fn) {
	if ((document as any).attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(function() {
	var cells = $('.cell');
	for(var i = 0; i < 32; i++) {
	  values[i] = 0;
	  cells[i].addEventListener('click',cell_click);
	  cells[i].setAttribute('id', 'i' + i);
	}

	var button = $('.button');
	button[0].addEventListener('click',button_click);

	//for (var j = 0; j < 10; j++) {
	//	console.log({level:j, max:Math.pow(2,j), choices:Selections(Math.pow(2,j))});
	//}
	randomEmojis();
	levelUp(2);
	//fillAll();
	
});




function randomEmojis() {
  let numEmojis = emojiMenu.length;
  emojis = [];
  for(var i = 0; i < numEmojis; i++) {
	let grabbed =  Math.floor(Math.random() * emojiMenu.length);	  

	for(var j = 0; j < emojis.length; j ++) {
		if (emojis[j] == emojiMenu[grabbed]){
			console.log('DUPLICATE EMOJIPAH: ' + emojiMenu[grabbed]);
		}
	}
	emojis.push(emojiMenu[grabbed]);
	emojiMenu.splice(grabbed,1);
	
  }
  console.log(emojis);

}


function cell_click(f) {
  var idAttrib = f.target.attributes['id'];
  if (idAttrib == undefined) {
	  
	//bubble to parent eh.
	idAttrib = f.target.parentElement.attributes['id'];

	if (idAttrib == undefined) return true; 
  }

  var id = idAttrib.value;

  if (mode=='ready') {
	source = id;
	//$id(''+source).classList.add("selected");
	//TODO: Select all suitable targets.
	var sourceid:number = 1.0 * (source.replace('i','') as any);
	var selector = "[data-val='" + values[sourceid] + "']";
	addParentClass(selector, "target");
	$id(source).classList.remove("target");
	$id(source).classList.add("selected");
	
	mode='set';
  } else if(mode=='set') {
	removeAllClass("target");
	removeAllClass("selected");
    target = id;
	if (source != target) {
	  swap(source,target);
	}
	mode = 'ready';
  }
}

function sayScore(){
	$id('level').innerHTML = "Level " + Math.log2(largestElement) + " (Score " + score + ")";
}

function levelUp(largest){
	var cells = $(".cell");
	var level = Math.log2(largest);
	numCells = Math.floor((level+1) / 4) * 4 + 4;
	console.log({cells:cells.length, level:level, largest:largest, numCells:numCells});
	for(var i = 0; i < 32; i++) {
		if (i<numCells) {
		  cells[i].classList.remove("hide");
		}	 else {
		  cells[i].classList.add("hide");
		}
	}
	let gall = '';
	if (level > 2) {
		for (var ii = 0; ii <= level; ii++) {
			gall += emojis[ii];
		}

		$id('gallery').innerHTML = gall;
	}
}

function swap(isource, itarget) {
  var source:number = 1.0 * (isource.replace('i',''));
  var target:number = 1.0 * (itarget.replace('i',''));
	var cells = $('.cell');
	var sValue = values[source];
	var tValue = values[target];
	if (sValue == tValue) {
		//add them to the target
		values[source] = 0; 
		cells[source].innerHTML = "<span class='item'></span>";
		values[target] = sValue + tValue;
		score += tValue;
		if (values[target] > largestElement) {
			largestElement = values[target];
			levelUp(largestElement);
		}
		sayScore();
		if (values[target] != 0) {
			cells[target].innerHTML = "<span class='item' data-val='" + values[target] + "'>"+say(values[target])+"</span>";
			//button_click(null);
			//fillAll();
		} else {
			cells[target].innerHTML =  "<span class='item'></span>";
		}
		//$('.button')[0].innerHTML = 'add';
	} else {
		//swap them
		values[source] = tValue;
		values[target] = sValue;
		if (values[source] != 0) {
			cells[source].innerHTML =  "<span class='item' data-val='" + values[source] + "'>"+say(values[source])+"</span>";
		} else {
			cells[source].innerHTML =  "<span class='item'></span>";
		}
		if (values[target] != 0){
			cells[target].innerHTML =  "<span class='item' data-val='" + values[target] + "'>"+say(values[target])+"</span>";
		} else {
			cells[target].innerHTML =  "<span class='item'></span>";
		}
	}
}

function say(val) {
  if (val == 0) return ''; 
  else return emojis[Math.log2(val)];
}

function button_click(f) {
	//Fill all the empty cells;
	fillAll();
}

function fillAll() {
	var result = 0;
	while (result != -1) {
		result = fill1();
	}
}

function fill1() {
	var c = findEmptyCell();
	
	if (c != -1) {
	  values[c] = selectValue(largestElement);
	  var targety = $('.cell')[c];
	  $('.cell')[c].innerHTML =  "<span class='item' data-val='" + values[c] + "'>"+say(values[c])+"</span>";
	}
	return c;
}

function Selections(largest) {

	let level = Math.log2(largest);

	if (selections[level] != undefined){
		return selections[level];
	}

	let results = [];
	let counter = 0;
	let value = 1;
	let numRepeats = largest;

	// say the current largest number is 4, we're at level 2... and there are 6 possibles:
	//1 ....                                                       0       0
	//2 .... 1  1                                                  2       1
	//4 .... 1  1  1  1  2  2                                      6       2
    //8 .... 1  1  1  1  1  1  1  1  2  2  2  2  4  4   	       14      3


	for (let ii = 0; ii < level; ii++){
		for (let jj = 0; jj < numRepeats; jj++){
			results[counter] = value;
			counter++;
		}
		numRepeats = numRepeats/1.5;
		value = value * 2;
	}
	//console.log({level:level, results:results});
	selections[level] = results;

	return selections[level]
}


function selectValue(largest) {
	//largest = largest / 4;
	// ^^ was
	largest = largest / 2;
	// assign a random value... but it has to be done according to a formula i've got in mind....
	// ...based on the current largest number out there....
	// say the current largest number is 2... then then there are 3 possibles:
	//1 .... 1                                                     1
	//2 .... 1  1  2                                               3
	//4 .... 1  1  1  1  2  2  4                                   7
    //8 .... 1  1  1  1  1  1  1  1  2  2  2  2  4  4  8	       15
	if (largest <= 2) return 1;
	
	let results = Selections(largest);

	let figure =  Math.floor(Math.random() * results.length);
	var result = results[figure];
    if (result == 0) {
		alert('x');
	}
	
	return result;
}

function findEmptyCell() {
	// finds an empty cell in a fairly random way.
	// if no cells available, returns -1
	var found = false;
	var c = -1;
	var i = 0;
	
	while(!found) {
		c = randomCell();
		if (values[c] == 0) found = true;
		i++;

		if (i==70 && found != true) {
			
			//check every cell... return the first one
			for(var ii = 0; ii<numCells;ii++) {
				if (values[ii] == 0) {
					found = true;
					c = ii;
					break;
				}

			}

			if (!found) {
				//console.log(values);
				c = -1;
				found = true;
			}
		}
	}

	return c;
}

function randomCell() {
	return Math.floor(Math.random() * numCells);
}

/* utility functions */
function htmlToElement(html: string): HTMLElement {
	let template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return <HTMLElement>(template.content.firstChild);
  }
  
  function $(selector: string): HTMLElement[] {
	return <any>document.querySelectorAll(selector);
  }
  
  function $id(id: string): HTMLElement {
	return document.getElementById(id);
  }
  
  function isEmpty(obj: { constructor?: any; }) {
   return (Object.keys(obj).length === 0 && obj.constructor === Object);
  }
  
  //add the class of className to all elements that match the selector
  function addClass(selector: string, className: string) {
	for(const example of $(selector)) {
	  example.classList.add(className);
	}
  }
  
  //add the class of className to all elements that match the selector
  function addParentClass(selector: string, className: string) {
	for(const example of $(selector)) {
	  (example.parentNode as HTMLElement).classList.add(className);
	}
  }

  //remove the class className from all elements that match the selector
  function removeClass(selector: string, className: string) {
	for(const example of $(selector)) {
	  example.classList.remove(className);
	}
  }
  
  // remove the class of className from all elements that have a class of className
  function removeAllClass(className: string) {
	for(const example of $("." + className)) {
	  example.classList.remove(className);
	}
  }
  
  function getParameterByName(name: string) {
	let url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  
  // end utility functions