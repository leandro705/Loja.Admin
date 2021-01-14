using Microsoft.AspNetCore.Mvc;

namespace Loja.Admin.Controllers
{    
    public class UsuarioController : Controller
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

        public IActionResult Visualizar()
        {
            return View();
        }
    }
}
