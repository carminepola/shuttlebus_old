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
    public class searchController : FunzioniAggiuntive
    {
        int erroreData = 0;
        int erroreFiltro = 0;
        int errorePasseggeri = 0;

        TraduzioniController traduzioni = new TraduzioniController();
        [HttpGet, ActionName("getLuogoVicino"), Route("getLuogoVicino")]

        public response getLuogoVicino(string lat, string lng)
        {
            response ris = new response();
            try
            {
                response a = esegui(" Select * from fermate where id in (Select distinct(idFermata) from linee left join itinerari on linee.id = itinerari.idLinea where disattivato = 0)");
                a.data.Columns.Add("km", typeof(float));
                int iMinore = -1;
                float kmMinori = 9999999999999999999;
                for (var i = 0; i < a.data.Rows.Count; i++)
                {

                    a.data.Rows[i]["km"] = getDistanceKm(lat, lng, a.data.Rows[i]["lat"].ToString(), a.data.Rows[i]["lng"].ToString());

                    var km = a.data.Rows[i]["km"];

                    if (km < kmMinori)
                    {
                        kmMinori = km;
                        iMinore = i;
                    }

                }


                ris = esegui("Select * from fermate where id =" + apic(a.data.Rows[iMinore]["id"].ToString()));
                ris.data.Columns.Add("traduzioniCitta", typeof(DataTable));
                ris.data.Columns.Add("km", typeof(float));
                for (var i = 0; i < ris.data.Rows.Count; i++)
                {
                    ris.data.Rows[i]["traduzioniCitta"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["citta"].ToString());
                    ris.data.Rows[i]["km"] = kmMinori;
                }


            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }

        [HttpGet, ActionName("getFrom"), Route("getFrom")]

        public response getFrom()
        {
            response ris = new response();
            try
            {
                List<int> listaId = new List<int>();
                response data = esegui("select id as idlinea  from  linee where disattivato = 'False'");
                for (int i = 0; i < data.data.Rows.Count; i++)
                {
                    string a = "Select * from itinerari where idlinea = " + apic(data.data.Rows[i]["idLinea"].ToString()) + " order by id asc";
                    response linea = esegui(a);
                    for (int j = 0; j < linea.data.Rows.Count - 1; j++)
                    {
                        DataRow row = linea.data.Rows[j];
                        string idFermata = row["idFermata"].ToString();
                        int id = int.Parse(idFermata);
                        listaId.Add(id);
                    }
                }
                listaId.Distinct().ToList();
                if (listaId.Count > 0)
                {
                    string q = "Select id, citta, indirizzo, lat, lng from fermate";
                    for (int i = 0; i < listaId.Count; i++)
                    {
                        if (i == 0)
                        {
                            q += " where id = " + listaId[i];
                        }
                        else
                        {
                            q += " or id = " + listaId[i];
                        }
                    }
                    ris = esegui(q);
                    ris.data.Columns.Add("traduzioniCitta", typeof(DataTable));
                    ris.data.Columns.Add("en", typeof(string));
                    ris.data.Columns.Add("it", typeof(string));
                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {
                        ris.data.Rows[i]["traduzioniCitta"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["citta"].ToString());

                        ris.data.Rows[i]["en"] = ris.data.Rows[i]["traduzioniCitta"].Rows[0]["en"];
                        ris.data.Rows[i]["it"] = ris.data.Rows[i]["traduzioniCitta"].Rows[0]["it"];
                    }









                }
                else
                {
                    return new response();
                }
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpGet, ActionName("getTo"), Route("getTo")]
        public response getTo()
        {
            response ris = new response();
            try
            {
                List<int> listaId = new List<int>();
                response data = esegui("select id as idlinea  from  linee where disattivato = 'False'");
                for (int i = 0; i < data.data.Rows.Count; i++)
                {
                    string a = "Select * from itinerari where idlinea = " + apic(data.data.Rows[i]["idLinea"].ToString()) + " order by id asc";
                    response linea = esegui(a);
                    for (int j = 1; j < linea.data.Rows.Count; j++)
                    {
                        DataRow row = linea.data.Rows[j];
                        string idFermata = row["idFermata"].ToString();
                        int id = int.Parse(idFermata);
                        listaId.Add(id);
                    }
                }
                listaId.Distinct().ToList();
                if (listaId.Count > 0)
                {
                    string q = "Select id, citta, indirizzo, lat, lng from fermate";
                    for (int i = 0; i < listaId.Count; i++)
                    {
                        if (i == 0)
                        {
                            q += " where id = " + listaId[i];
                        }
                        else
                        {
                            q += " or id = " + listaId[i];
                        }
                    }
                    ris = esegui(q);
                    ris.data.Columns.Add("traduzioniCitta", typeof(DataTable));
                    ris.data.Columns.Add("en", typeof(string));
                    ris.data.Columns.Add("it", typeof(string));
                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {
                        ris.data.Rows[i]["traduzioniCitta"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["citta"].ToString());
                        ris.data.Rows[i]["en"] = ris.data.Rows[i]["traduzioniCitta"].Rows[0]["en"];
                        ris.data.Rows[i]["it"] = ris.data.Rows[i]["traduzioniCitta"].Rows[0]["it"];
                    }
                }
                else
                {
                    return new response();
                }
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpGet, ActionName("searchFrom"), Route("searchFrom")]

        public response searchFrom(int q)
        {
            int idPuntoTo = q;
            response ris = new response();
            try
            {
                List<int> listaId = new List<int>();
                response data = esegui("select distinct(linee .id) as idlinea  from  linee LEFT JOIN itinerari on linee .id = itinerari.idlinea where linee .disattivato = 'False' and itinerari.idFermata =" + apic(idPuntoTo.ToString()));
                for (int i = 0; i < data.data.Rows.Count; i++)
                {
                    string a = "Select * from itinerari where idlinea = " + apic(data.data.Rows[i]["idLinea"].ToString()) + " order by id ASC";
                    response linea = esegui(a);
                    var check = false;
                    for (int j = 0; j < linea.data.Rows.Count && !check; j++)
                    {
                        DataRow row = linea.data.Rows[j];
                        string idFermata = row["idFermata"].ToString();
                        int id = int.Parse(idFermata);
                        if (id != idPuntoTo)
                        {
                            listaId.Add(id);
                        }
                        else
                        {
                            check = true;
                        }
                    }
                }
                listaId.Distinct().ToList();
                if (listaId.Count > 0)
                {
                    string qe = "Select id, citta, indirizzo, lat, lng from fermate";
                    for (int i = 0; i < listaId.Count; i++)
                    {
                        if (i == 0)
                        {
                            qe += " where id = " + listaId[i];
                        }
                        else
                        {
                            qe += " or id = " + listaId[i];
                        }
                    }
                    ris = esegui(qe);
                    ris.data.Columns.Add("traduzioniCitta", typeof(DataTable));
                    ris.data.Columns.Add("en", typeof(string));
                    ris.data.Columns.Add("it", typeof(string));
                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {
                        ris.data.Rows[i]["traduzioniCitta"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["citta"].ToString());
                        ris.data.Rows[i]["en"] = ris.data.Rows[i]["traduzioniCitta"].Rows[0]["en"];
                        ris.data.Rows[i]["it"] = ris.data.Rows[i]["traduzioniCitta"].Rows[0]["it"];
                    }
                }
                else
                {
                    return new response();
                }
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }

        [HttpGet, ActionName("searchTo"), Route("searchTo")]
        public response searchTo(int q)
        {
            int idPuntoTo = q;
            response ris = new response();
            try
            {
                List<int> listaId = new List<int>();
                response data = esegui("select distinct(linee .id) as idlinea  from  linee LEFT JOIN itinerari on linee .id = itinerari.idlinea where linee .disattivato = 'False' and itinerari.idFermata =" + apic(idPuntoTo.ToString()));
                for (int i = 0; i < data.data.Rows.Count; i++)
                {
                    string a = "Select * from itinerari where idlinea = " + apic(data.data.Rows[i]["idLinea"].ToString()) + " order by id ASC";
                    response linea = esegui(a);
                    var check = false;
                    for (int j = 0; j < linea.data.Rows.Count; j++)
                    {
                        DataRow row = linea.data.Rows[j];
                        string idFermata = row["idFermata"].ToString();
                        int id = int.Parse(idFermata);
                        if (check)
                        {
                            listaId.Add(id);
                        }
                        if (id == idPuntoTo)
                        {
                            check = true;
                        }

                    }
                }
                listaId.Distinct().ToList();
                if (listaId.Count > 0)
                {
                    string qe = "Select id, citta, indirizzo, lat, lng from fermate";
                    for (int i = 0; i < listaId.Count; i++)
                    {
                        if (i == 0)
                        {
                            qe += " where id = " + listaId[i];
                        }
                        else
                        {
                            qe += " or id = " + listaId[i];
                        }
                    }
                    ris = esegui(qe);
                    ris.data.Columns.Add("traduzioniCitta", typeof(DataTable));
                    ris.data.Columns.Add("en", typeof(string));
                    ris.data.Columns.Add("it", typeof(string));
                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {
                        ris.data.Rows[i]["traduzioniCitta"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["citta"].ToString());
                        ris.data.Rows[i]["en"] = ris.data.Rows[i]["traduzioniCitta"].Rows[0]["en"];
                        ris.data.Rows[i]["it"] = ris.data.Rows[i]["traduzioniCitta"].Rows[0]["it"];

                    }
                }
                else
                {
                    return new response();
                }
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }

        public bool giornoPresenteInLista(string giorno, List<string> lista)
        {
            try
            {
                for (var i = 0; i < lista.Count; i++)
                {
                    if (giorno.ToLower() == lista[i].ToLower())
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
        private bool dataChiusa(DateTime data, List<DateTime> giorni)
        {
            try
            {
                for (int i = 0; i < giorni.Count; i++)
                {
                    if (data == giorni[i])
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

        public bool giornoChiuso(DateTime data, List<string> giorni)
        {
            try
            {
                switch (data.DayOfWeek)
                {
                    case DayOfWeek.Monday:

                        if (giornoPresenteInLista("Lunedi", giorni))
                        {
                            return true;
                        }

                        break;
                    case DayOfWeek.Tuesday:
                        if (giornoPresenteInLista("Martedi", giorni))
                        {
                            return true;
                        }

                        break;
                    case DayOfWeek.Wednesday:
                        if (giornoPresenteInLista("Mercoledi", giorni))
                        {
                            return true;
                        }

                        break;
                    case DayOfWeek.Thursday:
                        if (giornoPresenteInLista("Giovedi", giorni))
                        {
                            return true;
                        }

                        break;
                    case DayOfWeek.Friday:
                        if (giornoPresenteInLista("Venerdi", giorni))
                        {
                            return true;
                        }

                        break;
                    case DayOfWeek.Saturday:
                        if (giornoPresenteInLista("Sabato", giorni))
                        {
                            return true;
                        }

                        break;
                    case DayOfWeek.Sunday:
                        if (giornoPresenteInLista("Domenica", giorni))
                        {
                            return true;
                        }

                        break;

                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return false;
        }
        [HttpGet, ActionName("searchData"), Route("searchData")]
        public response searchData(string from, string to)
        {
            response ris = new response();
            try
            {
                response date = esegui("SELECT * FROM  aperture WHERE  aperture.idlinea IN (SELECT DISTINCT( a.idlinea )                             FROM   itinerari AS a                                    LEFT JOIN itinerari AS b                                           ON a.idlinea = b.idlinea                                    LEFT JOIN linee                                           ON a.idlinea = linee.id                             WHERE  a.idfermata =" + apic(from) + "                                    AND b.idfermata = " + apic(to) + "                                    AND a.id < b.id AND disattivato = 'false')  and aperture.idlinea in (Select DISTINCT(idlinea) from settingFasciaOraria where disattivato = 'false')");

                if (!IsDataTableEmpty(date.data))
                {

                    var dates = new List<DateTime>();
                    for (int i = 0; i < date.data.Rows.Count; i++)
                    {
                        var da = date.data.Rows[i]["da"];
                        var al = date.data.Rows[i]["al"];
                        var idLinea = date.data.Rows[i]["idLinea"].ToString();

                        var idFasciaOraria = date.data.Rows[i]["idfasciaoraria"].ToString();

                        response giorniChiusura = esegui("Select  count(idLinea) as idLinea, chiusura from calendario where idlinea = " + apic(idLinea) + " and idfasciaoraria =" + apic(idFasciaOraria) + " and tipo = 'GIORNO' and idFasciaOraria in (Select idfasciaoraria from settingFasciaoraria where disattivato = 'false') group by chiusura");
                        List<string> giorni = new List<string>();
                        for (int j = 0; j < giorniChiusura.data.Rows.Count; j++)
                        {
                            giorni.Add(giorniChiusura.data.Rows[j]["chiusura"].ToString());

                        }

                        response dataChiusura = esegui("Select  count(idLinea) as idLinea, data from calendario where idlinea= " + apic(idLinea) + " and idfasciaoraria =" + apic(idFasciaOraria) + "and tipo = 'DATA' and idFasciaOraria in (Select idfasciaoraria from settingFasciaoraria where disattivato = 'false')  group by data;");
                        List<DateTime> dateChiuse = new List<DateTime>();
                        for (int j = 0; j < dataChiusura.data.Rows.Count; j++)
                        {
                            dateChiuse.Add(dataChiusura.data.Rows[j]["data"]);

                        }





                        if (da < DateTime.Now)
                        {
                            da = DateTime.Now;

                            TimeSpan ts = new TimeSpan(0, 0, 0);
                            da = da.Date + ts;

                        }



                        if (al > DateTime.Now.AddDays(365))
                        {
                            al = DateTime.Now.AddDays(365);
                        }
                        if (al > da && al > DateTime.Now)
                        {

                            var cont = 0;
                            for (var dt = da; dt <= al; dt = dt.AddDays(1))
                            {
                                cont++;

                                if (cont == 78)
                                {
                                    cont = 0;
                                }



                                if (!giornoChiuso(dt, giorni) && !dataChiusa(dt, dateChiuse))
                                {

                                    dates.Add(dt);
                                }

                            }
                        }



                    }


                    //filling the list somehow
                    List<DateTime> dates2 = new List<DateTime>();
                    foreach (var v in dates)
                    {
                        if (!dates2.Contains(v.Date))
                        {
                            dates2.Add(v.Date);
                        }
                    }


                    ris.data = dates2;

                }
                else
                {
                    return ris;
                }

            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpGet, ActionName("searchLinee"), Route("searchLinee")]
        public response searchLinee(string from, string to, string passeggeri, string orario = "0", string day = "")
        {
            response ris = new response();
            ris.data = new DataTable();
            try
            {
                string q = "SELECT DISTINCT( a.idlinea ) as id  ,linee.nome    FROM   itinerari AS a LEFT JOIN itinerari AS b ON a.idlinea = b.idlinea LEFT JOIN linee    ON a.idlinea = linee.id  WHERE  a.idfermata = " + apic(from) + "    AND b.idfermata = " + apic(to) + "  AND a.id < b.id   AND disattivato = 'false'";
                response linee = esegui(q);
                linee.data.Columns.Add("traduzioniNome", typeof(DataTable));
                linee.data.Columns.Add("fasce", typeof(DataTable));
                lineeController lc = new lineeController();
                for (int i = 0; i < linee.data.Rows.Count; i++)
                {

                    if (IsDataTableEmpty(ris.data))
                    {
                        ris.data = linee.data.Clone();
                    }

                    DataRow linea = linee.data.Rows[i];
                    linea["traduzioniNome"] = traduzioni.getTraduzioniPrivate(linea["nome"].ToString());
                    string id = linea["id"].ToString();
                    DataTable biglietti = lc.getBiglietti(id).data;
                    biglietti.Columns.Add("numero", typeof(int), "0");


                    response openLinee = getOpenLinee(id, from, to, passeggeri, day, orario);
                    DataTable openLineeDT = openLinee.data;
                    if (!IsDataTableEmpty(openLineeDT) && !IsDataTableEmpty(biglietti))
                    {
                        openLinee.data.Columns.Add("biglietti", typeof(DataTable));
                        openLinee.data.Columns.Add("numeroBagagliOpzionali", typeof(int), "0");
                        if (openLineeDT.Rows.Count > 0)
                        {
                            //ripete le fasce
                            for (int l = 0; l < openLineeDT.Rows.Count; l++)
                            {
                                for (int x = 0; x < openLinee.data.Rows.Count; x++)
                                {
                                    openLinee.data.Rows[x]["biglietti"] = biglietti;
                                }
                            }
                            linea["fasce"] = openLinee.data;
                            ris.data.ImportRow(linea);
                        }
                    }

                }
                if (ris.data.Rows.Count == 0)
                {
                    List<string> listaErroriSearch = new List<string>();
                    if (erroreData > 0)
                    {
                        listaErroriSearch.Add("str_errore_data");
                    }
                    if (erroreFiltro > 0)
                    {
                        listaErroriSearch.Add("str_errore_filtro");
                    }
                    if (errorePasseggeri > 0)
                    {
                        listaErroriSearch.Add("str_errore_passeggeri");
                    }

                    ris.error.info = listaErroriSearch;

                }
            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }

        public void contaErrore(string errore)
        {
            if (errore == "0")
            {
                erroreData++;
            }
            if (errore == "1")
            {
                erroreFiltro++;
            }
            if (errore == "2")
            {
                errorePasseggeri++;
            }
        }
        public response getOpenLinee(string idLinea, string da, string a, string passeggeri, string day, string orario)
        {
            response ris = new response();
            string queryInit = "";
            try
            {

                string queryCompleta = "";
                string queryConPersone = "";
                string queryConOrari = "";
                DateTime datT = DateTime.Parse(day);

                queryInit = "SELECT *,f.orario as partenza, f2.orario as arrivo FROM aperture AS a LEFT JOIN settingfasciaoraria AS s ON a.idfasciaoraria = s.idfasciaoraria LEFT JOIN fasceorarie as f ON s.idfasciaoraria = f.idfasciaoraria  LEFT JOIN fasceorarie AS f2  ON s.idfasciaoraria = f2.idfasciaoraria  WHERE a.idlinea = " + apic(idLinea) + " AND a.da <= " + apic(day) + " AND a.al >= " + apic(day) + " AND s.disattivato = 'false' AND s.idlinea = " + apic(idLinea) + " AND f.idfermata =" + apic(da) + " AND f.idlinea= " + apic(idLinea) + "and f.idfasciaoraria not in(Select DISTINCT(idfasciaoraria) from calendario where idlinea = " + apic(idLinea) + " and (chiusura = " + apic(getGiorno(datT)) + " or data = " + apic(day) + ") ) AND f2.idfermata = " + apic(a.ToString()) + "  AND f2.idlinea = " + apic(idLinea) + "  ";

                queryConPersone = queryInit + " and  s.posti>=" + passeggeri;
                queryCompleta += queryConPersone;

                if (!isEmpty(orario))
                {
                    string minore = "";
                    string maggiore = "";
                    switch (orario)
                    {
                        case "0":
                            minore = "00:00:00";
                            maggiore = "23:59:59";
                            break;
                        case "1":
                            minore = "00:00:00";
                            maggiore = "08:00:00";
                            break;
                        case "2":
                            minore = "08:00:00";
                            maggiore = "16:00:00";
                            break;
                        case "3":
                            minore = "16:00:00";
                            maggiore = "23:59:59";
                            break;



                    }
                    string oggi = DateTime.Now.ToString("yyyy-MM-dd");
                    DateTime now = DateTime.Now;
                    DateTime newTime = now.AddMinutes(30);



                    string orarioAdesso = newTime.ToString("HH:mm:ss");
                    if (day == oggi.ToString())
                    {

                        minore = orarioAdesso;
                    }
                    string addons = " AND a.idfasciaoraria IN (SELECT DISTINCT( idfasciaoraria )  FROM fasceorarie  WHERE idfermata =  " + apic(da) + "   AND orario >= " + apic(minore) + "  AND orario <=  " + apic(maggiore) + "   AND idlinea =  " + apic(idLinea) + " ) ";
                    queryConOrari = queryInit + addons;
                    queryCompleta += addons;
                }
                response dati = esegui(queryCompleta);
                var check0 = false;
                var check1 = false;
                var check2 = false;

                if (IsDataTableEmpty(dati.data))
                {
                    response check = new response();

                    check = new response();
                    check = esegui(queryConPersone);
                    if (IsDataTableEmpty(check.data))
                    {

                        check2 = true;

                    }
                    if (orario != "0")
                    {
                        check = new response();
                        check = esegui(queryConOrari);
                        if (IsDataTableEmpty(check.data))
                        {

                            check1 = true;

                        }

                    }
                    check = new response();
                    check = esegui(queryInit);
                    if (IsDataTableEmpty(check.data))
                    {
                        check0 = true;

                    }

                    if (!check0)
                    {
                        if (check2)
                        {
                            contaErrore("2");
                        }
                        if (check1)
                        {
                            contaErrore("1");
                        }
                    }
                    else
                    {
                        contaErrore("0");
                    }

                    return dati;
                }
                else
                {

                    controlloPostiController controlli = new controlloPostiController();
                    //controlla numero posti per fermata

                    List<int> idDaCancellare = new List<int>();
                    for (var i = 0; i < dati.data.Rows.Count; i++)
                    {
                        DataRow riga = dati.data.Rows[i];
                        string asasa = riga["posti"].ToString();
                        string idFascia = riga["guid"].ToString();
                        response posti = controlli.getPosti(idLinea, int.Parse(da), int.Parse(a), idFascia, day);
                        dati.data.Rows[i]["posti"] = int.Parse(dati.data.Rows[i]["posti"].ToString()) - controlli.numeroDaPosti(posti);
                        dati.data.Rows[i]["bagagli"] = dati.data.Rows[i]["posti"];
                        dati.data.Rows[i]["bagagliOpzionali"] = int.Parse(dati.data.Rows[i]["bagagliOpzionali"].ToString()) - controlli.numeroDaBagagli(posti);
                        if (dati.data.Rows[i]["posti"] < int.Parse(passeggeri))
                        {
                            idDaCancellare.Add(i);
                        }
                    }
                    for (var i = 0; i < idDaCancellare.Count(); i++)
                    {
                        DataRow dr = dati.data.Rows[idDaCancellare[i]];
                        dr.Delete();
                    }
                    if (idDaCancellare.Count > 0)
                    {
                        dati.data.AcceptChanges();
                    }
                    if (IsDataTableEmpty(dati.data))
                    {
                        contaErrore("2");
                    }


                    ris.data = dati.data;
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;

        }
    }
}

