var ENTER_KEY = 13;

var settings = {
	flickerURL:"https://api.flickr.com/services/rest/",
	apiKey:"ce4a82f6c37b06a985e476581bf86eaa",
	apiSecret:"9936226a6c79358c",
	searchMethod: "flickr.photos.search"

}


var flickrManager = function(){

	var searchCallBack;
	var onSuccess = function(data,status,httpObject){
		debugger;
		searchCallBack();
	}

	var onFail = function(){
		alert ("Error");
	}

	return{
		searchInFlickr:function(searchTerm,callback){
			searchCallBack = callback;
			$.ajax({
				  type: "POST",
				  url: settings.flickerURL,
				  data: {api_key:settings.apiKey,text:searchTerm,method:settings.searchMethod},
				  success: onSuccess,
				  error:onFail
				});
		}
	};
}();

var renderPictures = function()
{
	alert ("success");
}

// Start Point
$("document").ready(function(){

	$("#searchField").keypress(function (e) {
			   if(e.which == ENTER_KEY)
			    flickrManager.searchInFlickr($(this).val(),renderPictures)
			});

});