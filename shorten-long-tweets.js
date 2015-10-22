// ==UserScript==
// @name         Shorten Long Tweets
// @description  If a tweet appears in your timeline that has excessively long text (5 or more newlines) then it will be cut off with an ellipsis. You can re-expand the tweet by simply clicking on it.
// @include      https://twitter.com/*
// @version      0.9
// @require      https://raw.githubusercontent.com/rafaelw/mutation-summary/master/src/mutation-summary.js
// ==/UserScript==

stylesheet=(function() {
	// Create the <style> tag
	var style = document.createElement("style");
	// WebKit hack :(
	style.appendChild(document.createTextNode(""));
	// Add the <style> element to the page
	document.head.appendChild(style);
	return style.sheet;
})();

stylesheet.insertRule(":not(.opened-tweet)>.content>.longTweet {max-height: 200px;text-overflow: clip ellipsis;overflow: hidden;white-space: pre-line;}",0);
stylesheet.insertRule(":not(.opened-tweet)>.content>.longTweet ~.stream-item-footer:before{line-height:18px;font-weight:bold;font-size: 15px;content:'...'}",1);

var observer = new MutationSummary({
  callback: handleTweetChanges,
  queries: [{ element: '.stream-item' }]
});

function handleTweetChanges(summaries) {
  var tweetSummary = summaries[0];

  tweetSummary.added.forEach(function(tweet) {
    tweetLength=tweet.querySelector(".tweet-text").textContent.split("\n").length
    if(tweetLength >= 5){
      tweet.querySelector(".tweet-text").classList.add("longTweet")
    }
  });
}
