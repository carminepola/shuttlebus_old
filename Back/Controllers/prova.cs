using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace core.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class pippoController : FunzioniAggiuntive
    {

[HttpPost]
public string email()
{
    string ok  ="ok";
    try{
          mail newMail = new mail();
        newMail.destinatario="polacarminempc@gmail.com";
        newMail.mittente="shuttlebus@pintourbus.com";
        newMail.testo =getTemplateMail("ciao","prova","","","");
newMail.oggetto = "prova mail";
  sendMail(newMail);


    }catch(Exception ex)
    {
        ok =  ex.Message;
    }
return ok;



}
        [HttpGet]

        public string ip()
        {
            try
            {





                return getIp();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }
    }
}
