﻿using Microsoft.AspNetCore.Mvc;

namespace Loja.Admin.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index(string id)
        {
            return View();
        }        
    }
}
