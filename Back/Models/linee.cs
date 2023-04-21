using System;
using System.ComponentModel.DataAnnotations;

namespace core
{
    public class linea
    {
        private Controllers.CommonController c = new Controllers.CommonController();
        private dynamic _data;
        public dynamic data
        {
            get
            {
                return _data;
            }
            set
            {
                _data = value;
            }
        }
        private error _error = new error();
        public error error
        {
            get
            {
                return _error;
            }
            set
            {
                _error = value;
            }

        }


    }

}