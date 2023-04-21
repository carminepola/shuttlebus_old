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
    public class fermateController : FunzioniAggiuntive
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
                    ris = esegui("Select * from fermate order by id DESC");
                    if (!IsDataTableEmpty(ris.data))
                    {
                        ris.data.Columns.Add("traduzioniCitta", typeof(DataTable));
                        ris.data.Columns.Add("traduzioniNote", typeof(DataTable));

                        for (var i = 0; i < ris.data.Rows.Count; i++)
                        {

                            ris.data.Rows[i]["traduzioniCitta"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["citta"].ToString());
                            ris.data.Rows[i]["traduzioniNote"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["note"].ToString());
                        }
                    }
                }
                else
                {
                    throw new Exception(listaErrori[6]);
                }
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


                    ris = esegui("Select * from fermate where id = " + apic(id));
                    if (IsDataTableEmpty(ris.data))
                    {
                        throw new Exception(listaErrori[10]);
                    }
                    else
                    {
                        ris.data.Columns.Add("traduzioniCitta", typeof(DataTable));
                        ris.data.Columns.Add("traduzioniNote", typeof(DataTable));

                        for (var i = 0; i < ris.data.Rows.Count; i++)
                        {

                            ris.data.Rows[i]["traduzioniCitta"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["citta"].ToString());
                            ris.data.Rows[i]["traduzioniNote"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["note"].ToString());
                        }
                    }

                }
                else
                {
                    throw new Exception(listaErrori[6]);
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
                    response undelete = esegui("Select * from itinerari where idFermata =" + apic(id));
                    if (!IsDataTableEmpty(undelete.data))
                    {
                        throw new Exception("Per cancellare questo elemento devi prima disassociarlo");
                    }
                    response check = get(id);
                    if (!IsDataTableEmpty(check.data))
                    {
                        List<string> q = new List<string>();
                        q.Add("delete from fermate where id =" + apic(check.data.Rows[0]["id"].ToString()));
                        q.Add("delete from traduzioniPrivate where nome =" + apic(check.data.Rows[0]["note"].ToString()) + " or nome =" + apic(check.data.Rows[0]["citta"].ToString()));


                        eseguiTransact(q, getUtente());
                    }
                    else
                    {
                        throw new Exception(listaErrori[10]);
                    }

                }
                else
                {
                    throw new Exception(listaErrori[6]);
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
                if (isValidSession())
                {
                    List<string> q = new List<string>();
                    q.Add("insert into fermate (citta, indirizzo, lat, lng, foto, note) values(" + apicVirgola(data["citta"].ToString()) + apicVirgola(data["indirizzo"].ToString()) + apicVirgola(data["lat"].ToString()) + apicVirgola(data["lng"].ToString()) + apicVirgola(data["foto"].ToString()) + apic(data["note"].ToString()) + ");");
                    q.Add("insert into traduzioniPrivate (nome,it,en) values(" + apicVirgola(data["citta"].ToString()) + apicVirgola(data["traduzioniCitta"][0].it.ToString()) + apic(data["traduzioniCitta"][0].en.ToString()) + ");");
                    q.Add("insert into traduzioniPrivate (nome,it,en) values(" + apicVirgola(data["note"].ToString()) + apicVirgola(data["traduzioniNote"][0].it.ToString()) + apic(data["traduzioniNote"][0].en.ToString()) + ");");


                    ris = eseguiTransact(q, getUtente());

                }
                else
                {
                    throw new Exception(listaErrori[6]);
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
                if (isValidSession())
                {
                    List<string> q = new List<string>();
                    q.Add("Update  fermate set indirizzo =" + apicVirgola(data["indirizzo"].ToString()) + " lat=" + apicVirgola(data["lat"].ToString()) + "lng=" + apicVirgola(data["lng"].ToString()) + "foto=" + apic(data["foto"].ToString()) + " where id= " + apic(data["id"].ToString()));

                    q.Add("Update traduzioniPrivate set it =" + apic(data["traduzioniCitta"][0].it.ToString()) + ", en=" + apic(data["traduzioniCitta"][0].en.ToString()) + " where nome =" + apic(data["traduzioniCitta"][0].nome.ToString()));
                    q.Add("Update traduzioniPrivate set it =" + apic(data["traduzioniNote"][0].it.ToString()) + ", en=" + apic(data["traduzioniNote"][0].en.ToString()) + " where nome =" + apic(data["traduzioniNote"][0].nome.ToString()));
                    ris = eseguiTransact(q, getUtente());

                }
                else
                {
                    throw new Exception(listaErrori[6]);
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

