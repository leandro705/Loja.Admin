using Microsoft.AspNetCore.Mvc;

namespace Loja.Admin.Controllers
{    
    public class ServicoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Cadastro()
        {
            return View();
        }

        public IActionResult Edicao()
        {
            return View();
        }
    }
}
