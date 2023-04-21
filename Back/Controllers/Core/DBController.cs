using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json;
namespace core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DBController : CommonController
    {

        public DataSet dbEsegui(string query, string ip, string db, string nomeUtente, string password, string idUtente = "")
        {

            DataSet ris = new DataSet();

            try
            {
                DataTable tabella = new DataTable();
                string conn = connessione(ip, db, nomeUtente, password);

                SqlConnection connection = new SqlConnection(conn);
                connection.Open();
                SqlCommand comm = new SqlCommand(query, connection);
                connection.Close();
                SqlDataAdapter da = new SqlDataAdapter(comm);
                da.Fill(tabella);
                ris.Tables.Add(tabella);
                da.Dispose();
                log("Query", "Query:\n" + query + "\n\nRisposta:\n" + JsonConvert.SerializeObject(ris.Tables), idUtente);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            return ris;
        }
        public DataSet dbEsegui(List<string> query, string ip, string db, string nomeUtente, string password, string idUtente = "")
        {
            log("Query eseguita", "", idUtente);
            DataSet ris = new DataSet();

            try
            {
                string conn = connessione(ip, db, nomeUtente, password);
                SqlConnection connection = new SqlConnection(conn);
                connection.Open();
                for (int i = 0; i < query.Count; i++)
                {
                    DataTable table = new DataTable("Table" + (i + 1));
                    SqlCommand comm = new SqlCommand(query[i], connection);
                    SqlDataAdapter da = new SqlDataAdapter(comm);
                    da.Fill(table);
                    ris.Tables.Add(table);
                    da.Dispose();
                }
                connection.Close();
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            return ris;
        }
    }
}
