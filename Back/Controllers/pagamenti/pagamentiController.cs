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
    public class pagamentiController : FunzioniAggiuntive
    {

        [HttpGet]
        public string checkAll()
        {

            try
            {



                // response ris = esegui("select * from sessioniPagamenti WHERE DATEDIFF(MINUTE,data,GetDate())>5 and inCorso < 2 ");

                // if (!IsDataTableEmpty(ris.data))
                // {
                //     for (var i = 0; i < ris.data.Rows.Count; i++)
                //     {
                //         if (!isEmpty(ris.data.Rows[i]["paypal"].ToString()))
                //         {
                //             paypalController paypal = new paypalController();
                //             paypal.controlloPagamento(ris.data.Rows[i]["guid"].ToString());
                //         }



                //     }

                // }

                // response daEliminare = esegui("select * from sessioniPagamenti WHERE DATEDIFF(MINUTE,data,GetDate())>=30 and inCorso = 0");
                // if (!IsDataTableEmpty(daEliminare.data))
                // {
                //     for (var i = 0; i < daEliminare.data.Rows.Count; i++)
                //     {
                //         if (!isEmpty(daEliminare.data.Rows[i]["paypal"].ToString()))
                //         {

                //             paypalController paypal = new paypalController();
                //             paypal.delete(daEliminare.data.Rows[i]["guid"].ToString(), daEliminare.data.Rows[i]["paypal"].ToString());


                //         }



                //     }

                // }





            }
            catch (Exception ex)
            {
                catchError(ex.Message, ex.StackTrace);
            }
            return "ok";
        }
        TraduzioniController traduzioni = new TraduzioniController();
        [HttpPost]
        public response get([FromBody] dynamic data, string sessionePagamento, string sessioneUtente)
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


                var paypalToken = "";
                var stripeToken = "";
                var a = data["prezzo"].ToString();
                if (!controlloPagamento(data))
                {
                    throw new Exception(listaErrori[5]);
                }

                log("nuovo pagamento " + sessionePagamento, sessionePagamento + DateTime.Now.ToString("yyyyMMdd"), sessioneUtente );

                response daEliminare = esegui("Select * from sessioniPagamenti where [usersession] = " + apic(sessioneUtente) + " and DATEDIFF(MINUTE,data,GetDate())<=300 and inCorso = 0 ");
                if (!IsDataTableEmpty(daEliminare.data))
                {
                    for (var i = 0; i < daEliminare.data.Rows.Count; i++)
                    {
                        if (!isEmpty(daEliminare.data.Rows[i]["paypal"].ToString()))
                        {

                            paypalController paypal = new paypalController();
                            log("eliminato " + daEliminare.data.Rows[i]["guid"].ToString(), daEliminare.data.Rows[i]["paypal"].ToString(), sessioneUtente + DateTime.Now.ToString("yyyyMMdd"));
                            paypal.delete(daEliminare.data.Rows[i]["guid"].ToString(), daEliminare.data.Rows[i]["paypal"].ToString());


                        }



                    }

                }



                var ticket = createTicketNumber(8);



                // esegui("Delete from sessioniPagamenti where guid = " + apic(sessionePagamento));
                ris = esegui("Select chiave from impostazioni where (chiave = 'paypal' or chiave = 'stripe') and valore != ''");
                if (getRuolo() < 10)
                {
                    DataRow row = ris.data.NewRow();
                    row["chiave"] = "private";
                    ris.data.Rows.Add(row);
                }
                ris.data.Columns.Add("link", typeof(String));
                for (var i = 0; i < ris.data.Rows.Count; i++)
                {
                    switch (ris.data.Rows[i]["chiave"].ToString())
                    {
                        case "private":
                            ris.data.Rows[i]["link"] = "pagamentoPrivato/";
                            break;
                        case "paypal":
                            paypalController pp = new paypalController();
                            List<string> ppString = new List<string>();
                            ppString = pp.get(a, sessionePagamento, ticket);
                            if (ppString.Count()>0)
                            {
                                paypalToken = ppString[0];
                                ris.data.Rows[i]["link"] = ppString[1];
                            }
                            break;

                    }
                }
                string json = Newtonsoft.Json.JsonConvert.SerializeObject(data);



                esegui("Insert into sessioniPagamenti (paypal,stripe,guid,json,data,prezzo,inCorso,lng,ticket,usersession) values(" + apicVirgola(paypalToken) + apicVirgola(stripeToken) + apicVirgola(sessionePagamento) + apicVirgola(json) + "GetDate()," + apicVirgola(a) + apicVirgola("0") + apicVirgola(getLng()) + apicVirgola(ticket) + apic(sessioneUtente) + " );");
                ris.error.message = sessionePagamento;
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

        [HttpPatch]
        public response patch(string id)
        {




            response ris = new response();
           
            ris.data = "ko";
            try
            {
                if (isValidSession() && getRuolo() <= 20)
                {

                    response check = esegui("Select * from acquisti where sessione = " + apic(id));
                    if (IsDataTableEmpty(check.data))
                    {
                        response recupero = esegui("Select * from sessioniPagamenti where guid =" + apic(id));
                        if (IsDataTableEmpty(recupero.data))
                        {
                            throw new Exception(listaErrori[5]);
                        }
                        else
                        {
                            string json = recupero.data.Rows[0]["json"].ToString();
                            dynamic data = Newtonsoft.Json.JsonConvert.DeserializeObject(json);


                            int codice = inserisciAcquisto(data, id, "Reseller", getLng(), recupero.data.Rows[0]["ticket"]);
                            if (codice == 100)
                            {
                                ris.error.message = traduzioni.traduci("str_pagamentoriuscito", getLng()) + "<br>" +  recupero.data.Rows[0]["ticket"];
                                ris.data = "ok";
                            }
                            else
                            {
                                ris.error.message = traduzioni.traduci("str_pagamento_non_rouscito", getLng())  ;
                                ris.data = "ok";
                            }

                        }

                    }
                    else
                    {
                        ris.error.message = "str_prodottogiapagato";
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
                ris.data = "ko";
            }
            return ris;

        }
    }
}

