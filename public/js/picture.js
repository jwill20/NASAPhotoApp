/**************************************************************/
/* Global variables                                           */
/**************************************************************/
var request;
var jsonExpression;
var returnData;
var photoArray;
var pictureIndex;
var picturesLeft;
var pic1,pic2,pic3;
var pageNumber, numberOfPages, nextPageToRead;
/**************************************************************/
/* Function: pageLoaded                                       */
/*                                                            */
/* Purpose: Retrieve structure that has list of photos.       */
/*                                                            */
/**************************************************************/
function pageLoaded()
{
   console.log("Initial page load - retrieving list of pictures");
   ajaxIcon('on');
   initAjax();
   ajaxIcon('off');
}
/**************************************************************/
/* Function: backDoor                                         */
/*                                                            */
/* Purpose: Adjust data for testing.                          */
/*                                                            */
/**************************************************************/
function backDoor()
{
   console.log("backDoor ==> Begin");
   /*******************************************************/
   /* Test data for when we get close to the end          */
   /* Indexes 0-5561                                      */
   /*                                                     */
   /* picturesLeft     9      6    3     0                */
   /* pictureIndex  5552   5555 5558  5561                */
   /*                                                     */
   /* picturesLeft     10     7    4     1                */
   /* pictureIndex   5551  5554 5557  5560                */
   /*                                                     */
   /* picturesLeft     11     8    5     2                */
   /* pictureIndex   5550  5553 5556  5559                */
   /*******************************************************/
   picturesLeft = 9;
   pictureIndex = 5552;
}
/**************************************************************/
/* Program: initAjax                                          */
/*                                                            */
/* Purpose: Set up asynchronous handler and make call to      */
/* flickr.                                                    */
/*                                                            */
/**************************************************************/
function initAjax()
{
	/******************************************************/
	/* Set up flickr URL. Retrieve 500 photos.  		      */
	/******************************************************/
	var URL = "https://api.flickr.com/services/rest/?"    +
            "method=flickr.people.getPublicPhotos&"     +
            "api_key=a5e95177da353f58113fd60296e1d250&" +
            "user_id=24662369@N07&"                     +
            "format=json&nojsoncallback=1&"             +
            "per_page=500&";

  console.log("initAjax ==> URL = " + URL);

	/******************************************************/
	/* Set up Ajax handler and make request               */
	/******************************************************/
	if (window.XMLHttpRequest)
  {
    console.log("initAjax ==> window.XMLHttpRequest");
    request = null;
    request = new window.XMLHttpRequest;
    if (request)
    {
      console.log("initAjax ==> Making Ajax call");
      request.onreadystatechange = processStateChange;
      request.open("GET", URL, true);
      request.send(null);
    }
    else
    {
      console.log("initAjax ==> Could not build request object");
    }
  }
  else if (window.ActiveXObject)
  {
    console.log("initAjax ==> Browser is IE");

    request = new ActiveXObject("Microsoft.XMLHTTP");
    if (request)
    {
      console.log("initAjax ==> Could not build request object");
      request.onreadystatechange = processStateChange;
      request.open("GET", URL, true);
      request.send();
    }
  }
  else
  {
    console.log("initAjax ==> Could not build request object");
  }
}
/**************************************************************/
/* Program: processStateChange                                */
/*                                                            */
/* Purpose: Asynchronous handler of results from server code. */
/*                                                            */
/**************************************************************/
function processStateChange()
{
   console.log("processStateChange ==> Begin");

   if (request.readyState == 4)
   {
      if (request.status == 200)
      {
         console.log("processStateChange ==> Got 200");
		     jsonExpression = "(" + request.responseText + ")";
		     returnData = eval(jsonExpression);
         console.log("processStateChange ==> Total number of pictures = " + returnData.photos.total);
         picturesLeft = returnData.photos.total;
         photoArray = returnData.photos.photo;
         numberOfPages = returnData.photos.pages;
         nextPageToRead = 2;
         console.log("processStateChange ==> Number of pictures read in = " + photoArray.length)
         console.log("processStateChange ==> Page number = " + returnData.photos.page);
         console.log("processStateChange ==> Total number of pages = " + numberOfPages);
         setInitialPhotos();
      }
      else
      {
        console.log("processStateChange ==> Bad return code from Ajax call");
        console.log("processStateChange ==> Response Text = " + request.responseText);
        console.log("processStateChange ==> Response Status = " + request.responseStatus);
      }
   }
}
/**************************************************************/
/* Function: setInitialPhotos                                 */
/*                                                            */
/* Purpose: Set values for first three photos                 */
/*                                                            */
/**************************************************************/
function setInitialPhotos()
{
   console.log("setInitialPhotos ==> Begin");
   var pic1Index = 0;
   var pic2Index = 1;
   var pic3Index = 2;
   pictureIndex = 3;
   picturesLeft = picturesLeft - 3;

   pic1 = "https://farm" + photoArray[pic1Index].farm + ".staticflickr.com/" + photoArray[pic1Index].server +
          "/" + photoArray[pic1Index].id + "_" + photoArray[pic1Index].secret + ".jpg"
   document.getElementById("pic1").src = pic1;

   pic2 = "https://farm" + photoArray[pic2Index].farm + ".staticflickr.com/" + photoArray[pic2Index].server +
          "/" + photoArray[pic2Index].id + "_" + photoArray[pic2Index].secret + ".jpg"
   document.getElementById("pic2").src = pic2;

   pic3 = "https://farm" + photoArray[pic3Index].farm + ".staticflickr.com/" + photoArray[pic3Index].server +
          "/" + photoArray[pic3Index].id + "_" + photoArray[pic3Index].secret + ".jpg"
   document.getElementById("pic3").src = pic3;

}
/**************************************************************/
/* Function: showMorePictures                                 */
/*                                                            */
/* Purpose: Display the next three photos                     */
/*                                                            */
/**************************************************************/
function showMorePictures()
{
  console.log("showMorePictures ==> Begin");
  var pic1Index;
  var pic2Index;
  var pic3Index;

  /********************************************/
  /* Do we need to get more pages?            */
  /********************************************/
  if (nextPageToRead <= numberOfPages)
  {
    console.log("showMorePictures ==> Next page to read = " + nextPageToRead);
    readMorePages(nextPageToRead);
    nextPageToRead = nextPageToRead + 1;
  }

  switch(picturesLeft)
  {
    case 2:
        console.log("showMorePictures ==> picturesLeft = 2");
        console.log("showMorePictures ==> pictureIndex = " + pictureIndex);
        pic1Index = pictureIndex;
        pic2Index = pictureIndex + 1;
        pic3Index = 0;
        picturesLeft = returnData.photos.total - 2;
        break;
    case 1:
        console.log("showMorePictures ==> picturesLeft = 1");
        console.log("showMorePictures ==> pictureIndex = " + pictureIndex);
        pic1Index = pictureIndex;
        pic2Index = 0;
        pic3Index = 1;
        picturesLeft = returnData.photos.total - 1;
        break;
    case 0:
        console.log("showMorePictures ==> picturesLeft = 0");
        console.log("showMorePictures ==> pictureIndex = " + pictureIndex);
        pic1Index = 0;
        pic2Index = 1;
        pic3Index = 2;
        picturesLeft = returnData.photos.total;
        pictureIndex = 3;
        break;
    default:
       console.log("showMorePictures ==> picturesLeft = " + picturesLeft);
       console.log("showMorePictures ==> pictureIndex = " + pictureIndex);
       pic1Index = pictureIndex;
       pic2Index = pictureIndex + 1;
       pic3Index = pictureIndex + 2;
       pictureIndex = pictureIndex  + 3;
       picturesLeft = picturesLeft - 3;
  }
  console.log("showMorePictures ==> Adjusted indexes");

  pic1 = "https://farm" + photoArray[pic1Index].farm + ".staticflickr.com/" + photoArray[pic1Index].server +
         "/" + photoArray[pic1Index].id + "_" + photoArray[pic1Index].secret + ".jpg"
  document.getElementById("pic1").src = pic1;

  pic2 = "https://farm" + photoArray[pic2Index].farm + ".staticflickr.com/" + photoArray[pic2Index].server +
         "/" + photoArray[pic2Index].id + "_" + photoArray[pic2Index].secret + ".jpg"
  document.getElementById("pic2").src = pic2;

  pic3 = "https://farm" + photoArray[pic3Index].farm + ".staticflickr.com/" + photoArray[pic3Index].server +
         "/" + photoArray[pic3Index].id + "_" + photoArray[pic3Index].secret + ".jpg"
  document.getElementById("pic3").src = pic3;

}
/**************************************************************/
/* Function: ajaxIcon                                         */
/*                                                            */
/* Purpose: Toggle the Ajax animated gif so user knows to sit */
/*          tight.                                            */
/**************************************************************/
function ajaxIcon(indicator)
{
  if (indicator == "on")
  {
    document.getElementById("ajaxIconBox").style.display = "block";
    document.getElementById("ajaxIcon").style.display = "block";
    document.getElementById("ajaxIconBoxText").style.display = "block";
  }
  else
  {
    document.getElementById("ajaxIconBox").style.display = "none";
    document.getElementById("ajaxIcon").style.display = "none";
    document.getElementById("ajaxIconBoxText").style.display = "none";
  }
}
/**************************************************************/
/* Function: handleAboutButton                                */
/*                                                            */
/* Purpose: Send About Button information.                    */
/*                                                            */
/**************************************************************/
function handleAboutButton()
{
	alert("Jim's NASA Picture Viewer V1.0");
}
/**************************************************************/
/* Function: handleContactButton                              */
/*                                                            */
/* Purpose: Send Contact Button information.                  */
/*                                                            */
/**************************************************************/
function handleContactButton()
{
	alert("Don't call us - we'll call you");
}
/**************************************************************/
/* Program: readMorePages                                     */
/*                                                            */
/* Purpose: Reads more pages of pictures.                     */
/*                                                            */
/**************************************************************/
function readMorePages(pageNumberToRead)
{
	/******************************************************/
	/* Set up flickr URL. Retrieve 500 more photos.       */
	/******************************************************/
	var URL = "https://api.flickr.com/services/rest/?"    +
            "method=flickr.people.getPublicPhotos&"     +
            "api_key=a5e95177da353f58113fd60296e1d250&" +
            "user_id=24662369@N07&"                     +
            "format=json&nojsoncallback=1&"             +
            "per_page=500&"                             +
            "page=" + pageNumberToRead;

  console.log("readMorePages ==> URL = " + URL);

	/******************************************************/
	/* Set up Ajax handler and make request               */
	/******************************************************/
	if (window.XMLHttpRequest)
  {
    console.log("readMorePages ==> window.XMLHttpRequest");
    request = null;
    request = new window.XMLHttpRequest;
    if (request)
    {
      console.log("readMorePages ==> Making Ajax call");
      request.onreadystatechange = processStateChange2;
      request.open("GET", URL, true);
      request.send(null);
    }
    else
    {
      console.log("readMorePages ==> Could not build request object");
    }
  }
  else if (window.ActiveXObject)
  {
    console.log("readMorePages ==> Browser is IE");

    request = new ActiveXObject("Microsoft.XMLHTTP");
    if (request)
    {
      console.log("readMorePages ==> Could not build request object");
      request.onreadystatechange = processStateChange2;
      request.open("GET", URL, true);
      request.send();
    }
  }
  else
  {
    console.log("readMorePages ==> Could not build request object");
  }
}
/**************************************************************/
/* Program: processStateChange2                               */
/*                                                            */
/* Purpose: Asynchronous handler of results from server code. */
/*                                                            */
/**************************************************************/
function processStateChange2()
{
   console.log("processStateChange2 ==> Begin");

   if (request.readyState == 4)
   {
      if (request.status == 200)
      {
         console.log("processStateChange2 ==> Got 200");
		     jsonExpression = "(" + request.responseText + ")";
		     returnData = eval(jsonExpression);
         console.log("processStateChange2 ==> Total number of pictures = " + returnData.photos.total);

         photoArray = photoArray.concat(returnData.photos.photo);

         console.log("processStateChange2 ==> Number of pictures read in = " + photoArray.length)
         console.log("processStateChange2 ==> Page number = " + returnData.photos.page);
         console.log("processStateChange2 ==> Total number of pages = " + numberOfPages);
      }
      else
      {
        console.log("processStateChange2 ==> Bad return code from Ajax call");
        console.log("processStateChange2 ==> Response Text = " + request.responseText);
        console.log("processStateChange2 ==> Response Status = " + request.responseStatus);
      }
   }
}
