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
    public class controlloPostiController : FunzioniAggiuntive
    {

        TraduzioniController traduzioni = new TraduzioniController();

        public int numeroDaPosti(dynamic data)
        {
            try
            {

                return int.Parse(data.data.Rows[0]["posti"].ToString());

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
        public int numeroDaBagagli(dynamic data)
        {
            try
            {

                return int.Parse(data.data.Rows[0]["bagagli"].ToString());

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }


        public string getQuery(string idLinea, int partenza, int arrivo, string idFascia, string data, string numeroPersone)
        {
            response ris = new response();
            try
            {
                if (int.Parse(numeroPersone) > 0)
                {
                    List<string> listaId = new List<string>();
                    response linee = esegui("Select * from itinerari where idlinea =" + apic(idLinea));
                    if (!IsDataTableEmpty(linee.data))
                    {
                        bool iniziato = false;
                        bool finito = false;
                        for (var j = 0; j < linee.data.Rows.Count && !finito; j++)
                        {
                            if (linee.data.Rows[j]["idFermata"].ToString() == partenza.ToString())
                            {
                                iniziato = true;
                            }
                            if (linee.data.Rows[j]["idFermata"].ToString() == arrivo.ToString())
                            {
                                finito = true;
                            }
                            if (iniziato && !finito)
                            {
                                listaId.Add(linee.data.Rows[j]["idFermata"].ToString());
                            }
                        }
                    }
                    string queryList = "";

                    for (var i = 0; i < listaId.Count; i++)
                    {
                        if (i != 0)
                        {
                            queryList += "  union ";
                        }
                        queryList += "Select SUM(intinerariAcquistati.posti) as n , SUM(intinerariAcquistati.bagagliOpzionali) as m from intinerariAcquistati where idlinea = " + apic(idLinea) + " and idFascia =" + apic(idFascia) + " and idfermata= " + apic(listaId[i]) + "and rimborsato = 0 and data =" + apic(data);

                    }

                    string query1 = "Select ISNULL(max(n),0) as c2 ,ISNULL(max(m),0) as bagagli from (" + queryList + ") as tabella";
                    string query2 = "SELECT TOP 1 posti AS c1, bagagliopzionali AS bagagli FROM fasceorarie LEFT JOIN settingfasciaoraria ON settingfasciaoraria.idfasciaoraria = fasceorarie.idfasciaoraria WHERE guid = " + apic(idFascia) + " AND fasceorarie.idlinea =" + apic(idLinea) + "  and settingFasciaOraria.idlinea = " + apic(idLinea);
                    string querytotal = "SELECT c1-c2 from (" + query1 + ")as a, (" + query2 + ") as b";
                    string queryFinal = "if((" + querytotal + ") < " + apic(numeroPersone) + ")RAISERROR(" + apic("str_erroriBiglietti_troppoTardi") + ",16,1);";

                    return queryFinal;






                }



            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return "";
        }

        public string getQueryBagagli(string idLinea, int partenza, int arrivo, string idFascia, string data, string numeroBagagli)
        {
            response ris = new response();
            try
            {
                List<string> listaId = new List<string>();
                response linee = esegui("Select * from itinerari where idlinea =" + apic(idLinea));
                if (!IsDataTableEmpty(linee.data))
                {
                    bool iniziato = false;
                    bool finito = false;
                    for (var j = 0; j < linee.data.Rows.Count && !finito; j++)
                    {
                        if (linee.data.Rows[j]["idFermata"].ToString() == partenza.ToString())
                        {
                            iniziato = true;
                        }

                        if (linee.data.Rows[j]["idFermata"].ToString() == arrivo.ToString())
                        {
                            finito = true;
                        }
                        if (iniziato && !finito)
                        {
                            listaId.Add(linee.data.Rows[j]["idFermata"].ToString());
                        }
                    }
                }
                string queryList = "";

                for (var i = 0; i < listaId.Count; i++)
                {
                    if (i != 0)
                    {
                        queryList += "  union ";
                    }
                    queryList += "Select SUM(intinerariAcquistati.posti) as n , SUM(intinerariAcquistati.bagagliOpzionali) as m from intinerariAcquistati where idlinea = " + apic(idLinea) + " and idFascia =" + apic(idFascia) + " and idfermata= " + apic(listaId[i]) + "and rimborsato = 0 and data =" + apic(data);

                }

                string query1 = "Select ISNULL(max(n),0) as posti ,ISNULL(max(m),0) as c2 from (" + queryList + ") as tabella";
                string query2 = "SELECT TOP 1 posti AS posti, bagagliopzionali AS c1 FROM fasceorarie LEFT JOIN settingfasciaoraria ON settingfasciaoraria.idfasciaoraria = fasceorarie.idfasciaoraria WHERE guid = " + apic(idFascia) + " AND fasceorarie.idlinea =" + apic(idLinea) + "  and settingFasciaOraria.idlinea = " + apic(idLinea);
                string querytotal = "SELECT c1-c2 from (" + query1 + ")as a, (" + query2 + ") as b";
                string queryFinal = "if((" + querytotal + ") < " + apic(numeroBagagli) + ")RAISERROR(" + apic("str_erroriBiglietti_bagagli") + ",16,1);";

                return queryFinal;








            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return "";
        }

        [HttpGet]
        public response getPosti(string idLinea, int partenza, int arrivo, string idFascia, string data)
        {
            response ris = new response();
            try
            {
                List<string> listaId = new List<string>();
                response linee = esegui("Select * from itinerari where idlinea =" + apic(idLinea));
                if (!IsDataTableEmpty(linee.data))
                {
                    bool iniziato = false;
                    bool finito = false;
                    for (var j = 0; j < linee.data.Rows.Count && !finito; j++)
                    {
                        if (linee.data.Rows[j]["idFermata"].ToString() == partenza.ToString())
                        {
                            iniziato = true;
                        }
                        if (linee.data.Rows[j]["idFermata"].ToString() == arrivo.ToString())
                        {
                            finito = true;
                        }
                        if (iniziato && !finito)
                        {
                            listaId.Add(linee.data.Rows[j]["idFermata"].ToString());
                        }
                    }
                }
                string queryList = "";

                for (var i = 0; i < listaId.Count; i++)
                {
                    if (i != 0)
                    {
                        queryList += "  union ";
                    }
                    queryList += "Select SUM(intinerariAcquistati.posti) as n , SUM(intinerariAcquistati.bagagliOpzionali) as m from intinerariAcquistati where idlinea = " + apic(idLinea) + " and idFascia =" + apic(idFascia) + " and idfermata= " + apic(listaId[i]) + "and rimborsato=0 and data =" + apic(data);

                }

                ris = esegui("Select ISNULL(max(n),0) as posti ,ISNULL(max(m),0) as bagagli from (" + queryList + ") as tabella;");

            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }

    }

}

