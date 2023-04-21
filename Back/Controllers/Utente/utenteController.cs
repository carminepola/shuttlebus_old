using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class utentiController : FunzioniAggiuntive
    {
        [HttpOptions]
        public response blocca([FromBody] dynamic data)
        {
            response ris = new response();
            try
            {
                if (isValidSession())
                {
                    ris = bloccaUtente(data["id"].ToString(), bool.Parse(data["blocca"].ToString()));
                }
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpDelete]
        public response delete([FromBody] dynamic data)
        {
            response ris = new response();
            try
            {
                if (isValidSession())
                {
                    ris = cancellaUtente(data["id"].ToString());
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
                    string pass = CreatePassword(10) + "1";
                    ris = inserisciUtente(data["nomeUtente"].ToString(), pass, data["ruolo"].ToString());
                }
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpPatch]
        public response patch(bool notifica, bool notificaEmail)
        {
            response ris = new response();
            try
            {
                if (isValidSession())
                {

                    esegui("update utenti set notifiche= " + apic(notifica.ToString()) + ", notificheEmail=" + apic(notificaEmail.ToString()) + " where id =" + getIdUtente());

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
        [HttpGet]
        public response get()
        {
            response ris = new response();
            try
            {

                if (isValidSession())
                {
                    ris = getDatiUtente();
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
                if (isValidSession())
                {
                    ris = getDatiUtente(id);
                }
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        public response cancellaUtente(string id)
        {
            response ris = new response();
            try
            {
                if (isEmpty(id))
                {
                    throw new Exception(listaErrori[2]);
                }
                else
                {
                    if (getRuolo() < 10)
                    {

                        esegui("delete from utenti where id =" + apic(id), getUtente());

                    }
                    else
                    {
                        throw new Exception(listaErrori[6]);
                    }
                }

            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        public response bloccaUtente(string id, bool stato)
        {
            response ris = new response();
            try
            {
                if (isEmpty(id))
                {
                    throw new Exception(listaErrori[2]);
                }
                else
                {
                    if (getRuolo() < 10)
                    {
                        esegui("update utenti set bloccato = " + apic(stato.ToString()) + "  where id =" + apic(id), getUtente());
                    }
                    else
                    {
                        throw new Exception(listaErrori[6]);
                    }
                }

            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        public response inserisciUtente(string nomeUtente, string password, string ruolo)
        {
            response ris = new response();
            try
            {
                if (isEmpty(nomeUtente) || isEmpty(password) || isEmpty(ruolo))
                {
                    throw new Exception(listaErrori[2]);
                }
                if (getRuolo() < 10)
                {
                    string passwordDB = BCrypt.Net.BCrypt.HashPassword(MD5Hash(password), 12);
                    response controllo = esegui("select * from utenti where nomeutente = " + apic(nomeUtente));
                    if (IsDataTableEmpty(controllo.data))
                    {
                        esegui("insert into utenti (nomeUtente,password,ruolo) values(" + apicVirgola(nomeUtente) + apicVirgola(passwordDB) + apic(ruolo) + ")", getUtente());
                        mail newMail = new mail();
                        newMail.oggetto = "Attivazione account";
                        newMail.testo = getTemplateMail("Attivazione account", "Ti è stato attivato un account sul sito:" + webSite + "<br>Il tuo username è: " + nomeUtente + "<br> la tua password è: " + password, "", "", "", getLng());
                        newMail.destinatario = nomeUtente;
   sendMail(newMail, "NOREPLY");


                    }
                    else
                    {
                        throw new Exception(listaErrori[9]);
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
        public response getDatiUtente(string id = "")
        {
            response ris = new response();
            try
            {
                if (isValidSession())
                {
                    string q = "";
                    if (isPrivate(id))
                    {
                        q = "Select * from utenti where id =" + apic(getIdUtente());
                    }
                    else
                    {
                        switch (getRuolo())
                        {
                            case int n when (n < 9):

                                if (isEmpty(id))
                                {
                                    q = "select * from utenti where ruolo >= " + getRuolo().ToString() + "and id != " + apic(getIdUtente());
                                }
                                else
                                {
                                    q = "Select * from utenti where id =" + apic(id);
                                }
                                break;
                        }
                    }
                    if (!isEmpty(q))
                    {
                        ris = esegui(q, getUtente());
                        if (!IsDataTableEmpty(ris.data))
                        {

                            ris.data.Columns.Remove("password");
                        }


                    }
                    else
                    {
                        ris.error = generaErrore(6, listaErrori[6], "Utente");
                    }
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

