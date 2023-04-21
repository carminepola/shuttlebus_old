using System;
using System.ComponentModel.DataAnnotations;

namespace core
{
    public class mail
    {

        public string mittente { get; set; }
        public string destinatario { get; set; }
        public string oggetto { get; set; }
        public string testo { get; set; }
    }

}