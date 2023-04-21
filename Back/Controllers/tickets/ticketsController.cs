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
    public class ticketsController : FunzioniAggiuntive
    {

        TraduzioniController traduzioni = new TraduzioniController();
        [HttpGet, ActionName("getTicketFromMail"), Route("getTicketFromMail")]
        public response getTicketFromMail(string email)
        {
            response ris = new response();
            try
            {


                string q = "Select riferimento,[data] from acquisti where email =" + apic(email);
                ris = esegui(q);
                if (!IsDataTableEmpty(ris.data))
                {
                   
                    return ris;
                }
                else
                {
                    tentativoDiAcquisto(getIp());
                }



            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpGet, ActionName("getTickets"), Route("getTickets")]
        public response getTickets(string id)
        {
            response ris = new response();
            try
            {


                string q = "Select Distinct(a.riferimento),a.idfascia,a.idlinea,a.rimborsato,a.data,b.nome,c.idfasciaoraria from intinerariAcquistati as a left join linee as b on a.idlinea = b.id left join fasceOrarie as c on a.idfascia = c.guid   where  a.riferimento =" + apic(id);
                ris = esegui(q);
                if (!IsDataTableEmpty(ris.data))
                {
                    ris.data.Columns.Add("biglietti", typeof(DataTable));
                    ris.data.Columns.Add("itinerari", typeof(DataTable));
                    ris.data.Columns.Add("dati", typeof(DataTable));
                    ris.data.Columns.Add("traduzioniNome", typeof(DataTable));
                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {

                        DataRow row = ris.data.Rows[i];
                        var idFascia = row["idfascia"].ToString();
                        var idLinea = row["idlinea"].ToString();
                        var riferimento = row["riferimento"].ToString();

                        var dataRiferimento = convertDate(row["data"].ToString());
                        var nome = ris.data.Rows[i]["nome"];
                        ris.data.Rows[i]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["nome"].ToString());


                        q = "SELECT * FROM bigliettiacquistati LEFT JOIN biglietti ON biglietti.id = bigliettiacquistati.idbiglietto WHERE"
                        + " riferimento = " + apic(riferimento) + " AND idfascia = " + apic(idFascia) + "AND idlinea = " + apic(idLinea) + "and data =" + apic(dataRiferimento);
                        
                        response biglietti = esegui(q);
                        biglietti.data.Columns.Add("traduzioniNome", typeof(DataTable));
                        biglietti.data.Columns.Add("traduzioniDesc", typeof(DataTable));
                        for (var ii = 0; ii < biglietti.data.Rows.Count; ii++)
                        {
                            biglietti.data.Rows[ii]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(biglietti.data.Rows[ii]["nome"].ToString());
                            biglietti.data.Rows[ii]["traduzioniDesc"] = traduzioni.getTraduzioniPrivate(biglietti.data.Rows[ii]["descrizione"].ToString());
                        }
                        q = "SELECT * FROM intinerariacquistati LEFT JOIN fermate ON intinerariacquistati.idfermata = fermate.id LEFT JOIN fasceOrarie on intinerariAcquistati.idlinea = fasceOrarie.idlinea and intinerariAcquistati.idfascia = fasceOrarie.guid and intinerariAcquistati.idfermata = fasceOrarie.idFermata where intinerariacquistati.riferimento = " + apic(riferimento) + " and intinerariacquistati.idfascia=" + apic(idFascia) + " and intinerariacquistati.idlinea = " + apic(idLinea);
                        response intinerariAcquistati = esegui(q);
                        intinerariAcquistati.data.Columns.Add("traduzioniNome", typeof(DataTable));
                        for (var ii = 0; ii < intinerariAcquistati.data.Rows.Count; ii++)
                        {
                            DataRow rowItinerario = intinerariAcquistati.data.Rows[ii];
                            intinerariAcquistati.data.Rows[ii]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(intinerariAcquistati.data.Rows[ii]["citta"].ToString());
                        }

                        ris.data.Rows[i]["itinerari"] = intinerariAcquistati.data;
                        ris.data.Rows[i]["biglietti"] = biglietti.data;
                    }
                }
                else
                {
                    tentativoDiAcquisto(getIp());
                }



            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpGet, ActionName("getTicketsShort"), Route("getTicketsShort")]
        public response getTicketsShort(string id)
        {
            response ris = new response();
            try
            {
                if (isValidSession() && getRuolo() < 10)
                {
                    string q = "Select Distinct(a.riferimento),a.idfascia,a.idlinea,a.rimborsato,a.data,b.nome,c.idfasciaoraria from intinerariAcquistati as a left join linee as b on a.idlinea = b.id left join fasceOrarie as c on a.idfascia = c.guid  where a.riferimento = " + apic(id) + " order by a.[data] DESC;";
                    ris = esegui(q);
                    if (!IsDataTableEmpty(ris.data))
                    {
                        ris.data.Columns.Add("biglietti", typeof(DataTable));
                        ris.data.Columns.Add("itinerari", typeof(DataTable));
                        ris.data.Columns.Add("dati", typeof(DataTable));
                        ris.data.Columns.Add("traduzioniNome", typeof(DataTable));
                        for (var i = 0; i < ris.data.Rows.Count; i++)
                        {

                            DataRow row = ris.data.Rows[i];
                            var idFascia = row["idfascia"].ToString();
                            var idLinea = row["idlinea"].ToString();
                            var riferimento = row["riferimento"].ToString();
                            var nome = ris.data.Rows[i]["nome"];
                            ris.data.Rows[i]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["nome"].ToString());
                            var dataRiferimento = convertDate(row["data"].ToString());

                            q = "SELECT * FROM bigliettiacquistati LEFT JOIN biglietti ON biglietti.id = bigliettiacquistati.idbiglietto WHERE"
                            + " riferimento = " + apic(riferimento) + " AND idfascia = " + apic(idFascia) + "AND idlinea = " + apic(idLinea)+ "and data =" + apic(dataRiferimento);;
                            response biglietti = esegui(q);
                            biglietti.data.Columns.Add("traduzioniNome", typeof(DataTable));
                            biglietti.data.Columns.Add("traduzioniDesc", typeof(DataTable));
                            for (var ii = 0; ii < biglietti.data.Rows.Count; ii++)
                            {
                                biglietti.data.Rows[ii]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(biglietti.data.Rows[ii]["nome"].ToString());
                                biglietti.data.Rows[ii]["traduzioniDesc"] = traduzioni.getTraduzioniPrivate(biglietti.data.Rows[ii]["descrizione"].ToString());
                            }
                            q = "SELECT * FROM intinerariacquistati LEFT JOIN fermate ON intinerariacquistati.idfermata = fermate.id LEFT JOIN fasceOrarie on intinerariAcquistati.idlinea = fasceOrarie.idlinea and intinerariAcquistati.idfascia = fasceOrarie.guid and intinerariAcquistati.idfermata = fasceOrarie.idFermata where intinerariacquistati.riferimento = " + apic(riferimento) + " and intinerariacquistati.idfascia=" + apic(idFascia) + " and intinerariacquistati.idlinea = " + apic(idLinea);
                            response intinerariAcquistati = esegui(q);
                            intinerariAcquistati.data.Columns.Add("traduzioniNome", typeof(DataTable));
                            for (var ii = 0; ii < intinerariAcquistati.data.Rows.Count; ii++)
                            {
                                DataRow rowItinerario = intinerariAcquistati.data.Rows[ii];
                                intinerariAcquistati.data.Rows[ii]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(intinerariAcquistati.data.Rows[ii]["citta"].ToString());
                            }
                            response dati = esegui("Select acquisti.*,utenti.nomeUtente from acquisti left join utenti on utenti.id = acquisti.reseller where riferimento = " + apic(riferimento));
                            ris.data.Rows[i]["dati"] = dati.data;
                            ris.data.Rows[i]["itinerari"] = intinerariAcquistati.data;
                            ris.data.Rows[i]["biglietti"] = biglietti.data;
                        }
                    }

                }


            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpGet]
        public response get(string giorno)
        {
            response ris = new response();
            try
            {
                if (isValidSession() && getRuolo() < 10 && !isEmpty(giorno))
                {

                    string[] dataSearch = giorno.Split("-");
                    //string q = "Select Distinct(riferimento), [data] from intinerariAcquistati  order by [data] DESC";
                    //return esegui(q);
                    string q = "Select Distinct(a.riferimento),a.idfascia,a.idlinea,a.rimborsato,a.data,b.nome,c.idfasciaoraria from intinerariAcquistati as a left join linee as b on a.idlinea = b.id left join fasceOrarie as c on a.idfascia = c.guid   where MONTH([data]) = " + apic(dataSearch[1]) + " and YEAR([data]) = " + apic(dataSearch[0]) + " order by a.[data] DESC;";
                    ris = esegui(q);
                    if (!IsDataTableEmpty(ris.data))
                    {
                        ris.data.Columns.Add("biglietti", typeof(DataTable));
                        ris.data.Columns.Add("itinerari", typeof(DataTable));
                        ris.data.Columns.Add("dati", typeof(DataTable));
                        ris.data.Columns.Add("traduzioniNome", typeof(DataTable));
                        for (var i = 0; i < ris.data.Rows.Count; i++)
                        {

                            DataRow row = ris.data.Rows[i];
                            var idFascia = row["idfascia"].ToString();
                            var idLinea = row["idlinea"].ToString();
                            var riferimento = row["riferimento"].ToString();
                            var nome = ris.data.Rows[i]["nome"];
                            ris.data.Rows[i]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["nome"].ToString());
                                var dataRiferimento = convertDate(row["data"].ToString());


                            q = "SELECT * FROM bigliettiacquistati LEFT JOIN biglietti ON biglietti.id = bigliettiacquistati.idbiglietto WHERE"
                            + " riferimento = " + apic(riferimento) + " AND idfascia = " + apic(idFascia) + "AND idlinea = " + apic(idLinea)+ "and data =" + apic(dataRiferimento);;
                            response biglietti = esegui(q);
                            biglietti.data.Columns.Add("traduzioniNome", typeof(DataTable));
                            biglietti.data.Columns.Add("traduzioniDesc", typeof(DataTable));
                            for (var ii = 0; ii < biglietti.data.Rows.Count; ii++)
                            {
                                biglietti.data.Rows[ii]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(biglietti.data.Rows[ii]["nome"].ToString());
                                biglietti.data.Rows[ii]["traduzioniDesc"] = traduzioni.getTraduzioniPrivate(biglietti.data.Rows[ii]["descrizione"].ToString());
                            }
                            q = "SELECT * FROM intinerariacquistati LEFT JOIN fermate ON intinerariacquistati.idfermata = fermate.id LEFT JOIN fasceOrarie on intinerariAcquistati.idlinea = fasceOrarie.idlinea and intinerariAcquistati.idfascia = fasceOrarie.guid and intinerariAcquistati.idfermata = fasceOrarie.idFermata where intinerariacquistati.riferimento = " + apic(riferimento) + " and intinerariacquistati.idfascia=" + apic(idFascia) + " and intinerariacquistati.idlinea = " + apic(idLinea);
                            response intinerariAcquistati = esegui(q);
                            intinerariAcquistati.data.Columns.Add("traduzioniNome", typeof(DataTable));
                            for (var ii = 0; ii < intinerariAcquistati.data.Rows.Count; ii++)
                            {
                                DataRow rowItinerario = intinerariAcquistati.data.Rows[ii];
                                intinerariAcquistati.data.Rows[ii]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(intinerariAcquistati.data.Rows[ii]["citta"].ToString());
                            }
                            response dati = esegui("Select acquisti.*,utenti.nomeUtente from acquisti left join utenti on utenti.id = acquisti.reseller where riferimento = " + apic(riferimento));
                            ris.data.Rows[i]["dati"] = dati.data;
                            ris.data.Rows[i]["itinerari"] = intinerariAcquistati.data;
                            ris.data.Rows[i]["biglietti"] = biglietti.data;
                        }
                    }

                }

            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpPut]
        public response put(string riferimento, string idFascia, string idLinea, string data)
        {
            response ris = new response();
            try
            {
                if (isValidSession() && getRuolo() < 10)
                {
                  

                        List<string> q = new List<string>();
                        q.Add("update  intinerariAcquistati set rimborsato = 1 where riferimento = " + apic(riferimento) + " and idFascia = " + apic(idFascia) + " and idlinea = " + apic(idLinea));
                        q.Add("update  bigliettiAcquistati set rimborsato = 1 where riferimento = " + apic(riferimento) + " and idFascia = " + apic(idFascia) +" and idlinea = " + apic(idLinea));
                        ris = eseguiTransact(q);

 

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

