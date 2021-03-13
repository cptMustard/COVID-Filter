/*
 * COVID Filter - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of COVID from the web page.
 * Yes this is a very basic search and replace from the original TRUMP filter
 */

// Variables
var regex = /Covid/i;
var search = regex.exec(document.body.innerText);

var selector = ":contains('Covid'), :contains('COVID'), :contains('covid'), :contains('Covid19'), :contains('COVID19'), :contains('covid19'), :contains('Covid-19'), :contains('COVID-19'), :contains('covid-19'), :contains('pandemie'), :contains('pandemic'), :contains('confinement'), :contains('couvre-feu')";


// Functions
function filterMild() {
	console.log("Filtering Covid with Mild filter...");
	return $(selector).filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterDefault () {
	console.log("Filtering Covid with Default filter...");
	return $(selector).filter(":only-child").closest('div');
}

function filterVindictive() {
	console.log("Filtering Covid with Vindictive filter...");
	return $(selector).filter(":not('body'):not('html')");
}

function getElements(filter) {
   if (filter == "mild") {
	   return filterMild();
   } else if (filter == "vindictive") {
	   return filterVindictive();
   } else if (filter == "aggro") {
	   return filterDefault();
   } else {
     return filterMild();
   }
}

function filterElements(elements) {
	console.log("Elements to filter: ", elements);
	elements.fadeOut("fast");
}


// Implementation
if (search) {
   console.log("Covid found on page! - Disinfecting...");
   chrome.storage.sync.get({
     filter: 'aggro',
   }, function(items) {
	   console.log("Filter setting stored is: " + items.filter);
	   elements = getElements(items.filter);
	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", covids: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " covids.");
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}
