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
    public class bigliettiController : FunzioniAggiuntive
    {

        TraduzioniController traduzioni = new TraduzioniController();

        [HttpGet]
        public response getBiglietti()
        {
            response ris = new response();
            try
            {
                if (isValidSession() && getRuolo() < 10)
                {
                    ris = esegui("Select * from biglietti order by id desc ");
                    if (!IsDataTableEmpty(ris.data))
                    {
                        ris.data.Columns.Add("traduzioniNome", typeof(DataTable));
                        ris.data.Columns.Add("traduzioniDesc", typeof(DataTable));

                        for (var i = 0; i < ris.data.Rows.Count; i++)
                        {

                            ris.data.Rows[i]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["nome"].ToString());
                            ris.data.Rows[i]["traduzioniDesc"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["descrizione"].ToString());
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
        public response getBiglietto(string id)
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


                    ris = esegui("Select * from biglietti where id = " + apic(id));
                    if (IsDataTableEmpty(ris.data))
                    {
                        throw new Exception(listaErrori[10]);
                    }
                    else
                    {
                        ris.data.Columns.Add("traduzioniNome", typeof(DataTable));
                        ris.data.Columns.Add("traduzioniDesc", typeof(DataTable));

                        for (var i = 0; i < ris.data.Rows.Count; i++)
                        {

                            ris.data.Rows[i]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["nome"].ToString());
                            ris.data.Rows[i]["traduzioniDesc"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["descrizione"].ToString());
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
        public response removeBiglietto(string id)
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
                    response undelete = esegui("Select * from bigliettiLinee where idBiglietto =" + apic(id));
                    if (!IsDataTableEmpty(undelete.data))
                    {
                        throw new Exception("Per cancellare questo elemento devi prima disassociarlo");
                    }
                    response check = getBiglietto(id);
                    if (!IsDataTableEmpty(check.data))
                    {
                        List<string> q = new List<string>();
                        q.Add("delete from biglietti where id =" + apic(check.data.Rows[0]["id"].ToString()));
                        q.Add("delete from traduzioniPrivate where nome =" + apic(check.data.Rows[0]["descrizione"].ToString()) + " or nome =" + apic(check.data.Rows[0]["nome"].ToString()));
                        q.Add("delete from bigliettiLinee where idBiglietto =" + apic(check.data.Rows[0]["id"].ToString()));

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
                    q.Add("insert into biglietti (costo, nome, descrizione) values(" + apicVirgola(data["costo"].ToString()) + apicVirgola(data["nome"].ToString()) + apic(data["descrizione"].ToString()) + ");");
                    q.Add("insert into traduzioniPrivate (nome,it,en) values(" + apicVirgola(data["nome"].ToString()) + apicVirgola(data["traduzioniNome"][0].it.ToString()) + apic(data["traduzioniNome"][0].en.ToString()) + ");");
                    q.Add("insert into traduzioniPrivate (nome,it,en) values(" + apicVirgola(data["descrizione"].ToString()) + apicVirgola(data["traduzioniDesc"][0].it.ToString()) + apic(data["traduzioniDesc"][0].en.ToString()) + ");");


                    ris = eseguiTransact(q, getUtente());

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
                if (isValidSession())
                {
                    List<string> q = new List<string>();
                    q.Add("Update  biglietti set costo =" + apic(data["costo"].ToString()) + " where id= " + apic(data["id"].ToString()));
                    string a = data["traduzioniNome"][0].it.ToString();
                    q.Add("Update traduzioniPrivate set it =" + apic(data["traduzioniNome"][0].it.ToString()) + ", en=" + apic(data["traduzioniNome"][0].en.ToString()) + " where nome =" + apic(data["traduzioniNome"][0].nome.ToString()));
                    q.Add("Update traduzioniPrivate set it =" + apic(data["traduzioniDesc"][0].it.ToString()) + ", en=" + apic(data["traduzioniDesc"][0].en.ToString()) + " where nome =" + apic(data["traduzioniDesc"][0].nome.ToString()));
                    ris = eseguiTransact(q, getUtente());

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

