using System;
using System.ComponentModel.DataAnnotations;

namespace core
{
    public class error
    {
        private Controllers.CommonController c = new Controllers.CommonController();
        private dynamic _info;
        public dynamic info
        {
            get
            {
                return _info;
            }
            set
            {
                _info = value;
            }
        }
        private bool _exist = false;
        public bool exist
        {
            get { return _exist; }
            set => _exist = value;
        }
        private string _message = "";
        public string message
        {
            get { return _message; }
            set => _message = value;
        }
        private string _stack = "";
        public string stack
        {

            get { return _stack; }
            set => _stack = value;
        }
        private int _code = 0;
        public int code
        {

            get { return _code; }
            set => _code = value;
        }
    }
}