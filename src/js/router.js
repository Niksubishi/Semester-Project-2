export default async function router() {
  const path = window.location.pathname;

  switch (path) {
    case "/":
      await import("./views/home/index.js").then((module) =>
        module.renderListings()
      );
      break;
    case "/src/pages/login/":
      await import("./views/auth/login.js").then((module) =>
        module.initLogin()
      );
      break;
    case "/src/pages/register/":
      await import("./views/auth/register.js").then((module) =>
        module.initRegister()
      );
      break;
    case "/src/pages/listing/index.html":
      await import("./views/listing/single.js").then((module) => {
        module.initListing();
      });
      break;
    case "/src/pages/create/":
      await import("./views/create/index.js").then((module) =>
        module.initCreate()
      );
      break;
      break;
    case "/src/pages/profile/":
      await import("./views/profile/index.js").then((module) =>
        module.initProfile()
      );
      break;
    case "/src/pages/user/index.html":
      await import("./views/user/index.js").then((module) => module.initUser());
      break;
    case "/src/pages/404.html":
      window.location.href = "/src/pages/404.html";
      break;
    default:
      window.location.href = "/src/pages/404.html";
  }
}
