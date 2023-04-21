using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Linq;
using System.Collections.Generic;
using RestSharp;

namespace core.Controllers
{


    [ApiController]
    [Route("[controller]")]
    public class webhookController : FunzioniAggiuntive
    {

        public void elimina(string id)
        {
            response ris3 = esegui("Select * from sessioniPagamenti where paypal = " + apic(id) + " and inCorso = 0");


            if (!IsDataTableEmpty(ris3.data))
            {

                var ticket = ris3.data.Rows[0]["ticket"].ToString();

                esegui("update  intinerariAcquistati set rimborsato = 1 where riferimento = " + apic(ticket));
                esegui("update  bigliettiAcquistati set rimborsato = 1 where riferimento = " + apic(ticket));
                esegui("delete from acquisti where riferimento = " + apic(ticket));
                esegui("Update sessioniPagamenti set inCorso = 999 where guid = " + apic(ris3.data.Rows[0]["guid"]));
            }
        }

        [HttpPost]
        public void post([FromBody] dynamic data)
        {

            log("dati ricevuti", "webhook", "webook");
            string json2 = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            log(json2, "webhook", "webook" + DateTime.Now.ToString("yyyyMMdd"));

            if (!isEmpty(data))
            {
                if (!isEmpty(data["event_type"]))
                {
                    if (data["event_type"] == "CHECKOUT.ORDER.APPROVED")
                    {
                        var id = data["resource"]["id"].ToString();
                        response ris = esegui("Select * from sessioniPagamenti where paypal = " + apic(id) + " and inCorso = 0");
                        if (!IsDataTableEmpty(ris.data))
                        {

                            string json = ris.data.Rows[0]["json"].ToString();
                            dynamic dati = Newtonsoft.Json.JsonConvert.DeserializeObject(json);
                            int codice = inserisciAcquisto(dati, ris.data.Rows[0]["guid"], "Paypal", ris.data.Rows[0]["lng"], ris.data.Rows[0]["ticket"]);
                            if (codice == 100)
                            {

                                paypalController p = new paypalController();
                                string token = p.getPayPaltoken();
                                var url2 = "https://api.sandbox.paypal.com/v2/checkout/orders/" + id + "/capture";
#if RELEASE
                                        url2 = "https://api.paypal.com/v2/checkout/orders/" + id + "/capture";
#endif

                                var client6 = new RestClient(url2);
                                client6.Timeout = -1;
                                var request6 = new RestRequest(Method.POST);

                                request6.AddHeader("Content-Type", "application/json");
                                request6.AddHeader("Authorization", "Basic " + token); var body = @"";
                                request6.AddParameter("application/json", body, ParameterType.RequestBody);
                                IRestResponse response6 = client6.Execute(request6);
                                dynamic jsonObject = JsonConvert.DeserializeObject(response6.Content);

                                if (!isEmpty(response6.Content))
                                {

                                    if (jsonObject.ContainsKey("id") && jsonObject.ContainsKey("status"))
                                    {


                                        var a = jsonObject["status"].ToString();
                                        if (a == "COMPLETED")
                                        {
                                            response ris2 = esegui("Select * from sessioniPagamenti where paypal = " + apic(id) + " and inCorso = 0");
                                            List<string> listaDateNotifica = new List<string>();




                                            if (!IsDataTableEmpty(ris2.data))
                                            {
                                                esegui("Update sessioniPagamenti set inCorso = 7 where guid = " + apic(ris2.data.Rows[0]["guid"]));
                                                TraduzioniController traduzioni = new TraduzioniController();
                                                var backup = Newtonsoft.Json.JsonConvert.DeserializeObject(ris2.data.Rows[0]["json"].ToString());
                                                var email = backup["email"].ToString();
                                                var codiceBiglietto = ris2.data.Rows[0]["ticket"].ToString();
                                                var lng = ris2.data.Rows[0]["lng"].ToString();
                                                for (var i = 0; i < backup["elementi"].Count; i++)
                                                {
                                                    listaDateNotifica.Add(backup["elementi"][i]["data"].ToString());
                                                }

                                                string acquistoMail = "E'stato acquistato un biglietto con il seguente codice: " + codiceBiglietto + "<br>" + "nelle seguenti date:<br>";
                                                for (int i = 0; i < listaDateNotifica.Count; i++)
                                                {
                                                    acquistoMail += listaDateNotifica[i] + "<br>";
                                                }
                                                acquistoMail += "<a href='" + webSite + "/checkticket/" + codiceBiglietto + "'>Clicca qui per maggiori informazioni</a>";
                                                notificaGruppo("Notifica d'acquisto - piattaforma " + nomeSito, acquistoMail, "0", "9");


                                                mail newMail = new mail();
                                                newMail.oggetto = nomeSito + " | " + traduzioni.traduci("mail_oggetto", getLng()) + " cod. " + codiceBiglietto;
                                                string test = traduzioni.traduci("mail_testoAcquisto", getLng());
                                                newMail.testo = getTemplateMail(nomeSito + " | " + traduzioni.traduci("mail_oggetto", getLng()) + " cod. " + codiceBiglietto,
                                                test, webSite + "/checkticket/" + codiceBiglietto, webSite + "/checkticket/" + codiceBiglietto, traduzioni.traduci("mail_btn_vediBiglietto", getLng()), lng);
                                                newMail.destinatario = email;
                                                //newMail.destinatario = "polacarminempc@gmail.com";

                                                sendMail(newMail, "NOREPLY", codiceBiglietto);

                                                return;

                                            }

                                        }

                                    }


                                }



                            }
                            else
                            {
                                esegui("Update sessioniPagamenti set inCorso = " + apic(codice.ToString()) + " where guid = " + apic(ris.data.Rows[0]["guid"]));
                                return;
                            }
                            elimina(id);
                        }
                    }
                }

                else if (data["event_type"] == "PAYMENT.CAPTURE.DECLINED" || data["event_type"] == "PAYMENT.CAPTURE.DENIED" || data["event_type"] == "PAYMENT.CAPTURE.REFUNDED" || data["event_type"] == "PAYMENT.CAPTURE.REVERSED")
                {

                    //qua annulli il biglietto acquistato ma non pagato e lo elimini
                    var id = data["resource"]["supplementary_data"]["related_ids"]["order_id"].ToString();
                    response ris3 = esegui("Select * from sessioniPagamenti where paypal = " + apic(id) + " and inCorso = 0");


                    if (!IsDataTableEmpty(ris3.data))
                    {

                        var ticket = ris3.data.Rows[0]["ticket"].ToString();

                        esegui("update  intinerariAcquistati set rimborsato = 1 where riferimento = " + apic(ticket));
                        esegui("update  bigliettiAcquistati set rimborsato = 1 where riferimento = " + apic(ticket));
                        esegui("delete from acquisti where riferimento = " + apic(ticket));
                        esegui("Update sessioniPagamenti set inCorso = 999 where guid = " + apic(ris3.data.Rows[0]["guid"]));
                    }
                }
            }
        }


    }
    


}

