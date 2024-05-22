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
    public class sellaController : FunzioniAggiuntive
    {
        TraduzioniController traduzioni = new TraduzioniController();

        public List<string> get(string nome, string email, string prezzo, string sessione, string code)
        {

            List<string> ris = new List<string>();
            try
            {



                string url = "https://sandbox.gestpay.net/api/v1/payment/create/";
                var site = "http://localhost:4200/checkpayment/stripe/" + code;
                var cancel = "http://localhost:4200/checkpayment/stripe/000000";
                var webhook = "https://webhook.site/9f87b96d-e113-477e-8764-24fc105bf22f";
                var negozio = "GESPAY96559";
#if RELEASE
                url = "https://ecomms2s.sella.it/api/v1/payment/create/";
                site = webSite+"/checkpayment/stripe/"+code;
                cancel = webSite+"/checkpayment/stripe/000000";
                webhook = webSite+"/webhook"
                negozio = "GESPAY96559";
#endif


                string token = getSellaToken();

                if (isEmpty(token))
                {
                    return ris;
                }




                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddHeader("Content-Type", "application/json");
                request.AddHeader("Authorization", "apikey " + token);


                //autoizhe
                // request.AddHeader("Authorization", "Basic QWVDZWNKWE5vTERPM1o4d29sMnpMUWZpcGNLSW1XeXNDdzJLS2NNak9yMEtNT25ld3lyTjlUczBMbVJhTkZHY1luemJnc0RwMEZVYmREVk86RUdobGtJMF9tSkU3T2p3TXhPVWp4TEltbHB4WDFmZXhQcFV0RWJFQkdWZHVWSWJ4akphaXduY29XTmxvcWlLa3pwWmJ2SXNhMEJUUkF6RzU=");
                // var json = "{\n  \"intent\": \"CAPTURE\",\n  \"application_context\": {\n    \"return_url\": \"" + site + "\",\n    \"cancel_url\": \"" + cancel + "\",\n    \"client_configuration\": {\n      \"integration_artifact\": \"PAYPAL_JS_SDK\",\n      \"experience\": {\n        \"user_experience_flow\": \"FULL_PAGE_REDIRECT\",\n        \"entry_point\": \"PAY_WITH_PAYPAL\",\n        \"channel\": \"WEB\",\n        \"product_flow\": \"HERMES\"\n      }\n    }\n    \n  },\n  \"purchase_units\": [\n    {\n      \"reference_id\": \"" + sessione + "\",\n      \"description\": \"" + sessione + "\",\n      \"amount\": {\n        \"currency_code\": \"EUR\",\n        \"value\": \"" + prezzo.ToString().Replace(',', '.') + "\"\n      }\n    }\n  ]\n}";
                string json = "{\"shopLogin\":\"" + negozio + "\",\"amount\":\"" + prezzo.ToString().Replace(',', '.') + "\",\"currency\":\"EUR\",\"shopTransactionID\":\"" + code + "\",\"buyerName\":\"" + nome + "\",\"buyerEmail\":\"" + email + "\",\"itemType\":\"digital\",\"ppSellerProtection\":1,\"customInfo\":{\"nome\":\"Biglietto non rimborsabile\"},\"responseURLs\":{\"buyerOK\":\"" + site + "\",\"buyerKO\":\"" + cancel + "\",\"serverNotificationURL\":\"" + webhook + "\"},\"paymentChannel\":{\"channelType\":[\"LINK\"],\"validityPeriod\":{\"validityStart\":{\"minutesFromNow\":0},\"validityEnd\":{\"minutesFromNow\":30}}}}";
                dynamic jsonx = JsonConvert.DeserializeObject(json);

                request.AddParameter("application/json", json, ParameterType.RequestBody);
                IRestResponse response = client.Execute(request);
                Console.WriteLine(response.Content);
                dynamic jsonObject = JsonConvert.DeserializeObject(response.Content);

                if (!isEmpty(response.Content))
                {
                    if (jsonObject["error"]["code"] == "0")
                    {

                        ris.Add(jsonObject["payload"]["paymentID"].ToString());
                        var a = jsonObject["payload"]["userRedirect"]["href"].ToString();
                        ris.Add(a);

                    }




                }

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            return ris;
        }

        public void Delete(string id)
        {
            try
            {




                //request.AddHeader("Content-Type", "application/json");
                // request.AddHeader("Authorization", "Basic " + token);
                //  IRestResponse response = client.Execute(request);
                // Console.WriteLine(response.Content);
                esegui("Update sessioniPagamenti set inCorso = 999 where guid = " + apic(id));





            }
            catch (Exception ex)
            {
                esegui("Update sessioniPagamenti set inCorso = 0 where guid = " + apic(id));
                catchError(ex.Message, ex.StackTrace);
            }
        }


        public string getSellaToken()
        {
            try
            {
                string t = "";
                response a = esegui("select valore from  impostazioni where chiave = 'stripe'");
                if (IsDataTableEmpty(a.data))
                {
                    throw new Exception("Impostazioni stripe non configurate");
                }
                else
                {
                    t = a.data.Rows[0]["valore"].ToString();

#if DEBUG

                    t = "R0VTUEFZOTY1NTkjI0VzZXJjZW50ZSBUZXN0IGRpIHBvbGEjIzIxLzA1LzIwMjQgMTM6NDI6MzA=";

#endif
                }
                return t;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        [HttpPatch]
        public response controlloPagamento(string id)
        {
            response ris = new response();
            ris.error.message = traduzioni.traduci("str_pagamento_non_riuscito", getLng());
            ris.data = "ok";

            try
            {

                response check = esegui("Select * from sessioniPagamenti where ticket = " + apic(id));
                if (!IsDataTableEmpty(check.data))
                {
                    string stato = check.data.Rows[0]["inCorso"].ToString();
                    if (stato == "7")
                    {
                        ris.error.message = traduzioni.traduci("str_pagamentoriuscito", getLng()) + "<br>" + id;
                    }
                    else if (stato == "0")
                    {
                        ris.error.message = traduzioni.traduci("str_convalida_in_corso", getLng());
                        ris.data = "refresh";
                    }
                    else if (stato == "500")
                    {
                        ris.error.message = traduzioni.traduci("str_erroriBiglietti_troppoTardi", getLng());
                    }
                    else if (stato == "999")
                    {
                        ris.error.message = traduzioni.traduci("str_pagamento_scaduto", getLng());
                    }
                }
                else
                {
                    ris.error.message = traduzioni.traduci("str_pagamento_non_esiste", getLng());

                }





            }
            catch (Exception ex)
            {

                ris = catchError(ex.Message, ex.StackTrace);
                ris.data = "str_pagamento_non_riuscito";
            }

            return ris;
        }


    }


}

