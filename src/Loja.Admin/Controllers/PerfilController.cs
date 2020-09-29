using Microsoft.AspNetCore.Mvc;

namespace Loja.Admin.Controllers{
    
    public class PerfilController : Controller
    {       
        public IActionResult Index(string id)
        {
            return View();
        }
    }
}
