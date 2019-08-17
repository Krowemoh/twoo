function getJson(redditUrl,subreddit,listType,country)
{
    var subUrl = redditUrl + subreddit + listType; 
	$.ajax({
		type:"GET",
    	data:{
   	    	t:"week",
			limit:2
      	},
        url:subUrl,
        success: function(response){
			updatePage(response,redditUrl,subreddit,country);
		}
	});
}
function updatePage(response,redditUrl,subreddit,country)
{
	var posts = response.data.children;
	var html = '<div class="country-container">';	
	html +='<div class=""><a href="'+redditUrl+subreddit+'">'+country+'</a></div>';
	for (var j=0;j<posts.length;j++)
	{
		var post = posts[j];	
		var permalink = post.data.permalink;
		var created = post.data.created_utc;
		var title = post.data.title;
		var url = post.data.url;
		var thumbnail = post.data.thumbnail;

		var currentTime = new Date().getTime()/1000;
		if(created > (currentTime-timeLimit))
		{
			html += '<div>';

			html += '<div class="thumbnail-container">';
			html += '<img class="thumbnail" src="'+thumbnail+'">';
			html += '</div>';

			html += '<div>';
			html += '<a href="'+redditUrl+permalink+'">'+title+'</a>';
			html += '</div>';

			html += '</div>';
			globalPageCounter = globalPageCounter + 1;
		}
	}
	html += '</div>';
	$(".page-container").append(html);
}
var globalPageCounter = 0;
var timeLimit = 2678400;
$(document).ready(function(){
	var redditUrl = "http://www.reddit.com/";
	var listType = "/top.json";
	var validSubs = 0;

	var worldNames = ["africa","asia","europe","centralAmerica","northAmerica","oceania","southAmerica","polarRegions"];
	var world = [africa,asia,europe,centralAmerica,northAmerica,oceania,southAmerica,polarRegions];

	var readableWorld = {};
	for (var i=0;i<countries.length;i++)
	{
		var country = countries[i].name;
		for (var k=0;k<world.length;k++)
		{
			var region = world[k];
			if(region[country] !== undefined)
			{
				readableWorld[country] = region[country];
				validSubs = validSubs + 1;
			}
		}
	}	
	world = [readableWorld];
	console.log("Valid Subs: " + validSubs);
	//world = [polarRegions];
	for (var i=0;i<world.length;i++)
	{
		var region = world[i];
		for (var country in region)
		{
			var subreddit = region[country];
			getJson(redditUrl,subreddit,listType,country);
		}
	}

	setTimeout(function(){
		console.log("Number of Pages: " + globalPageCounter);
	},1000);
});
