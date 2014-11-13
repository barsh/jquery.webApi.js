jquery.webApi.js
======================

- Make jQuery AJAX calls to ASP.NET WebApi methods 
- Enhanced error handling specifically for WebApi
- Improved paramater handling for GET and POST operations
- Automatically shows jQueryMobile loading message
- Prevents browser from caching responses
- Returns a "then-able" promise for use with [jQuery deferred API](http://api.jquery.com/category/deferred-object/)

## $.webApi(settings);
settings - A set of key/value pairs that configure the request. All settings are option except methodName.

### url (required)
A string containing the URL to which the request is sent (for example: /api/math/add).

###params (optional)
Data to be sent to the server as GET or POST parameters. 
Must be a JSON Object made up of Key/Value pairs.


###success (optional)
A function to be called if the request succeeds.  
The function receives one argument: The object returned from the server.

###error (optional)
A function to be called if the request fails.
The function receives one argument: The error message.

###errorMessageSelector (optional)
If a selector is specified the error message will be set to the text value for matching elements.

###showAlertOnError (optional)
Default: true <br>
If the request fails, the error message will be displayed as a JavaScript alert.  This only occurs if the 'error' and 'errorMessageSelector' properties are not set.

###preventCaching (optional)
Default: true <br>
Prevents GET requests from cached by the browser.
When true, the request is made unique by appending webApiCacheBuster=[current time] to the request.

###showLoadingMessage (optional)
Default: true <br>
Shows a message while the request is loading. This is useful when it is important to convey that a process is pending.
If jQueryMobile is detected the spinner will be displayed.  
If not, a loading message selector must be specified, see loadingMessageSelector.

###loadingMessageSelector (optional)
If a selector is specified matching elements will be made visible while the request is loading.
If jQueryMobile is detected the spinner will be displayed in place of matching elements.  
See jQuery documentation for help with selectors: http://api.jquery.com/category/selectors

##Installation
Include script after the jQuery library:


    <script src="/path/to/jquery.webApi.js"></script>

Note: If using jQueryMobile with Ajax enabled, in some cases you may need to include 
the script tag inside each div with a data-role of page.

##Usage

Execute a web method:

    $.webApi({
        url: 'api/Test/DoSomething'
    });

Pass parameters to a web method:

    $.webApi({
        url: 'api/Test/DoSomething',
        params: { favFruit: 'apple', favNumber: 1, isMale: true },
    });

Custom error handling:

    $.webApi({
        methodName: 'ThrowException',
        error: function (error) { alert(error); }
    });

Insert error into DOM instead of displaying a JavaScript alert:

    $.webApi({
        methodName: 'ThrowException',
        errorMessageSelector: '#spanError'
    });

Get an object from the server (the current date and time, for example):

    $.webApi({
        url: 'api/Test/GetDate',
        success: function (response) { alert(response); },
    });

Pass parameters as a GET:

    $.webApi({
        url: 'api/Test/GetDateWith',
        params: { favFruit: 'apple', favNumber: 1, isMale: true },
        success: function (response) { alert(response); },
    });

Pass parameters as a POST (important when the parameters could cause the query string to exceed the maximum length supported by a web browser or the server):

    $.webApi({
        type: 'POST',
        url: 'api/Test/GetDateWith',
        params: { favFruit: 'apple', favNumber: 1, isMale: true },
        success: function (response) { alert(response); },
    });

Show loading message:

    $.webApi({
        methodName: 'GetDate',
        success: function (response) { alert(response); },
        error: function (error) { alert(error); },
		loadingMessageSelector: '#loadingMessage'
    });



## Sample WebApi server side code: TestController.cs 

    using System;
    using System.Diagnostics;
    using System.Web.Http;

    namespace MvcApplication.API
    {
        public class TestController : ApiController
        {
            [HttpGet]
            public void DoSomething()
            {
                Debug.WriteLine("Did Something");
            }

            [HttpGet]
            public void DoSomethingWith(string favFruit, int favNumber, bool isMale)
            {
                Debug.WriteLine("Did Something with:");
                Debug.WriteLine(favFruit);
                Debug.WriteLine(favNumber);
                Debug.WriteLine(isMale);
            }

            [HttpGet]
            public void ThrowException()
            {
                throw new Exception("Exception thrown at " + DateTime.Now);
            }

            [HttpGet]
            public string GetDate()
            {
                return DateTime.Now.ToString();
            }
        
            [HttpGet]
            public string GetDateWith(string favFruit, int favNumber, bool isMale)
            {
                return string.Format("now={0}\r\nfavFruit={1}\r\nfavNumber={2}\r\nisMale={3}",
                              DateTime.Now,
                              favFruit,
                              favNumber,
                              isMale
                );
            }

            public class Favorites
            {
                public string favFruit;
                public int favNumber;
                public bool isMale;
            }

            [HttpPost]
            public string GetDateWith(Favorites fav)
            {
                return string.Format("now={0}\r\nfavFruit={1}\r\nfavNumber={2}\r\nisMale={3}",
                              DateTime.Now,
                              fav.favFruit,
                              fav.favNumber,
                              fav.isMale
                );
            }

        }
    }

### Copyright and License
Creative Commons Attribution 3.0 United States License +http://creativecommons.org/licenses/by/3.0/us/
