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
