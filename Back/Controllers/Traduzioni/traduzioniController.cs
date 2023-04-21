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
    public class TraduzioniController : FunzioniAggiuntive
    {

        [HttpGet]
        public response getDizionario()
        {
            response ris = new response();
            try
            {
           
               

                ris = esegui("Select * from traduzione order by id desc");

            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpGet("{id}")]
        public response getDizionario(string id)
        {
            response ris = new response();
            try
            {


                ris = esegui("Select * from traduzione  where id = " + apic(id));

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
                if (isValidSession())
                {
                    if (!isEmpty(id))
                    {

                        ris = esegui("Delete traduzione where id = " + apic(id), getIdUtente());
                        return ris;


                    }
                    throw new Exception(listaErrori[2]);
                }
                throw new Exception(listaErrori[1]);

            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;

        }
        [HttpPost]
        public response insert([FromBody] dynamic data)
        {
            response ris = new response();
            try
            {

                if (isValidSession())
                {


                    response check = esegui("Select * from traduzione where parola = " + apic(data["parola"].ToString()));
                    if (!IsDataTableEmpty(check.data))
                    {
                        throw new Exception("Parola già presente nel dizionario");

                    }

                    ris = esegui("Insert into traduzione (parola,it,en) values(" + apicVirgola(data["parola"].ToString()) + apicVirgola(data["it"].ToString()) + apic(data["en"].ToString()) + ")");
                    return ris;



                }
                throw new Exception(listaErrori[1]);
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
                if (isValidSession())
                {


                    ris = esegui("update traduzione set parola=" + apicVirgola(data["parola"].ToString()) + " it= " + apicVirgola(data["it"].ToString()) + "en =" + apic(data["en"].ToString()) + "where id =" + apic(data["id"].ToString()));
                    return ris;



                }
                throw new Exception(listaErrori[1]);
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;

        }


        public DataTable getTraduzioniPrivate(string parola)
        {
            response ris = new response();
            try
            {

                ris = esegui("select * from traduzioniPrivate where nome = " + apic(parola));


            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            return ris.data;

        }
        public string traduci(string parola, string lng = "")
        {
            try
            {
                if (isEmpty(lng))
                {
                    lng = getLng();
                }
                response ris = new response();
                ris = esegui("Select * from traduzione where parola =" + apic(parola));
                if (!IsDataTableEmpty(ris.data))
                {
                    DataTable d = ris.data;
                    bool linguaDisponibile = false;
                    for (int i = 0; i < d.Columns.Count && !linguaDisponibile; i++)
                    {
                        if (d.Columns[i].ToString() == lng)
                        {
                            linguaDisponibile = true;
                        }

                    }
                    if (linguaDisponibile)
                    {
                        if (!isEmpty(ris.data.Rows[0][lng].ToString()))
                        {
                            parola = ris.data.Rows[0][lng].ToString();
                        }
                    }
                }
                else
                {
                    esegui("insert into traduzione (parola,it) values(" + apicVirgola(parola) + apic(parola) + ")");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return parola;
        }

    }
}

