using System;
using System.Collections.Generic;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;

namespace core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class REMController : DBController
    {
        public response esegui(string q, string idUtente = "")
        {
            response ris = new response();
            try
            {
                List<string> connessione = new List<string>();

                connessione = creaStringaDiConnessione();
                DataSet data = new DataSet();
                data = dbEsegui(q, connessione[0], connessione[1], connessione[2], connessione[3], idUtente);
                DataTable dt = data.Tables[0];
                ris.data = dt;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
            return ris;
        }
        public response eseguiTransact(List<string> q, string idUtente = "")
        {
            response ris = new response();
            try
            {

                ris = esegui(aggiustaqueryTransact(q), idUtente);

            }
            catch (Exception ex)
            {
                ris.error.message = ex.Message;
                return ris;
            }
            return ris;
        }

        public response esegui(List<string> q, string idUtente = "")
        {
            response ris = new response();
            try
            {

                List<string> connessione = new List<string>();
                connessione = creaStringaDiConnessione();
                DataSet data = new DataSet();
                data = dbEsegui(q, connessione[0], connessione[1], connessione[2], connessione[3], idUtente);

                ris.data = data;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return ris;
        }

    }
}
