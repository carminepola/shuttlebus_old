using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
namespace core
{
    public class biglietti
    {

        string riferimento { get; set; }
        DataTable bigliettiPerLinea { get; set; }
    }
}