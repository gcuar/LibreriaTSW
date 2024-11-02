import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClienteFacturasPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    // Inicializamos el MensajesPresenter para mostrar mensajes al usuario
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  // Obtener el ID del usuario desde la sesión
  get usuarioId() {
    return libreriaSession.getUsuarioId();
  }

  // Obtener el cliente del modelo usando el ID del usuario
  get cliente() {
    return model.getClientePorId(this.usuarioId);
  }
  
  // Método para inicializar y refrescar la vista
  async refresh() {

    console.log("existo");
  
    await super.refresh();
    await this.mensajesPresenter.refresh();

  }
}
