// ==UserScript==
// @name         Web Twitter Autoupdate
// @description  When you are scrolled all the way up on Twitter, new tweets will automatically appear instead of needing user interaction.
// @include      https://twitter.com/*
// @version      0.9
// @require      https://raw.githubusercontent.com/rafaelw/mutation-summary/master/src/mutation-summary.js
// ==/UserScript==
// DID YOU KNOW THAT INSTEAD OF UPDATING ELEMENTS THAT ARE THERE TWITTER'S CODE DELETES, THEN RECREATSE EVERY ELEMENT
// I DIDN'T
// I'M DONE
if(Element.prototype.getBoundingClientRect === undefined){throw "FunctionalityError: getBoundingClientRect() does not appear to exist! Upgrade, or if it does, tell the dev!"}

Element.prototype.isonScreen = function () { // im so sorry
  var rec = this.getBoundingClientRect();
  if((rec.top+rec.right+rec.bottom+rec.left==0)){throw RangeError("bounding box 0'd out, element updated?")} // IM SO SORRY
  var vpWidth = $(window).width(), // IM SO SORRY!!!!!
      vpHeight = $(window).height(),
      tViz = rec.top    >= 0 && rec.top    <  vpHeight,
      bViz = rec.bottom >  0 && rec.bottom <= vpHeight,
      lViz = rec.left   >= 0 && rec.left   <  vpWidth,
      rViz = rec.right  >  0 && rec.right  <= vpWidth,
      vVisible   = tViz && bViz,
      hVisible   = lViz && rViz;
  return (this.offsetWidth * this.offsetHeight) && vVisible && hVisible;
}

function autoUpdateCheck(summaries) {
  try {
    if(document.querySelector(".new-tweets-bar") === null) {return}
    if(!document.querySelector(".new-tweets-bar").isonScreen()) {return}
    document.querySelector(".new-tweets-bar").click()
  } catch (e) {
    if(e.name == "RangeError"){ 
      console.warn("new-tweets-bar broke from under us in autoUpdateCheck, retrying!");autoUpdateCheck(summaries) // Hate. Let me tell you how much I've come to hate Web Twitter's code since I began to live. 
    }else{throw e;}
  }
}

new MutationSummary({
  callback: autoUpdateCheck,
  queries: [{ element: '.new-tweets-bar' }]
});
