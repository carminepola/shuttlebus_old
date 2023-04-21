using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Data;
using System.Dynamic;
using System.Net.Http.Headers;
using System.Net.Sockets;
using System.Net.NetworkInformation;
using System.Net;
using System.Net.Mail;
using System.Net.Http;
using System.Threading.Tasks;
namespace core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FunzioniAggiuntive : REMController
    {
        public int getRuolo(string token = "")
        {

            int ris = 9999;
            try
            {

                if (isEmpty(token))
                {
                    token = getToken();
                }
                //#if DEBUG
                if (token == debugToken)
                {
                    return 0;
                }
                //#endif
                if (!isEmpty(token))
                {

                    response utente = esegui("select * from utenti left join sessioni on sessioni.idutente = utenti.id where sessioni.token = " + apic(token));
                    if (!IsDataTableEmpty(utente.data))
                    {

                        ris = int.Parse(utente.data.Rows[0]["ruolo"].ToString());


                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }

        public string getIdUtente(string token = "", string nomeUtente = "")
        {
            string ris = "";
            try
            {

                if (!isEmpty(nomeUtente))
                {
                    response utente = esegui("select * from utenti  where nomeUtente = " + apic(nomeUtente));
                    if (!IsDataTableEmpty(utente.data))
                    {

                        ris = utente.data.Rows[0]["id"].ToString();


                    }
                }
                else
                {
                    if (isEmpty(token))
                    {
                        token = getToken();
                    }
                    if (!isEmpty(token))
                    {

                        response utente = esegui("select * from utenti left join sessioni on sessioni.idutente = utenti.id where sessioni.token = " + apic(token));
                        if (!IsDataTableEmpty(utente.data))
                        {

                            ris = utente.data.Rows[0]["id"].ToString();


                        }
                    }
                }



            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }
        public bool getPermessoNotificaEmail(string id = "")
        {
            bool ris = false;
            try
            {
                if (isEmpty(id))
                {
                    id = getIdUtente();
                }
                else
                {
                    response utente = esegui("select * from utenti  where id = " + apic(id));
                    if (!IsDataTableEmpty(utente.data))
                    {
                        ris = bool.Parse(utente.data.Rows[0]["notificheEmail"].ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }
        public bool getPermessoNotifica(string id = "")
        {
            bool ris = false;
            try
            {

                if (isEmpty(id))
                {
                    id = getIdUtente();
                }
                else
                {
                    response utente = esegui("select * from utenti  where id = " + apic(id));
                    if (!IsDataTableEmpty(utente.data))
                    {
                        ris = bool.Parse(utente.data.Rows[0]["notifiche"].ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }
        public string getUtenteDaId(int id = -1)
        {
            string ris = "";
            try
            {
                if (id < 0)
                {
                    id = int.Parse(getIdUtente());
                }
                if (id > 0)
                {
                    response utente = esegui("select * from utenti where id =" + apic(id.ToString()));
                    if (!IsDataTableEmpty(utente.data))
                    {
                        ris = utente.data.Rows[0]["nomeUtente"].ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }

        public string getUtente(string token = "")
        {
            string ris = "";
            try
            {

                if (isEmpty(token))
                {
                    token = getToken();
                }
                if (!isEmpty(token))
                {

                    response utente = esegui("select * from utenti left join sessioni on sessioni.idutente = utenti.id where sessioni.token = " + apic(token));
                    if (!IsDataTableEmpty(utente.data))
                    {

                        ris = utente.data.Rows[0]["nomeUtente"];


                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }
        public bool isPrivate(string id)
        {
            try
            {
                if (getIdUtente() == id)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public bool isValidSession(string token = "")
        {
            string ip = getIp();

            try
            {

                if (isEmpty(token))
                {

                    token = getToken();
                }
                //#if DEBUG
                if (token == debugToken)
                {
                    return true;
                }
                //#endif
                if (!ipBloccato(ip))
                {
                    if (!isEmpty(token))
                    {
                        esegui("delete from sessioni where  DATEDIFF(day,dataScadenza,GetDate())>0");
                        esegui("delete sessioni WHERE sessioni.idUtente in (select id from utenti where bloccato = 1)");
                        esegui("delete sessioni WHERE sessioni.idUtente not in (select id from utenti)");
                        response ris = esegui("Select * from sessioni where token =" + apic(token));
                        if (!IsDataTableEmpty(ris.data))
                        {
                            esegui("update sessioni set ultimoUtilizzo = GetDate(),ipUltimaOperazione=" + apic(ip) + " where token = " + apic(token));
                            esegui("delete from ipBloccati where ip =" + apic(ip));
                            return true;
                        }
                    }

                    throw new Exception(listaErrori[1]);
                }
                else
                {

                    throw new Exception(listaErrori[8]);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
        public string generaSessione(string idUtente, bool ricorda, string ip)
        {
            Guid g = Guid.NewGuid();
            string token = g.ToString();
            try
            {
                string aggiunta = "";
                if (ricorda)
                {
                    aggiunta = "+365";
                }
                sbloccaIp(ip);
                response ris = esegui("insert into sessioni (idUtente,token,datacreazione, ultimoUtilizzo,dataScadenza,ipLogin,ipUltimaOperazione) values(" + apicVirgola(idUtente) + apicVirgola(token) + "GetDate(),GetDate(),GetDate()" + aggiunta + "," + apicVirgola(ip) + apic(ip) + ")");

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return token;
        }
        public void sbloccaIp(string ip = "")
        {
            try
            {
                if (isEmpty(ip))
                {
                    ip = getIp();
                }
                esegui("delete FROM  ipBloccati  where ip = " + apic(ip));
                esegui("delete FROM  tentativiAccessi  where ip = " + apic(ip));

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public bool ipBloccato(string ip = "")
        {
            bool bloccato = false;
            try
            {

                if (isEmpty(ip))
                {
                    ip = getIp();
                }
                esegui("delete FROM  ipBloccati WHERE DATEDIFF(day,data,GetDate())>0");
                response ris = esegui("Select * from ipBloccati where ip = " + apic(ip));
                if (!IsDataTableEmpty(ris.data))
                {
                    bloccato = true;

                }
            }

            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return bloccato;
        }
        public void tentativoDILogin(string ip, string utente)
        {
            if (!isEmpty(ip))
            {
                esegui("INSERT INTO tentativiAccessi (ip,utente) values(" + apicVirgola(ip) + apic(utente) + ")");
                response countIp = esegui("Select count(*) as tentativi from tentativiAccessi  where ip like " + apic(ip));

                if (!IsDataTableEmpty(countIp.data))
                {

                    int numeroTentativi = int.Parse(countIp.data.Rows[0]["tentativi"].ToString());
                    if (numeroTentativi >= 500)
                    {
                        esegui("INSERT INTO ipBloccati (ip,data) values(" + apicVirgola(ip) + "GETDATE())");
                    }
                }
            }

        }

        public void tentativoDiAcquisto(string ip)
        {
            if (!isEmpty(ip))
            {
                esegui("INSERT INTO tentativiAccessi (ip,utente) values(" + apicVirgola(ip) + apic("") + ")");
                response countIp = esegui("Select count(*) as tentativi from tentativiAccessi  where ip like " + apic(ip));

                if (!IsDataTableEmpty(countIp.data))
                {

                    int numeroTentativi = int.Parse(countIp.data.Rows[0]["tentativi"].ToString());
                    if (numeroTentativi >= 100)
                    {
                        esegui("INSERT INTO ipBloccati (ip,data) values(" + apicVirgola(ip) + "GETDATE())");
                    }
                }
            }

        }

        public int sendMail(mail email, string tipo = "", string id = "")
        {

#if DEBUG
  if(email.destinatario == "ordini@pintourbus.com")
            return 0;
#endif

            if (isEmpty(tipo))
            {
                tipo = "NOREPLY";
            }
            response settings = leggisettingmail(tipo);
            if (!IsDataTableEmpty(settings.data))
            {



                MailMessage msg = new MailMessage();
                msg.To.Add(new MailAddress(email.destinatario));
                msg.From = new MailAddress(settings.data.Rows[0]["mail"].ToString());
                msg.Subject = email.oggetto;
                msg.Priority = MailPriority.High;
                msg.Body = email.testo;
                msg.IsBodyHtml = true;
                msg.BodyEncoding = System.Text.Encoding.UTF8;
                msg.SubjectEncoding = System.Text.Encoding.Default;



                SmtpClient smtp = new SmtpClient();


                smtp.UseDefaultCredentials = false;
                smtp.EnableSsl = bool.Parse(settings.data.Rows[0]["ssl"].ToString());
                smtp.Port = int.Parse(settings.data.Rows[0]["port"].ToString());
                // smtp.Port = 14;
                // smtp.Timeout = 5000;

                smtp.Host = settings.data.Rows[0]["smtp"].ToString();

                bool sincrono = bool.Parse(settings.data.Rows[0]["sync"].ToString());




                smtp.Credentials = new System.Net.NetworkCredential(settings.data.Rows[0]["mail"].ToString(), settings.data.Rows[0]["password"].ToString());

                Guid g = Guid.NewGuid();
                string idMail = g.ToString();
                bool mandato = false;
                try
                {
                  
                    esegui("insert into sendMail (destinatario,email,dataTime,errore,stato,guid,ticket) VALUES(" + apic(email.destinatario) + "," + apic(email.testo) + ",SYSDATETIME()," + apic("invio") + ",1," + apic(g.ToString()) + "," + apic(id) + ")");

                    log("Tentativo invio mail", " Codice: " + idMail + "Destinatario: " + email.destinatario + "\n" + "testo: " + email.testo, "mail");
                    mandato = true;
                    if (sincrono)
                    {
                        smtp.Send(msg);
                    }
                    else
                    {
                        smtp.SendMailAsync(msg);
                    }

                }
                catch (Exception ex)
                {
                    log("Fallito invio mail", " Codice: " + idMail + "Destinatario: " + email.destinatario + "\n" + " " + ex.Message + "\n" + "testo: " + email.testo, "mail");
                }



                if (mandato)
                {
                    esegui("update sendMail set stato = 4, errore = 'nessun errore' where guid = " + apic(g.ToString()));
                }







            }
            return 0;

        }

        public response leggisettingmail(string tipo)
        {
            response emailS = new response();
            try
            {

                if (isEmpty(tipo))
                {
                    tipo = "NOREPLY";
                }

#if DEBUG
                tipo = "DEBUG";
#endif
                emailS = esegui("Select * from [mail] where tipo = " + apic(tipo));
                if (!IsDataTableEmpty(emailS.data))
                {
                    return emailS;
                }
                else
                {
                    log("Impossibile inviare le mail per mancanza di impostazioni");
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return emailS;
        }
        //notifiche

        public void notifica(string titolo, string testo, string tipo, string idUtente = "", string token = "")
        {

            try
            {
                bool email = false;
                bool pushed = false;
                int id = 0;
                if (!isEmpty(idUtente))
                {
                    id = int.Parse(idUtente);
                    pushed = getPermessoNotifica(idUtente);
                    email = getPermessoNotificaEmail(idUtente);
                }
                else if (!isEmpty(token))
                {

                    id = int.Parse(getIdUtente(token));
                    pushed = getPermessoNotifica(id.ToString());
                    email = getPermessoNotificaEmail(id.ToString());
                }
                if (id != 0)
                {
                    if (pushed)
                    {
                        esegui("INSERT INTO notifiche (idUtente,dataNotifica,titolo,tipo,testo,pushed) values(" + apicVirgola(id.ToString()) + "SYSDATETIME()," + apicVirgola(titolo) + apicVirgola(tipo) + apicVirgola(testo) + apic("0") + ")");
                    }
                    if (email)
                    {
                        mail a = new mail();
                        a.destinatario = getUtenteDaId(id);
                        a.oggetto = titolo;
                        a.testo = getTemplateMail(titolo, testo, "", ",", "", getLng());
                        sendMail(a, "NOREPLY");

                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public void notificaGruppo(string titolo, string testo, string tipo, string ruolo)
        {
            response ris = esegui("Select * from utenti where ruolo <= " + apic(ruolo));
            if (!IsDataTableEmpty(ris.data))
            {
                for (var i = 0; i < ris.data.Rows.Count; i++)
                {
                    DataRow riga = ris.data.Rows[i];
                    string id = riga["id"].ToString();
                    notifica(titolo, testo, "", id);

                }
            }


        }

        public string traduzioniPrivateSet(string nome, dynamic traduzioni)
        {
            string risposta = "";
            try
            {
                response r = esegui("Select * from traduzioniPrivate where nome = " + apic(nome));

                if (isEmpty(r.data))
                {
                    risposta = "insert into traduzioniPrivate (nome,it,en) values(" + apicVirgola(nome) + apicVirgola(traduzioni[0]["it"].ToString()) + apic(traduzioni[0]["en"].ToString()) + ");";

                }
                else
                {
                    risposta = "update  traduzioniPrivate set it =" + apic(traduzioni[0]["it"].ToString()) + ", en=" + apic(traduzioni[0]["en"].ToString()) + " where nome =" + apic(nome);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return risposta;

        }

        protected int inserisciAcquisto(dynamic data, string sessione, string tipo, string lng, string codiceBiglietto)
        {
            try
            {


                DateTime localDate = DateTime.Now;
                controlloPostiController controlloPosti = new controlloPostiController();

                List<string> q = new List<string>();
                List<string> listaDateNotifica = new List<string>();
                var backup = Newtonsoft.Json.JsonConvert.SerializeObject(data);

                var reseller = getIdUtente();
                var qu = "insert into acquisti (reseller,sessione,riferimento,costo,tipoPagamento,data,nome,email,telefono,[backup]) values(" + apicVirgola(reseller) + apicVirgola(sessione) + apicVirgola(codiceBiglietto) + apicVirgola(data["prezzo"].ToString()) + apicVirgola(tipo) + "GetDate()," + apicVirgola(data["nome"].ToString()) + apicVirgola(data["email"].ToString()) + apicVirgola(data["telefono"].ToString()) + apic(backup) + ");";

                q.Add(qu);
                for (var i = 0; i < data["elementi"].Count; i++)
                {
                    int numeroPosti = 0;
                    var dataBiglietto = covertDataItToTime(data["elementi"][i]["data"].ToString());
                    var idLinea = data["elementi"][i]["datiBiglietto"]["idlinea"].ToString();
                    var idFascia = data["elementi"][i]["datiBiglietto"]["guid"].ToString();
                    var numeroBagagliOpzionali = data["elementi"][i]["datiBiglietto"]["numeroBagagliOpzionali"].ToString();
                    var idPartenza = data["elementi"][i]["datiBiglietto"]["idFermata"].ToString();
                    var idArrivo = data["elementi"][i]["datiBiglietto"]["idFermata1"].ToString();
                    var costoBagaglioOpzionale = data["elementi"][i]["datiBiglietto"]["prezzoBagagli"].ToString().Replace(',', '.');
                    listaDateNotifica.Add(data["elementi"][i]["data"].ToString());
                    for (var j = 0; j < data["elementi"][i]["datiBiglietto"]["biglietti"].Count; j++)
                    {
                        int numero = int.Parse(data["elementi"][i]["datiBiglietto"]["biglietti"][j]["numero"].ToString());
                        string idBiglietto = data["elementi"][i]["datiBiglietto"]["biglietti"][j]["id"].ToString();
                        string costo = data["elementi"][i]["datiBiglietto"]["biglietti"][j]["costo"].ToString().Replace(',', '.');
                        if (numero > 0)
                        {
                            numeroPosti += numero;
                            q.Add("insert into bigliettiAcquistati (costo,riferimento,numero,idbiglietto,idfascia,idlinea,data) values(" + apicVirgola(costo) + apicVirgola(codiceBiglietto) + apicVirgola(numero.ToString()) + apicVirgola(idBiglietto) + apicVirgola(idFascia) + apicVirgola(idLinea) + apic(dataBiglietto) + ");");
                        }



                    }

                    q.Add(controlloPosti.getQuery(idLinea, int.Parse(idPartenza), int.Parse(idArrivo), idFascia, dataBiglietto, numeroPosti.ToString()));
                    q.Add(controlloPosti.getQueryBagagli(idLinea, int.Parse(idPartenza), int.Parse(idArrivo), idFascia, dataBiglietto, numeroBagagliOpzionali.ToString()));


                    response linee = esegui("Select * from itinerari where idlinea =" + apic(idLinea));
                    if (!IsDataTableEmpty(linee.data))
                    {
                        bool iniziato = false;
                        bool finito = false;
                        bool ultimo = false;
                        for (var j = 0; j < linee.data.Rows.Count && !finito; j++)
                        {
                            if (linee.data.Rows[j]["idFermata"].ToString() == idPartenza.ToString())
                            {
                                iniziato = true;
                            }
                            if (j < linee.data.Rows.Count - 1)
                            {
                                if (linee.data.Rows[j]["idFermata"].ToString() == idArrivo.ToString())
                                {
                                    ultimo = true;
                                }
                            }
                            if (ultimo)
                            {
                                q.Add("insert into intinerariAcquistati (costoBagaglioOpzionale,riferimento,idfermata,idfascia,idlinea,posti,data,bagagliOpzionali) values(" + apicVirgola(costoBagaglioOpzionale) + apicVirgola(codiceBiglietto) + apicVirgola(linee.data.Rows[j]["idFermata"].ToString()) + apicVirgola(idFascia) + apicVirgola(idLinea) + apicVirgola("0") + apicVirgola(dataBiglietto) + apic("0") + ");");

                            }
                            if (linee.data.Rows[j]["idFermata"].ToString() == idArrivo.ToString())
                            {
                                finito = true;
                            }

                            if (iniziato && !ultimo)
                            {
                                q.Add("insert into intinerariAcquistati (costoBagaglioOpzionale,riferimento,idfermata,idfascia,idlinea,posti,data,bagagliOpzionali) values(" + apicVirgola(costoBagaglioOpzionale) + apicVirgola(codiceBiglietto) + apicVirgola(linee.data.Rows[j]["idFermata"].ToString()) + apicVirgola(idFascia) + apicVirgola(idLinea) + apicVirgola(numeroPosti.ToString()) + apicVirgola(dataBiglietto) + apic(numeroBagagliOpzionali) + ");");
                            }
                        }
                    }
                    else
                    {
                        throw new Exception("Linea non valida");
                    }
                }




                response risTransact = eseguiTransact(q);

                TraduzioniController traduzioni = new TraduzioniController();
                if (!isEmpty(risTransact.error.message))
                {
                    // mail mailError = new mail();
                    // mailError.oggetto = nomeSito + " | " + traduzioni.traduci("mail_oggetto", getLng()) + " PAAL transaction error";
                    // string testError = traduzioni.traduci("str_error_payment", getLng());
                    // mailError.testo = getTemplateMail(nomeSito + " | " + traduzioni.traduci("str_ogetto_error", getLng()),
                    // testError, "", "", "", getLng());
                    // mailError.destinatario = data["email"].ToString();

                    sbloccaIp(getIp());
                    // sendMail(mailError, "NOREPLY", codiceBiglietto);
                 
                    return 500;
                }

        
               sbloccaIp(getIp());

                return 100;

            }
            catch (Exception ex)
            {

             

                throw new Exception(ex.Message);

            }

        }
    }
}

