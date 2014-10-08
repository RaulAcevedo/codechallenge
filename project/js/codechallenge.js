var ENTER_KEY = 13;

var settings = {
	flickerURL:"https://api.flickr.com/services/rest/",
	apiKey:"ce4a82f6c37b06a985e476581bf86eaa",
	apiSecret:"9936226a6c79358c",
	searchMethod: "flickr.photos.search"

}


var flickrManager = function(){
	
	var pageArray,searchCallBack,index;

	var onSuccess = function(data,status,httpObject){
		var responseXML = data;

		if(status == "success")
		{
			if(responseXML.children.length >0){
				if(responseXML.children[0].children.length >0)
				{
					searchCallBack(responseXML.children[0].children[0].children);
				}
			}
		}
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
				  error:onFail,
				  dataType:"xml"
				});
		},
		setPages:function(arrayp){
			pageArray = arrayp;
		},
		getPages:function(){
			return pageArray;
		},
		goToPage:function(pageIndex){
			var pageContent = "";
			index = pageIndex;
			if(index >=0 && index< pageArray.length){

				$("#mainContent").html("");
				pageContent =  pageArray[pageIndex];
				$("#mainContent").html(pageContent);
			}


		}

	};
}();

var renderPictures = function(arrayXML)
{
	var contentString = "";
	var elementNode;
	
	for (var i=0;i< arrayXML.length;i++)
	{
		
		elementNode = arrayXML[i];
		contentString += "<div><img src='https://farm"+elementNode.getAttribute("farm")
										+".staticflickr.com/"+elementNode.getAttribute("server")+"/"
										+elementNode.getAttribute("id")+"_"
										+elementNode.getAttribute("secret")+".jpg"
										+"'></img><p>"+elementNode.getAttribute("title")+"</p></div>";

		if(i > 0 && (i%12) == 0)
		{
			contentString += "|page|";
		}								
	}
	flickrManager.setPages(contentString.split("|page|"));

	contentString = "";
	for(i = 0;i< flickrManager.getPages().length; i++)
	{
		contentString += "<a class='navLink' />"
	}

	if(flickrManager.getPages().length >0)
		flickrManager.goToPage(0);
	

}

// Start Point
$("document").ready(function(){

	$("#searchField").keypress(function (e) {
			   if(e.which == ENTER_KEY)
			    flickrManager.searchInFlickr($(this).val(),renderPictures)
			});

});