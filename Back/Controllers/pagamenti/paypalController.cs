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
    public class paypalController : FunzioniAggiuntive
    {
        TraduzioniController traduzioni = new TraduzioniController();

        public List<string> get(string prezzo, string sessione, string code)
        {

            List<string> ris = new List<string>();
            try
            {



                string url = "https://api.sandbox.paypal.com/v2/checkout/orders";
                var site = "http://localhost:4200/checkpayment/paypal/" + code;
                var cancel = "http://localhost:4200/checkpayment/paypal/000000";
#if RELEASE
                url = "https://api.paypal.com/v2/checkout/orders";
                site = webSite+"/checkpayment/paypal/"+code;
                cancel = webSite+"/checkpayment/paypal/000000";
#endif


                string token = getPayPaltoken();

                if (isEmpty(token))
                {
                    return ris;
                }

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddHeader("Content-Type", "application/json");
                request.AddHeader("Authorization", "Basic " + token);
                request.AddHeader("PayPal-Request-Id", code);

                //autoizhe
                // request.AddHeader("Authorization", "Basic QWVDZWNKWE5vTERPM1o4d29sMnpMUWZpcGNLSW1XeXNDdzJLS2NNak9yMEtNT25ld3lyTjlUczBMbVJhTkZHY1luemJnc0RwMEZVYmREVk86RUdobGtJMF9tSkU3T2p3TXhPVWp4TEltbHB4WDFmZXhQcFV0RWJFQkdWZHVWSWJ4akphaXduY29XTmxvcWlLa3pwWmJ2SXNhMEJUUkF6RzU=");
                // var json = "{\n  \"intent\": \"CAPTURE\",\n  \"application_context\": {\n    \"return_url\": \"" + site + "\",\n    \"cancel_url\": \"" + cancel + "\",\n    \"client_configuration\": {\n      \"integration_artifact\": \"PAYPAL_JS_SDK\",\n      \"experience\": {\n        \"user_experience_flow\": \"FULL_PAGE_REDIRECT\",\n        \"entry_point\": \"PAY_WITH_PAYPAL\",\n        \"channel\": \"WEB\",\n        \"product_flow\": \"HERMES\"\n      }\n    }\n    \n  },\n  \"purchase_units\": [\n    {\n      \"reference_id\": \"" + sessione + "\",\n      \"description\": \"" + sessione + "\",\n      \"amount\": {\n        \"currency_code\": \"EUR\",\n        \"value\": \"" + prezzo.ToString().Replace(',', '.') + "\"\n      }\n    }\n  ]\n}";

                var json = "{\n \"intent\": \"CAPTURE\",   \"purchase_units\": [    {      \"reference_id\": \"" + code + "\",      \"amount\": {        \"currency_code\": \"EUR\",        \"value\": \"" + prezzo.ToString().Replace(',', '.') + "\"      }    }  ],  \"payment_source\": {    \"paypal\": {      \"experience_context\": {        \"payment_method_preference\": \"IMMEDIATE_PAYMENT_REQUIRED\",        \"payment_method_selected\": \"PAYPAL\",                \"locale\": \"it-IT\",        \"landing_page\": \"GUEST_CHECKOUT\",        \"shipping_preference\": \"NO_SHIPPING\",        \"user_action\": \"PAY_NOW\",        \"return_url\": \"" + site + "\",        \"cancel_url\": \"" + cancel + "\"      }    }  }}";
                dynamic jsonx = JsonConvert.DeserializeObject(json);

                request.AddParameter("application/json", json, ParameterType.RequestBody);
                IRestResponse response = client.Execute(request);
                Console.WriteLine(response.Content);
                dynamic jsonObject = JsonConvert.DeserializeObject(response.Content);

                if (!isEmpty(response.Content))
                {

                    if (jsonObject.ContainsKey("id") && jsonObject.ContainsKey("links"))
                    {

                        ris.Add(jsonObject["id"].ToString());
                        var a = jsonObject["links"];
                        ris.Add(a[1]["href"].ToString());

                    }


                }

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            return ris;
        }
        public string getPayPaltoken()
        {
            try
            {
                string t = "";
                response a = esegui("select valore from  impostazioni where chiave = 'paypal'");
                if (IsDataTableEmpty(a.data))
                {
                    throw new Exception("Impostazioni paypal non configurate");
                }
                else
                {
                    t = a.data.Rows[0]["valore"].ToString();

#if DEBUG

                    t = "QWVDZWNKWE5vTERPM1o4d29sMnpMUWZpcGNLSW1XeXNDdzJLS2NNak9yMEtNT25ld3lyTjlUczBMbVJhTkZHY1luemJnc0RwMEZVYmREVk86RUdobGtJMF9tSkU3T2p3TXhPVWp4TEltbHB4WDFmZXhQcFV0RWJFQkdWZHVWSWJ4akphaXduY29XTmxvcWlLa3pwWmJ2SXNhMEJUUkF6RzU=";

#endif
                }
                return t;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public void delete(string id, string paypalBuy)
        {
            try
            {

                var url = "https://api.sandbox.paypal.com/v1/checkout/orders/" + paypalBuy;
#if RELEASE
                            url = "https://api.paypal.com/v1/checkout/orders/" + paypalBuy ;
#endif
                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.DELETE);

                string token = getPayPaltoken();
                //     token = "QVo4WUNIek82bVdsMzF4N2FoTDd1aWR4S3VXVTR1R3V1SnBqamtKaXBrUjU5dkJXT3l1aUpXdXpnTWFBOEUyS3dYTmp2eVhrbDRSUFR6T0M6RU00ZjJDczV3eTJkY0NaMTlPUXZVU3h2R0hfSzNYUnVxSEZJb2dIeTZRQTlZX1ZzdFFtMEdDb01oaGpmeWNNU1FOSDI2UlJKaW1TaDhFRlY";
                if (isEmpty(token))
                {
                    throw new Exception("nessun token");
                }
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
                    string stato = check.data.Rows[0]["inCorso"].ToString() ;
                    if (stato == "7")
                    {
                        ris.error.message = traduzioni.traduci("str_pagamentoriuscito", getLng()) + "<br>" + id;
                    }
                    else if(stato == "0")
                    {
                         ris.error.message = traduzioni.traduci("str_convalida_in_corso", getLng()) ;
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

