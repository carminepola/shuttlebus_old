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
    public class dashboardController : FunzioniAggiuntive
    {

        TraduzioniController traduzioni = new TraduzioniController();

        [HttpGet]
        public response get(string giorno)
        {
            response ris = new response();
            try
            {
                if (isValidSession() && !isEmpty(giorno))
                {
                    response linee = esegui("select distinct(a.idlinea), b.nome from [intinerariAcquistati] as a left join linee as b on a.idlinea = b.id where rimborsato = 0 and a.data = " + apic(giorno));
                    if (!IsDataTableEmpty(linee.data))
                    {
                        linee.data.Columns.Add("traduzioniCitta", typeof(DataTable));
                        linee.data.Columns.Add("fasce", typeof(DataTable));
                        for (var i = 0; i < linee.data.Rows.Count; i++)
                        {
                            linee.data.Rows[i]["traduzioniCitta"] = traduzioni.getTraduzioniPrivate(linee.data.Rows[i]["nome"].ToString());
                            //costruisci Fascia
                            response fasce = esegui("select [fasceOrarie].*, fermate.citta,fermate.indirizzo from [fasceOrarie] left join fermate on [fasceOrarie].idFermata = [fermate].id  where idlinea = " + apic(linee.data.Rows[i]["idlinea"].ToString()) + " and guid in (select idfascia from intinerariAcquistati where data = " + apic(giorno) + ")");
                            fasce.data.Columns.Add("traduzioniFermata", typeof(DataTable));

                            fasce.data.Columns.Add("postiTotali", typeof(DataTable));
                            fasce.data.Columns.Add("dati", typeof(DataTable));


                            for (var ii = 0; ii < fasce.data.Rows.Count; ii++)
                            {
                                var idfascia = fasce.data.Rows[ii]["idfasciaoraria"].ToString();
                                //conta posti per fascia
                                response postiTot = esegui("Select isnull(Max(posti),0) AS totposti, isnull(Max(bagagliopzionali),0) AS totbagagli from settingfasciaoraria WHERE idlinea = " + apic(linee.data.Rows[i]["idlinea"].ToString()) + " AND idfasciaoraria =" + apic(idfascia));
                                var totposti = postiTot.data.Rows[0]["totposti"].ToString();
                                var totbagagli = postiTot.data.Rows[0]["totbagagli"].ToString();



                                fasce.data.Rows[ii]["traduzioniFermata"] = traduzioni.getTraduzioniPrivate(fasce.data.Rows[ii]["citta"].ToString());
                                var q = "select isnull(sum(a.posti),0) as posti, isnull(sum(a.bagagliOpzionali),0) as bagagli from [intinerariAcquistati] as a where a.idlinea = " + apic(fasce.data.Rows[ii]["idlinea"].ToString()) + " and a.idFascia =" + apic(fasce.data.Rows[ii]["guid"].ToString()) + " and a.data=" + apic(giorno) + "  and a.idFermata = " + apic(fasce.data.Rows[ii]["idFermata"].ToString()) + " and a.rimborsato = 0";
                                response posti = esegui(q);


                                posti.data.Columns.Add("totposti", typeof(String));
                                posti.data.Columns.Add("totbagagli", typeof(String));
                                posti.data.Columns.Add("postiDisponibili", typeof(int));
                                posti.data.Columns.Add("bagagliDisponibili", typeof(int));
                                posti.data.Rows[0]["totposti"] = totposti;
                                posti.data.Rows[0]["totbagagli"] = totbagagli;

                                posti.data.Rows[0]["postiDisponibili"] = int.Parse(totposti) - int.Parse(posti.data.Rows[0]["posti"].ToString());
                                posti.data.Rows[0]["bagagliDisponibili"] = int.Parse(totbagagli) - int.Parse(posti.data.Rows[0]["bagagli"].ToString());

                                //response posti = esegui("select sum(posti) as posti, sum(bagagliOpzionali) as bagagli from [intinerariAcquistati]  where idlinea = " + apic(fasce.data.Rows[ii]["idlinea"].ToString()) + " and idFascia =" + apic(fasce.data.Rows[ii]["guid"].ToString()) + "and data=" + apic(giorno) + " and idFermata = " + apic(fasce.data.Rows[ii]["idFermata"].ToString()));
                                // response dati = esegui("select * from[intinerariAcquistati] left join[acquisti] on[intinerariAcquistati].riferimento = [acquisti].riferimento where idlinea =" + apic(fasce.data.Rows[ii]["idlinea"].ToString()) + " and idFascia = " + apic(fasce.data.Rows[ii]["guid"].ToString()) + " and idFermata = " + apic(fasce.data.Rows[ii]["idFermata"].ToString()) + " and[intinerariAcquistati].data = " + apic(giorno));

                                fasce.data.Rows[ii]["postiTotali"] = posti.data;
                                // dati.data.Columns.Add("Biglietti", typeof(DataTable));
                                /* for (var iii = 0; iii < dati.data.Rows.Count; iii++)
                                 {
                                     response biglietti = esegui("Select * from bigliettiAcquistati left join biglietti on bigliettiAcquistati.idBiglietto = biglietti.id where riferimento = " + apic(dati.data.Rows[iii]["riferimento"].ToString()) + "and idFascia = " + apic(dati.data.Rows[iii]["idfascia"].ToString()) + " and data = " + apic(giorno) + " and idLinea = " + apic(dati.data.Rows[iii]["idlinea"].ToString()) + "; ");
                                     biglietti.data.Columns.Add("traduzioniNome", typeof(DataTable));
                                     for (var iiii = 0; iiii < biglietti.data.Rows.Count; iiii++)
                                     {
                                         biglietti.data.Rows[iiii]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(biglietti.data.Rows[iiii]["nome"].ToString());
                                     }
                                     dati.data.Rows[iii]["biglietti"] = biglietti.data;
                                 }
                                 fasce.data.Rows[ii]["dati"] = dati.data;*/

                            }
                            linee.data.Rows[i]["fasce"] = fasce.data;
                        }
                    }
                    ris = linee;
                }
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }


        public bool controlloPagamento(dynamic data)
        {
            try
            {
                if (!isEmpty(data))
                {
                    float tot = 0;
                    var a = data["prezzo"].ToString();
                    float prezzo = float.Parse(a);
                    for (var i = 0; i < data["elementi"].Count; i++)
                    {
                        if (int.Parse(data["elementi"][i]["datiBiglietto"]["numeroBagagliOpzionali"].ToString()) > 0)
                        {
                            response bagaglioOpzionale = esegui("Select * from settingFasciaOraria where idLinea =" + apic(data["elementi"][i]["datiBiglietto"]["idlinea"].ToString()) + " and idFasciaOraria =" + apic(data["elementi"][i]["datiBiglietto"]["idfasciaoraria"].ToString()));
                            float prezzoBagaglioOpzionale = float.Parse(bagaglioOpzionale.data.Rows[0]["prezzoBagagli"].ToString());
                            tot += prezzoBagaglioOpzionale * int.Parse(data["elementi"][i]["datiBiglietto"]["numeroBagagliOpzionali"].ToString());

                        }
                        for (var j = 0; j < data["elementi"][i]["datiBiglietto"]["biglietti"].Count; j++)
                        {
                            int numero = int.Parse(data["elementi"][i]["datiBiglietto"]["biglietti"][j]["numero"].ToString());
                            if (numero > 0)
                            {
                                float prezzoBiglietto = 0;
                                response costoBiglietto = esegui("Select * from biglietti where id =" + apic(data["elementi"][i]["datiBiglietto"]["biglietti"][j]["id"].ToString()));
                                if (IsDataTableEmpty(costoBiglietto.data))
                                {
                                    return false;
                                }
                                else
                                {
                                    prezzoBiglietto = float.Parse(costoBiglietto.data.Rows[0]["costo"].ToString());
                                }

                                tot += prezzoBiglietto * numero;

                            }

                        }


                    }
                    if (tot == prezzo)
                    {
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
            return false;
        }
        [HttpPut]
        public response put([FromBody] dynamic data)
        {

            response ris = new response();
            try
            {
                if (ipBloccato(getIp()))
                {

                    return ris;
                }
                else
                {
                    tentativoDiAcquisto(getIp());
                }

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

        // [HttpPatch]
        // public response patch(string id)
        // {
        //     response ris = new response();
        //     ris.data = "ko";
        //     try
        //     {
        //         if (isValidSession() && getRuolo() <= 20)
        //         {

        //             response check = esegui("Select * from acquisti where sessione = " + apic(id));
        //             if (IsDataTableEmpty(check.data))
        //             {
        //                 response recupero = esegui("Select * from sessioniPagamenti where guid =" + apic(id));
        //                 if (IsDataTableEmpty(recupero.data))
        //                 {
        //                     throw new Exception(listaErrori[5]);
        //                 }
        //                 else
        //                 {
        //                     string json = recupero.data.Rows[0]["json"].ToString();
        //                     dynamic data = Newtonsoft.Json.JsonConvert.DeserializeObject(json);

        //                     inserisciAcquisto(data, id, "Reseller", getLng());
        //                     ris.error.message = "str_pagamentoriuscito";
        //                     ris.data = "ok";
        //                 }

        //             }
        //             else
        //             {
        //                 ris.error.message = "str_prodottogiapagato";
        //             }
        //         }
        //         else
        //         {
        //             throw new Exception(listaErrori[1]);
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         ris = catchError(ex.Message, ex.StackTrace);
        //         ris.data = "ko";
        //     }
        //     return ris;

        // }
    }
}

