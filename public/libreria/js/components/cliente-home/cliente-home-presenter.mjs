import { libreriaSession } from "../../commons/libreria-session.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { proxy } from "../../model/proxy.mjs";
import { ClienteCatalogoLibroPresenter } from "../cliente-catalogo-libro/cliente-catalogo-libro-presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { ClienteCarroPresenter } from "../cliente-carro/cliente-carro-presenter.mjs";


export class ClienteHomePresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get catalogo() {
    return document.querySelector('catalogo');
  }

  get salirLink() {
    return document.querySelector('#salirLink');
  }

  async salirClick(event) {
    event.preventDefault();
    libreriaSession.salir();
    this.mensajesPresenter.mensaje('Ha salido con éxito');
    router.navigate('./index.html');
    // await this.mensajesPresenter.refresh();
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    let libros = await this.model.getLibros();;
    // Importante!
    await Promise.all(libros.map(async (l) => { return await new ClienteCatalogoLibroPresenter(l, 'cliente-catalogo-libro', '#catalogo').refresh() }));
    this.salirLink.onclick = event => this.salirClick(event);
    const mensajeExito = libreriaSession.getMensajeExito();
    if (mensajeExito) {
      this.mensajesPresenter.mensaje(mensajeExito);
      await this.mensajesPresenter.refresh();
    }
  }
}