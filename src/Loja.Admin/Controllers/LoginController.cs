using Microsoft.AspNetCore.Mvc;

namespace Loja.Admin.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
