using Microsoft.AspNetCore.Mvc;

namespace Loja.Admin.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
