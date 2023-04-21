using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Linq;
using System.Collections.Generic;

namespace core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class impostazioniController : FunzioniAggiuntive
    {

        TraduzioniController traduzioni = new TraduzioniController();

        [HttpGet]
        public response get()
        {
            response ris = new response();
            try
            {
                if (isValidSession() && getRuolo() < 10)
                {
                    ris = esegui("Select * from impostazioni");
                }
                else
                {
                    throw new Exception(listaErrori[1]);
                }
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }


        [HttpPut]
        public response put([FromBody] dynamic data)
        {

            response ris = new response();
            try
            {
                if (isValidSession() && getRuolo() < 10)
                {


                    List<string> query = new List<string>();


                    for (var i = 0; i < data.Count; i++)
                    {

                        query.Add("update impostazioni set [valore] = " + apic(data[i]["valore"].Value) + " where chiave = " + apic(data[i]["chiave"].Value) + ";");

                    }

                    ris = eseguiTransact(query, getIdUtente(getToken()));




                }
                else
                {
                    throw new Exception(listaErrori[1]);
                }


            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
    }
}

