using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Data;
using System.Dynamic;
using System.Net.Http.Headers;
using System.Net.Sockets;
using System.Net.NetworkInformation;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
namespace core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class uploadController : FunzioniAggiuntive
    {

        [HttpPost]
        [RequestFormLimits(ValueLengthLimit = int.MaxValue, MultipartBodyLengthLimit = int.MaxValue)]
        public response post(string preFile = "")
        {
#if RELEASE

           var posizioneCartella = "public/";
#else
            var posizioneCartella = "../../public/";

#endif

            var files = Request.HttpContext.Request.Form.Files;

            response ris = new response();
            try
            {
                List<string> listaFile = new List<string>();
                if (!isValidSession(getToken()))
                {
                    throw new Exception(listaErrori[1]);
                }

                if (files.Count > 0)
                {
                    if (!isEmpty(preFile))
                    {

                        preFile = removeSpecialCharacters(preFile) + "-";

                    }

                    for (int i = 0; i < files.Count; i++)
                    {

                        IFormFile file = Request.HttpContext.Request.Form.Files[i];
                        var fileName = System.IO.Path.GetFileName(file.FileName);
                        fileName = removeSpecialCharacters(fileName);
                        scriviTracciaUtente("1Ha caricato un file: " + fileName, getIdUtente(), "Upload", getIp());
                        scriviLog("File caricato:" + fileName + " caricato da" + getIdUtente(), "upload");

                        scriviTracciaUtente("path:" + posizioneCartella.ToString() + preFile.ToString()+ fileName , "upload");


                        // If file with same name exists delete it
                        if (System.IO.File.Exists(posizioneCartella + preFile + fileName))
                        {
                            System.IO.File.Delete(posizioneCartella + preFile + fileName);
                        }

                        // Create new local file and copy contents of uploaded file
                        using (var localFile = System.IO.File.OpenWrite(posizioneCartella + preFile + fileName))
                        using (var uploadedFile = file.OpenReadStream())
                        {
                            uploadedFile.CopyTo(localFile);
                        }

                        listaFile.Add(preFile + fileName);

                    }
                    ris.data = listaFile;
                }
                else
                {
                    throw new Exception(listaErrori[2]);
                }


            }
            catch (Exception ex)
            {
                ris = catchError(ex.Message, ex.StackTrace);
                if (files.Count > 0)
                {
                    for (int i = 0; i < files.Count; i++)
                    {
                        IFormFile file = Request.HttpContext.Request.Form.Files[i];
                        var fileName = System.IO.Path.GetFileName(file.FileName);
                        if (!isEmpty(preFile))
                        {
                            preFile += "-";
                        }
                        // If file with same name exists delete it
                        if (System.IO.File.Exists(posizioneCartella + preFile + fileName))
                        {
                            System.IO.File.Delete(posizioneCartella + preFile + fileName);
                        }
                    }
                }
            }
            return ris;



        }



    }

}
