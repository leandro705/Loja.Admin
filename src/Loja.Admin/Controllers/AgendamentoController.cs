﻿using Microsoft.AspNetCore.Mvc;

namespace Loja.Admin.Controllers
{    
    public class AgendamentoController : Controller
    {       
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Calendario()
        {
            return View();
        }        
    }
}
