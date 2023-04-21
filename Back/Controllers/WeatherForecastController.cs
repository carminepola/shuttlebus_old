using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


using System.Net;
using System.Net.Mail;
namespace core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class provaController : FunzioniAggiuntive
    {




        [HttpGet]

        public string mail()
        {
            try
            {



                return Request.HttpContext.Request.Headers["X-Real-IP"]; ;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

    }
}
