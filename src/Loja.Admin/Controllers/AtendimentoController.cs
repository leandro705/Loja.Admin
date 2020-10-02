using Microsoft.AspNetCore.Mvc;

namespace Loja.Admin.Controllers
{    
    public class AtendimentoController : Controller
    {       
        public IActionResult Index()
        {
            return View();
        }
    }
}
