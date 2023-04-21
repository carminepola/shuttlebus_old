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
    public class PagineController : REMController
    {
        [HttpGet]
        public response caricaPagina(string nome)
        {
            response ris = new response();
            try
            {


                ris.data = new pagina();

                if (!isEmpty(nome))
                {
                    response q = esegui("Select * from pagine where nomePagina like " + apic(nome));
                    DataTable pagina = q.data;
                    if (!IsDataTableEmpty(pagina))
                    {
                        string id = pagina.Rows[0]["id"].ToString();
                        q = esegui("select * from form where idPagina =" + apic(id));
                        DataTable form = q.data;
                        if (!IsDataTableEmpty(form))
                        {
                            dynamic f = JsonConvert.DeserializeObject("{'form': '[]'}");
                            List<string> q1 = new List<string>();
                            for (var i = 0; i < form.Rows.Count; i++)
                            {
                                q1.Add("Select * from campi where formId =" + apic(form.Rows[i]["idPagina"].ToString()));




                                //  f.form.(JsonConvert.DeserializeObject("{'nome': " + apic(form.Rows[i]["idPagina"].ToString()) + " , 'campi': []}"));
                            }
                            q = esegui(q1);

                        }







                        //form.Rows[0]["Fields"] = pagina;

                        ris.data = q;
                    }
                    else
                    {
                        throw new Exception(listaErrori[0]);
                    }

                }
                else
                {
                    throw new Exception(listaErrori[5]);
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
