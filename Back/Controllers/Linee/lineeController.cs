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
    public class lineeController : FunzioniAggiuntive
    {

        TraduzioniController traduzioni = new TraduzioniController();

        [HttpPatch, ActionName("patch"), Route("patch")]
        public response patch(string id, bool set)
        {
            response ris = new response();
            try
            {


                if (isValidSession() && getRuolo() < 10)
                {
                    esegui("UPDATE linee set disattivato = " + apic(set.ToString()) + " where id =" + apic(id));
                }

            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpGet]
        public response get()
        {
            response ris = new response();
            try
            {


                ris = esegui("Select * from linee where disattivato = 0 order by id desc");
                if (!IsDataTableEmpty(ris.data))
                {
                    ris.data.Columns.Add("traduzioniNome", typeof(DataTable));
                    ris.data.Columns.Add("traduzioniDes", typeof(DataTable));
                    ris.data.Columns.Add("en", typeof(string));
                    ris.data.Columns.Add("it", typeof(string));
                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {

                        ris.data.Rows[i]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["nome"].ToString());
                        ris.data.Rows[i]["traduzioniDes"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["descrizione"].ToString());
                        ris.data.Rows[i]["en"] = ris.data.Rows[i]["traduzioniNome"].Rows[0]["en"];
                        ris.data.Rows[i]["it"] = ris.data.Rows[i]["traduzioniNome"].Rows[0]["it"];
                    }
                    ris.data.Columns.Add("itinerario", typeof(DataTable));
                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {

                        string id = ris.data.Rows[i]["id"].ToString();
                        ris.data.Rows[i]["itinerario"] = getItinerario(id).data;

                    }

                }


            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }
        [HttpGet, ActionName("getAllLinee"), Route("getAllLinee")]
        public response getAllLinee()
        {
            response ris = new response();
            try
            {

                ris = esegui("Select * from linee  order by id desc");
                if (!IsDataTableEmpty(ris.data))
                {
                    ris.data.Columns.Add("traduzioniNome", typeof(DataTable));
                    ris.data.Columns.Add("traduzioniDes", typeof(DataTable));
                    ris.data.Columns.Add("en", typeof(string));
                    ris.data.Columns.Add("it", typeof(string));
                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {

                        ris.data.Rows[i]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["nome"].ToString());
                        ris.data.Rows[i]["traduzioniDes"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["descrizione"].ToString());
                        ris.data.Rows[i]["en"] = ris.data.Rows[i]["traduzioniNome"].Rows[0]["en"];
                        ris.data.Rows[i]["it"] = ris.data.Rows[i]["traduzioniNome"].Rows[0]["it"];
                    }
                    ris.data.Columns.Add("itinerario", typeof(DataTable));
                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {

                        string id = ris.data.Rows[i]["id"].ToString();
                        ris.data.Rows[i]["itinerario"] = getItinerario(id).data;

                    }

                }


            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }


        [HttpGet, ActionName("getID"), Route("getID")]
        public response getID(string id)
        {
            response ris = new response();
            try
            {
                if (isEmpty(id))
                {
                    throw new Exception(listaErrori[2]);
                }
                ris = get(id);







            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }

        [HttpGet("{id}")]
        public response get(string id)
        {
            response ris = new response();
            try
            {
                if (isEmpty(id))
                {
                    throw new Exception(listaErrori[2]);
                }



                ris = esegui("Select * from linee where id = " + apic(id));
                if (IsDataTableEmpty(ris.data))
                {
                    throw new Exception(listaErrori[10]);
                }
                else
                {
                    ris.data.Columns.Add("traduzioniNome", typeof(DataTable));
                    ris.data.Columns.Add("traduzioniDesc", typeof(DataTable));
                    ris.data.Columns.Add("itinerario", typeof(DataTable));
                    ris.data.Columns.Add("biglietti", typeof(DataTable));
                    ris.data.Columns.Add("fasceOrarie", typeof(DataTable));

                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {
                        ris.data.Rows[i]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["nome"].ToString());
                        ris.data.Rows[i]["traduzioniDesc"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["descrizione"].ToString());
                        ris.data.Rows[i]["itinerario"] = getItinerario(id).data;
                        ris.data.Rows[i]["biglietti"] = getBiglietti(id).data;
                        ris.data.Rows[i]["fasceOrarie"] = getFasceOrarie(id).data;
                    }


                }




            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
            }
            return ris;
        }


        public response getFasceOrarie(string id)
        {
            response ris = new response();
            DataTable r = new DataTable();
            r.Columns.Add("guid", typeof(string));
            r.Columns.Add("apertura", typeof(DataTable));
            r.Columns.Add("eccezioni", typeof(DataTable));
            r.Columns.Add("settings", typeof(DataTable));
            r.Columns.Add("orari", typeof(DataTable));
            try
            {
                if (isEmpty(id))
                {
                    throw new Exception(listaErrori[2]);
                }




                response fasce = esegui("Select  distinct idfasciaoraria  as id , guid from  fasceOrarie where idlinea = " + apic(id));
                if (!IsDataTableEmpty(fasce.data))
                {



                    for (var i = 0; i < fasce.data.Rows.Count; i++)
                    {
                        DataRow row;
                        row = r.NewRow();
                        row["guid"] = fasce.data.Rows[i]["guid"].ToString();
                        row["apertura"] = getApertura(id, fasce.data.Rows[i]["id"].ToString()).data;
                        row["eccezioni"] = getCalendario(id, fasce.data.Rows[i]["id"].ToString()).data;
                        row["settings"] = getSettings(id, fasce.data.Rows[i]["id"].ToString()).data;
                        row["orari"] = getOrari(id, fasce.data.Rows[i]["id"].ToString()).data;
                        r.Rows.Add(row);

                    }


                }
                ris.data = r;










            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }

        public response getApertura(string idlinea, string idFascia)
        {
            response ris = new response();
            try
            {
                ris = esegui("Select left(da, 10) as da,  left(al, 10) as a from aperture where idlinea =" + apic(idlinea) + "and idfasciaoraria =" + apic(idFascia));

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }
        public response getCalendario(string idlinea, string idFascia)
        {
            response ris = new response();
            try
            {
                ris = esegui("Select tipo, chiusura,left(data, 10)as data from calendario where idlinea =" + apic(idlinea) + "and idfasciaoraria =" + apic(idFascia));

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }
        public response getSettings(string idlinea, string idFascia)
        {
            response ris = new response();
            try
            {
                ris = esegui("Select disattivato,posti,bagagli,bagagliOpzionali,prezzoBagagli from settingfasciaoraria  where idlinea =" + apic(idlinea) + "and idfasciaoraria =" + apic(idFascia));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }
        public response getOrari(string idlinea, string idFascia)
        {
            response ris = new response();
            try
            {
                ris = esegui("Select orario, idFermata   from fasceOrarie where idlinea =" + apic(idlinea) + "and idfasciaoraria =" + apic(idFascia));

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }
        public response getBiglietti(string id)
        {
            response ris = new response();
            try
            {
                if (isEmpty(id))
                {
                    throw new Exception(listaErrori[2]);
                }



                ris = esegui("Select biglietti.*  from bigliettilinee left Join  biglietti on  biglietti.id = bigliettilinee.idbiglietto  where idlinea = " + apic(id));
                if (!IsDataTableEmpty(ris.data))
                {
                    ris.data.Columns.Add("traduzioniNome", typeof(DataTable));
                    ris.data.Columns.Add("traduzioniDes", typeof(DataTable));

                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {

                        ris.data.Rows[i]["traduzioniNome"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["nome"].ToString());
                        ris.data.Rows[i]["traduzioniDes"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["descrizione"].ToString());

                    }
                }






            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }
        public response getItinerario(string id)
        {
            response ris = new response();
            try
            {
                if (isEmpty(id))
                {
                    throw new Exception(listaErrori[2]);
                }



                ris = esegui("Select itinerari.id, fermate.id as idFermata, fermate.citta, fermate.indirizzo, fermate.note, fermate.foto, fermate.lat, fermate.lng from itinerari left join fermate on itinerari.idFermata = fermate.id  where idlinea = " + apic(id));
                if (!IsDataTableEmpty(ris.data))
                {

                    ris.data.Columns.Add("traduzioniCitta", typeof(DataTable));
                    ris.data.Columns.Add("traduzioniNote", typeof(DataTable));


                    for (var i = 0; i < ris.data.Rows.Count; i++)
                    {

                        ris.data.Rows[i]["traduzioniCitta"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["citta"].ToString());
                        ris.data.Rows[i]["traduzioniNote"] = traduzioni.getTraduzioniPrivate(ris.data.Rows[i]["note"].ToString());

                    }

                }




            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }


        [HttpDelete]
        public response delete(string id)
        {

            response ris = new response();
            try
            {
                if (isEmpty(id))
                {
                    throw new Exception(listaErrori[2]);
                }
                if (isValidSession() && getRuolo() < 10)
                {
                    response check = get(id);
                    if (!IsDataTableEmpty(check.data))
                    {
                        List<string> q = new List<string>();
                        string idlinea = check.data.Rows[0]["id"].ToString();
                        q.Add("delete from linee where id =" + apic(check.data.Rows[0]["id"].ToString()));
                        q.Add("delete from traduzioniPrivate where nome =" + apic(check.data.Rows[0]["nome"].ToString()) + " or nome =" + apic(check.data.Rows[0]["descrizione"].ToString()));
                        q.Add("delete from itinerari where idlinea  =" + apic(check.data.Rows[0]["id"].ToString()));
                        q.Add("delete from bigliettilinee where idlinea =" + apic(check.data.Rows[0]["id"].ToString()));
                        q.Add("delete from fasceOrarie where idlinea  =" + apic(check.data.Rows[0]["id"].ToString()));
                        q.Add("delete from calendario where idlinea  =" + apic(check.data.Rows[0]["id"].ToString()));
                        q.Add("delete from settingfasciaoraria where idlinea  =" + apic(check.data.Rows[0]["id"].ToString()));
                        q.Add("delete from aperture where idlinea =" + apic(check.data.Rows[0]["id"].ToString()));
                        eseguiTransact(q, getUtente());
                    }
                    else
                    {
                        throw new Exception(listaErrori[10]);
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
            }
            return ris;



        }


        [HttpPost]
        public response post([FromBody] dynamic data)
        {

            response ris = new response();
            try
            {
                if (isValidSession())
                {

                    List<string> q = new List<string>();
                    q.Add(traduzioniPrivateSet(data["nome"].ToString(), data["traduzioniNome"]));
                    q.Add(traduzioniPrivateSet(data["descrizione"].ToString(), data["traduzioniDesc"]));
                    q.Add("insert into linee (nome,descrizione) values(" + apicVirgola(data["nome"].ToString()) + apic(data["descrizione"].ToString()) + ");");
                    q.Add("SELECT @@IDENTITY AS [@@IDENTITY ];");
                    q.Add("DECLARE @IDLINEA VARCHAR(MAX);");
                    q.Add("SET @IDLINEA = @@IDENTITY;");
                    for (var i = 0; i < data["itinerario"].Count; i++)
                    {
                        q.Add("insert into itinerari (idFermata,idlinea) values(" + apicVirgola(data["itinerario"][i]["idFermata"].ToString()) + "@IDLINEA)");
                    }
                    for (var i = 0; i < data["biglietti"].Count; i++)
                    {
                        q.Add("insert into bigliettilinee (idbiglietto,idlinea) values(" + apicVirgola(data["biglietti"][i]["id"].ToString()) + "@IDLINEA)");
                    }
                    //fasce orarie
                    for (var i = 0; i < data["fasceOrarie"].Count; i++)
                    {
                        string idFascia = (1 + i).ToString();
                        //apertura
                        for (var j = 0; j < data["fasceOrarie"][i]["apertura"].Count; j++)
                        {
                            q.Add("insert into aperture(idlinea,idfasciaoraria,da,al) values(@IDLINEA," + idFascia + "," + apicVirgola(data["fasceOrarie"][i]["apertura"][j]["da"].ToString()) + apic(data["fasceOrarie"][i]["apertura"][j]["a"].ToString()) + ");");
                        }
                        //eccezioni
                        for (var j = 0; j < data["fasceOrarie"][i]["eccezioni"].Count; j++)
                        {
                            q.Add("insert into calendario (idlinea,idfasciaoraria,tipo,chiusura,data) values(@IDLINEA," + idFascia + "," + apicVirgola(data["fasceOrarie"][i]["eccezioni"][j]["tipo"].ToString()) + apicVirgola(data["fasceOrarie"][i]["eccezioni"][j]["chiusura"].ToString()) + apic(data["fasceOrarie"][i]["eccezioni"][j]["data"].ToString()) + ");");
                        }
                        //settings
                        for (var j = 0; j < data["fasceOrarie"][i]["settings"].Count; j++)
                        {
                            q.Add("insert into settingFasciaOraria (idlinea, idfasciaoraria,disattivato,posti,bagagli, bagagliopzionali,prezzoBagagli) values(@IDLINEA," + idFascia + "," + apicVirgola(data["fasceOrarie"][i]["settings"][j]["disattivato"].ToString()) + apicVirgola(data["fasceOrarie"][i]["settings"][j]["posti"].ToString()) + apicVirgola(data["fasceOrarie"][i]["settings"][j]["bagagli"].ToString()) + apicVirgola(data["fasceOrarie"][i]["settings"][j]["bagagliOpzionali"].ToString()) + apic(data["fasceOrarie"][i]["settings"][j]["prezzoBagagli"].ToString()) + ");");
                        }
                        //orari
                        for (var j = 0; j < data["fasceOrarie"][i]["orari"].Count; j++)
                        {
                            q.Add("Insert into fasceOrarie (idlinea,idfasciaoraria,orario,idfermata,guid) values(@IDLINEA," + idFascia + "," + apicVirgola(data["fasceOrarie"][i]["orari"][j]["orario"].ToString()) + apicVirgola(data["fasceOrarie"][i]["orari"][j]["idFermata"].ToString()) + apic(data["fasceOrarie"][i]["guid"].ToString()) + ");");

                        }

                    }




                    ris = eseguiTransact(q, getUtente());

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
        [HttpPut]
        public response put([FromBody] dynamic data)
        {

            response ris = new response();
            try
            {
                if (isValidSession())
                {

                    List<string> q = new List<string>();
                    string id = data["id"].ToString();
                    q.Add(traduzioniPrivateSet(data["nome"].ToString(), data["traduzioniNome"]));
                    q.Add(traduzioniPrivateSet(data["descrizione"].ToString(), data["traduzioniDesc"]));

                    q.Add("DECLARE @IDLINEA VARCHAR(MAX);");
                    q.Add("SET @IDLINEA = " + id + ";");


                    q.Add("delete from itinerari where idlinea  =" + apic(id) + ";");
                    q.Add("delete from bigliettilinee where idlinea =" + apic(id) + ";");
                    q.Add("delete from fasceOrarie where idlinea  =" + apic(id) + ";");
                    q.Add("delete from calendario where idlinea  =" + apic(id) + ";");
                    q.Add("delete from settingfasciaoraria where idlinea  =" + apic(id) + ";");
                    q.Add("delete from aperture where idlinea=" + apic(id) + ";");



                    for (var i = 0; i < data["itinerario"].Count; i++)
                    {
                        q.Add("insert into itinerari (idFermata,idlinea) values(" + apicVirgola(data["itinerario"][i]["idFermata"].ToString()) + "@IDLINEA);");
                    }
                    for (var i = 0; i < data["biglietti"].Count; i++)
                    {
                        q.Add("insert into bigliettilinee (idbiglietto,idlinea) values(" + apicVirgola(data["biglietti"][i]["id"].ToString()) + "@IDLINEA);");
                    }
                    //fasce orarie
                    for (var i = 0; i < data["fasceOrarie"].Count; i++)
                    {
                        string idFascia = (1 + i).ToString();
                        //apertura
                        for (var j = 0; j < data["fasceOrarie"][i]["apertura"].Count; j++)
                        {
                            q.Add("insert into aperture(idlinea,idfasciaoraria,da,al) values(@IDLINEA," + idFascia + "," + apicVirgola(data["fasceOrarie"][i]["apertura"][j]["da"].ToString()) + apic(data["fasceOrarie"][i]["apertura"][j]["a"].ToString()) + ");");
                        }
                        //eccezioni
                        for (var j = 0; j < data["fasceOrarie"][i]["eccezioni"].Count; j++)
                        {
                            q.Add("insert into calendario (idlinea,idfasciaoraria,tipo,chiusura,data) values(@IDLINEA," + idFascia + "," + apicVirgola(data["fasceOrarie"][i]["eccezioni"][j]["tipo"].ToString()) + apicVirgola(data["fasceOrarie"][i]["eccezioni"][j]["chiusura"].ToString()) + apic(data["fasceOrarie"][i]["eccezioni"][j]["data"].ToString()) + ");");
                        }
                        //settings
                        for (var j = 0; j < data["fasceOrarie"][i]["settings"].Count; j++)
                        {
                            q.Add("insert into settingFasciaOraria (idlinea, idfasciaoraria,disattivato,posti,bagagli, bagagliopzionali,prezzoBagagli) values(@IDLINEA," + idFascia + "," + apicVirgola(data["fasceOrarie"][i]["settings"][j]["disattivato"].ToString()) + apicVirgola(data["fasceOrarie"][i]["settings"][j]["posti"].ToString()) + apicVirgola(data["fasceOrarie"][i]["settings"][j]["bagagli"].ToString()) + apicVirgola(data["fasceOrarie"][i]["settings"][j]["bagagliOpzionali"].ToString()) + apic(data["fasceOrarie"][i]["settings"][j]["prezzoBagagli"].ToString()) + ");");
                        }
                        //orari
                        for (var j = 0; j < data["fasceOrarie"][i]["orari"].Count; j++)
                        {
                            q.Add("Insert into fasceOrarie (idlinea,idfasciaoraria,orario,idfermata,guid) values(@IDLINEA," + idFascia + "," + apicVirgola(data["fasceOrarie"][i]["orari"][j]["orario"].ToString()) + apicVirgola(data["fasceOrarie"][i]["orari"][j]["idFermata"].ToString()) + apic(data["fasceOrarie"][i]["guid"].ToString()) + ");");
                        }

                    }




                    ris = eseguiTransact(q, getUtente());

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

    }
}

