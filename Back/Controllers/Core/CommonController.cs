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
using System.Security.Cryptography;
using System.Text;
using System.Globalization;
using System.Threading.Tasks;
namespace core.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class CommonController : ControllerBase
    {

        public string webSite = "https://shuttlebus.pintourbus.com/";
        public string nomeSito = "Pintour";
        public string imgMail = "assets/img/logo/white.png";
        public string posizione = "html/";
        public string percorsoSettings = "app_data/settings/DB/setting.txt";
        public string userTrack = "app_data/log/user/";
        //private string userLog = "app_data/log/user/";
        public string systemlLOG = "app_data/log/system/";


        public string debugToken = "a1b66874-580a-48b3-b0a1-d97add42460a";

        public static string MD5Hash(string input)
        {
            MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);

            // step 2, convert byte array to hex string
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString().ToLower();
        }
        public bool MD5Check(string val1, string val2)
        {
            if (!isEmpty(val1) && !isEmpty(val2))
            {
                if (val1.ToUpper() == val2.ToUpper())
                {
                    return true;
                }
            }

            return false;
        }
        public void scriviFile(string percorso, string contenuto, bool rewrite = false)
        {
            try
            {
                string path = Path.GetFullPath(percorso);
                StreamWriter streamWriter;
                if (System.IO.File.Exists(path))
                {
                    bool logged = false; int i = 0;
                    do
                    {

                        i++;
                        try
                        {
                            if (!rewrite)
                            {
                                streamWriter = new StreamWriter(path, true);
                                streamWriter.WriteLine(contenuto);
                                streamWriter.Close();
                            }
                            else
                            {

                                System.IO.File.WriteAllText(path, contenuto);
                            }
                            logged = true;
                        }
                        catch
                        {
                            logged = false;
                        }


                    }
                    while (logged == false && i < 4);


                }
                else
                {
                    streamWriter = new StreamWriter(path); streamWriter.WriteLine(contenuto);
                    streamWriter.Close();
                }

            }
            catch (Exception ex)
            {
                annullaLog(ex.Message);
            }

        }
        public void annullaLog(string a)
        {

        }
        public string templateEmail(string body)
        {
            return body;
        }
        //errori
        public string[] listaErrori = new string[]
        {
            "",
            "Sessione non valida effettua il login per creare una nuova sessione",//1
            "Dati mancanti o errati controlla i dati inseriti e riprova",//2
            "Tentativo queryInjection",//3
            "Utente non trovato",//4
            "Parametri non validi",//5 used
            "Non hai i permessi necessari",//6
            "Impossibile leggere le impostazione del server",//7
            "Questo ip è stato bloccato, contattare l'assistenza",//8
            "Dati già presenti nel database", //9
            "Dati non trovati", //10
            "Numero massimo di tentativi superati",//11
            "Nessun elemento trovato",//12
        };
        public response catchError(string message = "", string stack = "", string lng = "")
        {
            response ris = new response();
            try
            {
                int codiceErrore = -1;
                for (int i = 0; i < listaErrori.Length && codiceErrore < 0; i++)
                {
                    if (listaErrori[i] == message)
                    {
                        codiceErrore = i;
                        TraduzioniController a = new TraduzioniController();
                        string messaggioT = a.traduci("errore_" + i.ToString(), getLng());
                        if (messaggioT != "errore_" + i.ToString())
                        {
                            message = messaggioT;
                        }
                    }
                }

                ris.error.message = message;
                ris.error.stack = stack;
                ris.error.exist = true;
                ris.error.code = codiceErrore;
                FunzioniAggiuntive f = new FunzioniAggiuntive();
                f.notifica("Errore", message, "", "", getToken());

                log(message, stack, "");

            }
            catch (Exception ex)
            {

            }
            return ris;
        }
        //email

        //String
        public string apic(string nome)
        {
            try
            {

                nome = nome.Replace("'", "''");
                string risposta = "'" + nome + "'";
                return risposta;



            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public string apicVirgola(string nome)
        {
            nome = nome.Replace("'", "''");
            string risposta = "'" + nome + "',";
            return risposta;

        }
        public error generaErrore(int codice, string messaggio, string posizione)
        {
            error e = new error();
            e.code = -1;
            e.message = messaggio;
            e.stack = posizione;
            e.exist = true;
            return e;
        }
        public bool isEmpty(string value)
        {
            if (value == null || value == "undefined" || value == "" || value == "NULL")
            {
                return true;
            }
            return false;
        }
        public bool IsDataTableEmpty(DataTable db)
        {
            if (isEmpty(db))
            {
                return true;
            }
            return !(db.Rows.Count > 0);
        }
        public bool IsDataSetEmpty(DataSet db)
        {
            if (isEmpty(db))
            {
                return true;
            }
            return !(db.Tables.Count > 0);
        }
        public bool isEmpty(DataTable value)
        {
            try
            {
                if (value == null || value.Rows.Count == 0)
                {
                    return true;
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return false;
        }
        public bool isEmpty(DataSet value)
        {
            try
            {
                if (value == null || value.Tables.Count == 0)
                {
                    return true;
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return false;
        }
        public bool isEmpty(DataRow value)
        {
            try
            {
                if (value == null)
                {
                    return true;
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return false;
        }
        public bool isNumber(string value)
        {
            try
            {
                float output;
                return float.TryParse(value, out output);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }


        }
        public bool isEmpty(object value)
        {
            try
            {

                if (value == null)
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
        //log
        public void log(string messaggio, string info = "", string utente = "")
        {

            if (!isEmpty(utente))
            {
                scriviTracciaUtente(messaggio, utente, info, getIp());
            }
            else
            {
                scriviLog(messaggio, info);
            }
        }
        public void scriviLog(string messaggio, string info = "")
        {
            try
            {
                string path = "";


                path = systemlLOG + DateTime.Now.ToString("yyyyMMdd") + ".txt";



                string txt = "[" + DateTime.Now.ToString("HH:mm:ss") + "]";



                txt += " -> " + messaggio + "\n";

                if (!isEmpty(getIp()))
                {
                    txt += "============IP============\n";
                    txt += getIp() + "\n";
                    txt += "=============END=============\n";
                }
                if (!isEmpty(info))
                {
                    txt += "============Info============\n";
                    txt += info + "\n";
                    txt += "=============END=============\n";
                }


                scriviFile(path, txt);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
        public void scriviTracciaUtente(string messaggio, string utente, string info = "", string ipUtente = "")
        {
            try
            {

                string path = userTrack + utente + ".txt";
                string txt = "[" + DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss") + "] - [" + ipUtente + "] ";
                txt += messaggio + "\n";
                if (!isEmpty(info))
                {
                    txt += "============Info============\n";
                    txt += info + "\n";
                    txt += "=============END=============\n";
                }

                scriviFile(path, txt);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
        public string aggiustaquery(List<string> query)
        {
            try
            {
                string q = queryTransaction(query);
                return aggiungiTransaction(q);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }




        }
        public string aggiungiTransaction(string query)
        {
            try
            {
                string inizio = "BEGIN TRANSACTION" + (char)13
                          + "declare @x int" + (char)13 +
                            " Select @x = 0" + (char)13;
                string fine = (char)13 +
                               "IF @X=0" + (char)13 +
                               "COMMIT TRANSACTION" + (char)13 +
                               "ELSE" + (char)13 +
                               "ROLLBACK TRANSACTION";
                string risposta = inizio + query + fine;
                return risposta;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }



        }
        public string queryTransaction(List<string> listaquery)
        {
            try
            {
                string risposta = "";
                string constat = (char)13 + "Select @X = @@Error Where @@Error >0" + (char)13;
                if (listaquery.Count > 1)
                {
                    for (int i = 0; i < listaquery.Count; i++)
                    {

                        listaquery[i] = listaquery[i] + constat;
                        risposta = risposta + listaquery[i];
                    }
                }
                else
                {
                    risposta = listaquery[0] + " " + constat;
                }

                return risposta;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }


        }
        //Query
        public string qInsert(string nomeTabella, DataRow riga)
        {
            string q = "";
            try
            {

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
            return q;
        }
        //dd
        public bool IsKeyExist(dynamic obj, string name)
        {
            try
            {
                var value = obj[name].Value;
                return true;
            }
            catch
            {


                return false;
            }
        }
        //connessione

        public List<string> creaStringaDiConnessione()
        {
            List<string> ris = new List<string>();
            try
            {
                var path = Path.GetFullPath(percorsoSettings);

                string[] lines = System.IO.File.ReadAllLines(path);

                ris.Add(lines[0]);
                ris.Add(lines[1]);
                ris.Add(lines[2]);
                ris.Add(lines[3]);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }
        public string connessione(string ip, string db, string nomeUtente, string password)
        {
            try
            {
                if (isEmpty(ip) || isEmpty(db) || isEmpty(nomeUtente) || isEmpty(password))
                {
                    throw new Exception("Campo connessione db vuoto");
                }
                else
                {
                    string port = "";
                    if (ip.Split(":").Length > 1)
                    {
                        port = ip.Split(":")[1].ToString();
                        ip = ip.Split(":")[0] + "," + port;
                    }
                    return "Data Source=" + ip + ";Initial Catalog=" + db + ";User Id=" + nomeUtente + ";Password=" + password + ";";
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        //dati chiamata
        public string createTicketNumber(int length)
        {
            const string valid = "abcdefghijklmnpqrstuvwxyz1234567890";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString().ToUpper();
        }
        public string CreatePassword(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyz1234567890";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
        }
        public string getIp()
        {
            string ip = "";
            try
            {
                if (!isEmpty(Request))
                {
                    ip = Request.HttpContext.Request.Headers["X-Real-IP"].ToString();
                }
            }

            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ip;
        }
        public string getToken()
        {
            string token = "";
            try
            {

                token = Request.HttpContext.Request.Headers["token"];
            }
            catch (Exception ex)
            {
                return token;
            }
            return token;
        }
        public string getLng()
        {
            string lng = "en";
            try
            {



                lng = Request.HttpContext.Request.Headers["lng"];



            }
            catch
            {
                return lng;
            }
            return lng;
        }
        public string aggiustaqueryTransact(List<string> query, bool serializabile = true)
        {


            string q = "";
            if (query.Count > 1)
            {


                q = aggiustaqueryforransaction(query);
                q = aggiungitransaction(q, serializabile);
                q = q.Replace((char)13, (char)32);
            }

            return q;
        }
        public string removeSpecialCharacters(string str)
        {
            StringBuilder sb = new StringBuilder();
            foreach (char c in str)
            {
                if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '.' || c == '_')
                {
                    sb.Append(c);
                }
            }
            return sb.ToString();
        }
        public string aggiungitransaction(string query, bool serializabile = false)
        {

            string inizio = "DECLARE @ErrorMessage NVARCHAR(4000);   DECLARE @ErrorSeverity INT; DECLARE @ErrorState INT;   BEGIN TRY BEGIN  TRANSACTION ";
            if (serializabile)
            {
                inizio += "update bloccoquery set lock = " + apic(CreatePassword(5)) + ";";
            }
            string fine = " COMMIT END TRY BEGIN CATCH ROLLBACK TRAN SELECT @ErrorMessage = ERROR_MESSAGE(), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE(); RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState ); END CATCH";

            string risposta = inizio + query + fine;
            return risposta;


        }

        public string aggiustaqueryforransaction(List<string> listaquery)
        {

            string risposta = "";
            // string constat = (char)13 + " Select @X = @@Error Where @@Error >0" + (char)13;
            string constat = "";
            if (listaquery.Count > 1)
            {
                for (int i = 0; i < listaquery.Count; i++)
                {

                    listaquery[i] = listaquery[i] + constat;
                    risposta = risposta + listaquery[i];
                }
            }
            else
            {
                risposta = listaquery[0] + " " + constat;
            }

            return risposta;

        }


        public string covertDataItToTime(string data, string separatori = "")
        {
            try
            {
                var split = data.Split('/');
                return split[2] + separatori + split[1] + separatori + split[0];


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }


        }
        public string convertDate(string dat)
        {
            var d = dat.Replace("00:00:00", "");
            var a = d.Split('/');
            return a[2].Trim() + '-' + a[0] + '-' + a[1];
        }


        public bool checkdateBeforeNow(string dateita, string time)
        {


            string[] da = dateita.Split("/");
            string dataStringa = da[2] + "-" + da[1] + "-" + da[0] + "T" + time;
            DateTime data;

            if (DateTime.TryParse(dataStringa, out data))
            {
                if (data <= DateTime.Now)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            return false;


        }
        
        public string dateToString(DateTime date, string tipo, string divisore)
        {
            string a = date.ToString().Substring(0, 10);
            var b = a.Split('/');
            var giorno = b[0];
            var mese = b[1];
            var anno = b[2];
            if (tipo.ToLower() == "time")
            {
                return anno + divisore + mese + divisore + giorno;
            }
            else if (tipo.ToLower() == "uk")
            {
                return mese + divisore + giorno + divisore + anno;
            }
            else if (tipo.ToLower() == "it")
            {
                return giorno + divisore + mese + divisore + anno;
            }
            return date.ToString().Substring(0, 9);



        }
        public string getTemplateMail(string titolo, string testo, string img, string link, string button, string lng = "it")
        {

            titolo = titolo.Replace('"', '\"');
            testo = testo.Replace('"', '\"');
            link = link.Replace('"', '\"');
            button = button.Replace('"', '\"');

            string btn = "";
            if (!isEmpty(button))
            {
                btn = "<center><a href=\"" + link + "\" class=\"btn-primary\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 0.9rem; text-transform: capitalize; background-color: #ec2a7a; margin: 0; border-color: #ec2a7a; border-style: solid; border-width: 10px 20px;\">" + button + "</a></center>  ";
            }
            string qr = "";
            if (!isEmpty(img))
            {
                qr = "<center>  <img src=\"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + img + "\" />                    </center>    ";
            }


            TraduzioniController traduzioni = new TraduzioniController();
            string piva = traduzioni.traduci("email_nomeSocieta", lng) + "<br> " + traduzioni.traduci("email_sede", lng) + "<br> " + traduzioni.traduci("email_piva", lng);
            piva = piva.Replace('"', '\"');
            string tel = traduzioni.traduci("email_numero", lng).Replace('"', '\"');

            string t = "<html xmlns=\"http://www.w3.org/1999/xhtml\" style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\"><head>  <meta name=\"viewport\" content=\"width=device-width\" />  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />  <title>Alerts e.g. approaching your limit</title>  <style type=\"text/css\">    img {    max-width: 100%;    }    body {    -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em;    }    body {    background-color: rgba(112, 112, 112, 0.17);      color:#707070;    }    @media only screen and (max-width: 640px) {      body {        padding: 0 !important;      }      h1 {        font-weight: 800 !important; margin: 20px 0 5px !important;      }      h2 {        font-weight: 800 !important; margin: 20px 0 5px !important;      }      h3 {        font-weight: 800 !important; margin: 20px 0 5px !important;      }      h4 {        font-weight: 800 !important; margin: 20px 0 5px !important;      }      h1 {        font-size: 22px !important;      }      h2 {        font-size: 18px !important;      }      h3 {        font-size: 16px !important;      }      .container {        padding: 0 !important; width: 100% !important;      }      .content {        padding: 0 !important;      }      .content-wrap {        padding: 10px !important;      }      .invoice {        width: 100% !important;      }    }    .button{      border-radius:0.9rem             }  </style></head><body itemscope itemtype=\"http://schema.org/EmailMessage\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;\"bgcolor=\"#f6f6f6\">  <table class=\"body-wrap\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;\" bgcolor=\"#f6f6f6\">    <tr style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">      <td style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>      <td class=\"container\" width=\"600\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\"      valign=\"top\">        <div class=\"content\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">          <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"" +
            "style=\"font-famf60ily: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 0.9rem; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;\"          bgcolor=\"#fff\">            <tr style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">              <td class=\"alert alert-warning\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 16px; vertical-align: top; color: #fff; font-weight: 500; text-align: center; border-radius: 0.9rem 0.9rem 0 0; background-color: #ec2a7a; margin: 0; padding: 20px;\"              align=\"center\" bgcolor=\"#FF9F00\" valign=\"top\">                <img  src=\"" + webSite + imgMail + "\" width=\"154\" heigth=\"17\" />              </td>            </tr>            <tr style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">              <td class=\"content-wrap\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;\" valign=\"top\"> " +
            "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">                  <tr style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">                    <td class=\"content-block\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">                    " + titolo + "                  </td>                  </tr>                  <tr style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">                    <td class=\"content-block\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">            " + testo + "        <br>                                               " + qr + "                </td>                  </tr>                                    <tr style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">                    <td class=\"content-block\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">                      " + btn + "                  </td>                  </tr>                  <tr style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">                                     <td class=\"content-block\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">                                          </td>                  </tr>                </table>              </td>            </tr>          </table>          <div class=\"footer\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;\">            <table width=\"100%\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">              <tr style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">                <td class=\"aligncenter content-block\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;\" align=\"center\"                valign=\"top\">                " + piva + "			  <br>                  <a href=\"tel: " + tel + "\">" + tel + "</a>              </tr>            </table>          </div>        </div>      </td>      <td style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>    </tr>  </table></body></html>";
            return t;

        }

        public float getDistanceKm(string lat1s, string lon1s, string lat2s, string lon2s)
        {
            try
            {
                // R: raggio della terra (paragonabile ad una sfera) in chilometri


                log(lat1s, "mapslat", "maps");
                float lat1 = float.Parse(lat1s, CultureInfo.InvariantCulture);
                log(lat1.ToString(), "mapslatfloat", "maps");
                float lon1 = float.Parse(lon1s, CultureInfo.InvariantCulture);
                float lat2 = float.Parse(lat2s, CultureInfo.InvariantCulture);
                float lon2 = float.Parse(lon2s, CultureInfo.InvariantCulture);

                var R = 6371;

                var deltaLat = degreeToRadians(lat2 - lat1);
                var deltaLon = degreeToRadians(lon2 - lon1);

                lat1 = degreeToRadians(lat1);
                lat2 = degreeToRadians(lat2);

                var a = Math.Sin(deltaLat / 2) * Math.Sin(deltaLat / 2) +
                    Math.Cos(lat1) * Math.Cos(lat2) * Math.Sin(deltaLon / 2) * Math.Sin(deltaLon / 2);

                var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
                var d = R * c;

                return Convert.ToSingle(d);
            }
            catch (Exception ex)
            {
                log(ex.Message, "getdistance", "maps");
            }
            return float.Parse("0,0");

        }
        public float degreeToRadians(float value)
        {
            double ris = value * Math.PI / 180;
            return Convert.ToSingle(ris);
        }
        public string getGiorno(DateTime data)
        {
            try
            {
                switch (data.DayOfWeek)
                {
                    case DayOfWeek.Monday:

                        return "Lunedi";


                    case DayOfWeek.Tuesday:
                        return "Martedi";



                    case DayOfWeek.Wednesday:
                        return "Mercoledi";


                    case DayOfWeek.Thursday:
                        return "Giovedi";



                    case DayOfWeek.Friday:
                        return "Venerdi";



                    case DayOfWeek.Saturday:
                        return "Sabato";


                    case DayOfWeek.Sunday:
                        return "Domenica";



                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return "";
        }

    }

}
