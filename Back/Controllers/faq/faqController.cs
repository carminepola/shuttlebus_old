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
    public class faqController : FunzioniAggiuntive
    {

        TraduzioniController traduzioni = new TraduzioniController();

        [HttpGet]
        public response get()
        {
            response ris = new response();
            try
            {


                ris = esegui("Select * from faq order by id desc ");


            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpGet("{id}")]
        public response get(string id)
        {
            response ris = new response();
            try
            {
                if (isEmpty(id))
                {
                    throw new Exception(listaErrori[2]);
                }
                if (isValidSession() && getRuolo() < 10)
                {


                    ris = esegui("Select * from faq where id = " + apic(id));
                    if (IsDataTableEmpty(ris.data))
                    {
                        throw new Exception(listaErrori[10]);
                    }


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
        [HttpDelete]
        public response delete(string id)
        {

            response ris = new response();
            try
            {
                if (isEmpty(id))
                {
                    throw new Exception(listaErrori[2]);
                }
                if (isValidSession() && getRuolo() < 10)
                {

                    response check = get(id);
                    if (!IsDataTableEmpty(check.data))
                    {
                        ris = esegui("Delete faq where id =" + apic(id));
                    }
                    else
                    {
                        throw new Exception(listaErrori[10]);
                    }

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


        [HttpPost]
        public response post([FromBody] dynamic data)
        {

            response ris = new response();
            try
            {
                if (isValidSession() && getRuolo() < 10)
                {

                    ris = esegui("Insert into faq (domandaIT,domandaEN,rispostaIT,rispostaEN) values(" + apicVirgola(data["domandaIT"].ToString()) + apicVirgola(data["domandaEN"].ToString()) + apicVirgola(data["rispostaIT"].ToString()) + apic(data["rispostaEN"].ToString()) + ")", getUtente());


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
                    ris = esegui("Update faq set domandaIT=" + apicVirgola(data["domandaIT"].ToString()) + " domandaEN=" + apicVirgola(data["domandaEN"].ToString()) + " rispostaIT=" + apicVirgola(data["rispostaIT"].ToString()) + " rispostaEN=" + apic(data["rispostaEN"].ToString()) + " where id =" + apic(data["id"].ToString()));

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

