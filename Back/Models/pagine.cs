using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace core
{
    public class valori
    {
        public int id { get; set; }
        public string nome { get; set; }
        public string selezionato { get; set; }
    }

    public class campo
    {
        public int id { get; set; }
        public string name { get; set; }
        public string accept { get; set; }
        public string alt { get; set; }
        public string autocomplete { get; set; }
        public bool autofocus { get; set; }
        public bool selezionato { get; set; }
        public bool disabled { get; set; }
        public int formId { get; set; }
        public string max { get; set; }
        public int maxlength { get; set; }
        public string min { get; set; }
        public int minlength { get; set; }
        public string pattern { get; set; }
        public object placeholder { get; set; }
        public bool soloLettura { get; set; }
        public bool required { get; set; }
        public object src { get; set; }
        public double step { get; set; }
        public string type { get; set; }
        public int value { get; set; }
        public List<valori> valori { get; set; }
        public string classi { get; set; }

    }
    public class bottone
    {
        public string id { get; set; }
        public string nome { get; set; }
        public string type { get; set; }
        public string typeButton { get; set; }
        public string function { get; set; }
        public string classi { get; set; }
        public string icon { get; set; }
    }

    public class form
    {

        string titolo { get; set; }
        string icona { get; set; }
        string descrizione { get; set; }
        string attenzione { get; set; }
        List<campo> campi { get; set; }
        List<bottone> bottoni { get; set; }
        List<bottone> bottoniAggiuntivi { get; set; }

    }
    public class pagina
    {
        private Controllers.CommonController c = new Controllers.CommonController();
        private List<form> _form = new List<form>();
        public List<form> form
        {
            get
            {
                return _form;
            }
            set
            {
                _form = value;
            }
        }
        public string nome { get; set; }
        public string titolo { get; set; }
        public string descrizione { get; set; }
        public string keywords { get; set; }
        public string immagine { get; set; }

    }

}