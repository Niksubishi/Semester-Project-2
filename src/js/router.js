export default async function router() {
  const path = window.location.pathname;

  switch (path) {
    case "/":
      await import("./views/home/index.js").then((module) =>
        module.renderListings()
      );
      break;
    case "/src/pages/login/":
    case "/src/pages/login/index.html":
      await import("./views/auth/login.js").then((module) =>
        module.initLogin()
      );
      break;
    case "/src/pages/register/":
    case "/src/pages/register/index.html":
      await import("./views/auth/register.js").then((module) =>
        module.initRegister()
      );
      break;
    case "/src/pages/listing/":
    case "/src/pages/listing/index.html":
      await import("./views/listing/single.js").then((module) => {
        module.initListing();
      });
      break;
    case "/src/pages/create/":
    case "/src/pages/create/index.html":
      await import("./views/create/index.js").then((module) =>
        module.initCreate()
      );
      break;
    case "/src/pages/profile/":
    case "/src/pages/profile/index.html":
      await import("./views/profile/index.js").then((module) =>
        module.initProfile()
      );
      break;
    case "/src/pages/user/":
    case "/src/pages/user/index.html":
      await import("./views/user/index.js").then((module) => module.initUser());
      break;
    case "/src/pages/404.html":
      // Simple 404 handling - just show the HTML page
      document.querySelector('main').innerHTML = '<h1 class="text-center text-4xl mt-20">404 - Page Not Found</h1><p class="text-center mt-4"><a href="/" class="text-blue-500 hover:underline">Go back to home</a></p>';
      break;
    default:
      // Prevent infinite redirect loop
      if (!path.includes("404")) {
        window.location.href = "/src/pages/404.html";
      } else {
        document.querySelector('main').innerHTML = '<h1 class="text-center text-4xl mt-20">404 - Page Not Found</h1><p class="text-center mt-4"><a href="/" class="text-blue-500 hover:underline">Go back to home</a></p>';
      }
  }
}
