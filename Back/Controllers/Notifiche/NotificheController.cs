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
    public class NotificheController : FunzioniAggiuntive
    {
        [HttpDelete]
        public response delete(string idKey = "")
        {
            response ris = new response();
            try
            {
                if (isValidSession())
                {
                    if (isEmpty(idKey))
                    {

                        esegui("DELETE FROM notifiche where idUtente =" + apic(getIdUtente()));
                    }
                    else
                    {
                        esegui("DELETE FROM notifiche where id =" + apic(idKey));
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
        public response lette(string idKey = "")
        {
            response ris = new response();
            try
            {
                if (isValidSession())
                {
                    if (isEmpty(idKey))
                    {
                        esegui("Update notifiche set dataLettura = SYSDATETIME() where idUtente =" + apic(getIdUtente()));
                    }
                    else
                    {
                        esegui("Update notifiche set dataLettura = SYSDATETIME() where id =" + apic(idKey));
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
        [HttpOptions]
        public response pushed(string idKey = "")
        {
            response ris = new response();
            try
            {
                if (isValidSession())
                {
                    if (isEmpty(idKey))
                    {
                        esegui("Update notifiche set pushed = 1 where idUtente =" + apic(getIdUtente()));
                    }
                    else
                    {
                        esegui("Update notifiche set pushed = 1  where id =" + apic(idKey));
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
        [HttpGet]
        public response getNotifiche(string idKey = "")
        {

            response ris = new response();
            try
            {

                if (isValidSession())
                {
                    if (!isEmpty(idKey))
                    {
                        ris = esegui("Select * from notifiche where id=" + apic(idKey));
                        esegui("update notifiche set pushed = 1 where id=" + apic(idKey));

                    }
                    else
                    {
                        ris = esegui("Select * from notifiche where idUtente=" + apic(getIdUtente()));
                        esegui("update notifiche set pushed = 1 where idUtente=" + apic(getIdUtente()));
                    }
                }
                
            }
            catch (Exception ex)
            {
                 
            }
            return ris;
        }
    }
}
