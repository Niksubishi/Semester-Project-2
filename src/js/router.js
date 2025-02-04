export default async function router() {
  const path = window.location.pathname;

  switch (path) {
    case "/":
      await import("./views/home/index.js").then((module) =>
        module.renderListings()
      );
      break;
    case "/src/pages/login/index.html":
      await import("./views/auth/login.js").then((module) =>
        module.initLogin()
      );
      break;
    case "/src/pages/register/index.html":
      await import("./views/auth/register.js").then((module) =>
        module.initRegister()
      );
      break;
    case "/src/pages/listing/index.html":
      await import("./views/listing/single.js").then((module) => {
        module.initListing();
      });
      break;
    case "/src/pages/create/index.html":
      await import("./views/create/index.js").then((module) =>
        module.initCreate()
      );
      break;
    case "/src/pages/profile/index.html":
      await import("./views/profile/index.js").then((module) =>
        module.initProfile()
      );
      break;
    case "/src/pages/user/index.html":
      await import("./views/user/index.js").then((module) => module.initUser());
      break;
    case "/src/pages/404.html":
      await import("./views/error/404.js").then((module) => module.init404());
      break;
    default:
      await import("./views/error/404.js").then((module) => module.init404());
  }
}
