 
import { proxy } from "./model/proxy.mjs";
// import { seed } from "./model/seeder.mjs";
import { router } from "./commons/router.mjs";

import { InvitadoHomePresenter } from "./components/invitado-home/invitado-home-presenter.mjs";
import { InvitadoVerLibroPresenter } from "./components/invitado-ver-libro/invitado-ver-libro-presenter.mjs";
import { InvitadoRegistroPresenter } from "./components/invitado-registro/invitado-registro-presenter.mjs";
import { InvitadoIngresoPresenter } from "./components/invitado-ingreso/invitado-ingreso-presenter.mjs";

import { AdminAgregarLibroPresenter } from "./components/admin-agregar-libro/admin-agregar-libro-presenter.mjs";
import { AdminModificarLibroPresenter } from "./components/admin-modificar-libro/admin-modificar-libro-presenter.mjs";
import { AdminPerfilPresenter } from "./components/admin-perfil/admin-perfil-presenter.mjs";
import { AdminVerLibroPresenter } from "./components/admin-ver-libro/admin-ver-libro-presenter.mjs";
import { AdminHomePresenter } from "./components/admin-home/admin-home-presenter.mjs";

import { ClienteHomePresenter } from "./components/cliente-home/cliente-home-presenter.mjs";
import { ClienteCarroPresenter } from "./components/cliente-carro/cliente-carro-presenter.mjs";
import { ClienteVerLibroPresenter } from "./components/cliente-ver-libro/cliente-ver-libro-presenter.mjs";
import { ClientePerfilPresenter } from "./components/cliente-perfil/cliente-perfil-presenter.mjs";
import { ClientePagoPresenter } from './components/cliente-pago/cliente-pago-presenter.mjs';
import { ClienteFacturasPresenter } from "./components/cliente-facturas/cliente-facturas-presenter.mjs";
import { ClienteVerFacturaPresenter } from "./components/cliente-ver-factura/cliente-ver-factura-presenter.mjs";



export function init() {
  // seed();

  router.register(/^\/libreria\/index\.html$/, new InvitadoHomePresenter(proxy, 'invitado-home'));
  router.register(/^\/libreria\/home\.html$/, new InvitadoHomePresenter(proxy, 'invitado-home'));
  router.register(/^\/libreria$/, new InvitadoHomePresenter(proxy, 'invitado-home'));
  router.register(/^\/libreria\/invitado-ingreso\.html$/, new InvitadoIngresoPresenter(proxy, 'invitado-ingreso'));
  router.register(/^\/libreria\/invitado-registro\.html$/, new InvitadoRegistroPresenter(proxy, 'invitado-registro'));
  router.register(/^\/libreria\/invitado-ver-libro.html/, new InvitadoVerLibroPresenter(proxy, 'invitado-ver-libro'));
 
  router.register(/^\/libreria\/admin-home.html$/, new AdminHomePresenter(proxy, 'admin-home'));
  router.register(/^\/libreria\/admin-agregar-libro.html$/, new AdminAgregarLibroPresenter(proxy, 'admin-agregar-libro'));
  router.register(/^\/libreria\/admin-modificar-libro.html/, new AdminModificarLibroPresenter(proxy, 'admin-modificar-libro'));
  router.register(/^\/libreria\/admin-ver-libro.html/, new AdminVerLibroPresenter(proxy, 'admin-ver-libro'));
  router.register(/^\/libreria\/admin-perfil.html/, new AdminPerfilPresenter(proxy, 'admin-perfil'));

  router.register(/^\/libreria\/cliente-home.html$/, new ClienteHomePresenter(proxy, 'cliente-home'));
  router.register(/^\/libreria\/cliente-perfil.html/, new ClientePerfilPresenter(proxy, 'cliente-perfil'));
  router.register(/^\/libreria\/cliente-ver-libro.html/, new ClienteVerLibroPresenter(proxy, 'cliente-ver-libro'));
  router.register(/^\/libreria\/cliente-carro\.html$/, new ClienteCarroPresenter(proxy, 'cliente-carro'));
  router.register(/^\/libreria\/cliente-pago\.html$/, new ClientePagoPresenter(proxy, 'cliente-pago'));
  router.register(/^\/libreria\/cliente-facturas.html/, new ClienteFacturasPresenter(proxy, 'cliente-facturas'));
  router.register(/^\/libreria\/cliente-ver-factura.html/, new ClienteVerFacturaPresenter(proxy, 'cliente-ver-factura'));

  router.handleLocation();
}