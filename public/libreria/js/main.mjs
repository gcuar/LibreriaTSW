
import { model } from "./model/model.mjs";
import { seed } from "./model/seeder.mjs";
import { router } from "./commons/router.mjs";

import { InvitadoHomePresenter } from "./components/invitado-home/invitado-home-presenter.mjs";
import { AdminHomePresenter } from "./components/admin-home/admin-home-presenter.mjs";
import { ClienteHomePresenter } from "./components/cliente-home/cliente-home-presenter.mjs";

import { InvitadoVerLibroPresenter } from "./components/invitado-ver-libro/invitado-ver-libro-presenter.mjs";
import { AdminVerLibroPresenter } from "./components/admin-ver-libro/admin-ver-libro-presenter.mjs";
import { ClienteVerLibroPresenter } from "./components/cliente-ver-libro/cliente-ver-libro-presenter.mjs"

import { InvitadoIngresoPresenter } from "./components/invitado-ingreso/invitado-ingreso-presenter.mjs";

// import { CatalogoPresenter } from "./components/catalogo/catalogo-presenter.mjs";
// import { AgregarLibroPresenter } from "./components/agregar-libro/agregar-libro-presenter.mjs";


export function init() {
  seed();
  //console.log(model)
  

  router.register(/^\/libreria\/index.html$/, new InvitadoHomePresenter(model, 'invitado-home'));
  router.register(/^\/libreria\/admin-home.html$/, new AdminHomePresenter(model, 'admin-home'));
  router.register(/^\/libreria\/cliente-home.html$/, new ClienteHomePresenter(model, 'cliente-home'));

  router.register(/^\/libreria\/invitado-ver-libro.html/, new InvitadoVerLibroPresenter(model, 'invitado-ver-libro'));
  router.register(/^\/libreria\/admin-ver-libro.html/, new AdminVerLibroPresenter(model, 'admin-ver-libro'))
  router.register(/^\/libreria\/cliente-ver-libro.html/, new ClienteVerLibroPresenter(model, 'cliente-ver-libro'))

  router.register(/^\/libreria\/invitado-ingreso.html/, new InvitadoIngresoPresenter(model, 'invitado-ingreso'))
  

  // router.register(/^\/libreria\/home.html$/, new HomePresenter(model, 'home'));
  // router.register(/^\/libreria$/, new HomePresenter(model, 'home'));
  // router.register(/^\/libreria\/catalogo.html$/, new CatalogoPresenter(model, 'catalogo'));
  // router.register(/^\/libreria\/agregar-libro.html$/, new AgregarLibroPresenter(model, 'agregar-libro'));



 
  
  router.handleLocation();
}