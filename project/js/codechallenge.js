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
		$("#loadinganim").css("display","none");
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
		$("#loadinganim").css("display","none");
		alert ("There was something wrong with your search , Please try again!");
	}

	return{
		searchInFlickr:function(searchTerm,callback){
			$("#loadinganim").css("display","flex");
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

				$(".navLink").each(function( pIndex ) {
				   if($(this).attr("index") == index)
				   {
				   	  $(this).addClass("selectedPage");
				   }else
				   {
				   	 $(this).removeClass("selectedPage");
				   }
				});

				$(".imagecontainer").click(function(){
					$("#viewImage").attr("src","");
					$("#overlayer").addClass("overclick");
					$("#viewImage").attr("src",$(this).attr("showURL"));
				});
			}


		},
		getPageIndex:function(){
			return index;
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

		if(i > 0 && (i%12) == 0)
		{
			contentString += "|page|";
		}

		contentString += "<div class='imagecontainer shadowed' showURL='https://farm"+elementNode.getAttribute("farm")
										+".staticflickr.com/"+elementNode.getAttribute("server")+"/"
										+elementNode.getAttribute("id")+"_"
										+elementNode.getAttribute("secret")+".jpg"
										+"'>"
							+"<div><img src='https://farm"+elementNode.getAttribute("farm")
										+".staticflickr.com/"+elementNode.getAttribute("server")+"/"
										+elementNode.getAttribute("id")+"_"
										+elementNode.getAttribute("secret")+"_t.jpg"
										+"'></img><p class='caption'>"+elementNode.getAttribute("title")+"</p></div></div>";
								
	}
	flickrManager.setPages(contentString.split("|page|"));

	contentString = "";
	
	$("#pagerNav").empty();
	$("#mainContent").empty();

	if(flickrManager.getPages().length >0)
	{
		if(flickrManager.getPages()[0].length >0)
		{
			for(i = 0;i< flickrManager.getPages().length; i++)
			{
				contentString += "<a class='navLink shadowed' index='"+i+"' >"+(i+1)+"</a>"
			}
			$("#pagerNav").html(contentString);
			
			$(".navLink").click(function(){
					var index = $(this).attr("index");
					
					if(index != flickrManager.getPageIndex())
					{
						flickrManager.goToPage(index);
					}
			});
		}
		flickrManager.goToPage(0);

	}
}

// Start Point
$("document").ready(function(){

	$("#searchField").keypress(function (e) {
			   if(e.which == ENTER_KEY)
			    flickrManager.searchInFlickr($(this).val(),renderPictures)
			});
	$("#loadinganim").css("display","none");
	$("#overlayer").click(function(){
		$(this).removeClass("overclick");
	});	

});