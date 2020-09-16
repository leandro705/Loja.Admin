using Microsoft.AspNetCore.Mvc;

namespace Loja.Admin.Controllers
{
    [Route("recuperar-senha")]
    public class RecuperarSenhaController : Controller
    {
        [Route("atualizar-senha")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
