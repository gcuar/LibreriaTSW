import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
// import { libreriaSession } from "../../commons/libreria-session.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";


export class ClientePerfilPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }



  get modificarButton() { return document.querySelector('#modifyInput'); }
  get dniInput() { return document.querySelector('#dniInput'); }
  get dniText() { return this.dniInput.value; }
  get nombreInput() { return document.querySelector('#nombreInput'); }
  get nombreText() { return this.nombreInput.value; }
  get apellidosInput() { return document.querySelector('#apellidosInput'); }
  get apellidosText() { return this.apellidosInput.value; }
  get direccionInput() { return document.querySelector('#direccionInput'); }
  get direccionText() { return this.direccionInput.value; }
  get emailInput() { return document.querySelector('#emailInput'); }
  get emailText() { return this.emailInput.value; }
  get passwordInput() { return document.querySelector('#passwordInput'); }
  get passwordText() { return this.passwordInput.value; }
//   get rolSelect() { return document.querySelector('#rolSelect'); }
//   get rolText() { return this.rolSelect.value; }

    get usuarioObject() {
    return {
      dni: this.dniText,
      email: this.emailText,
      password: this.passwordText,
      rol: this.rolText,
      nombre: this.nombreText,
      apellidos: this.apellidosText,
      direccion: this.direccionText
    }
  } 

  async modificarClick(event) {
    event.preventDefault();
    console.log(this.model);
    console.log(this.usuarioObject);
    try {
      //this.model.addUsuario(this.usuarioObject)
      this.mensajesPresenter.mensaje('Usuario modificado');
      router.navigate('/libreria/cliente-home.html');
    } catch (err) {
      console.log(err);
      this.mensajesPresenter.error(err.message);
      await this.mensajesPresenter.refresh();
    }
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    this.modificarButton.onclick = event => this.modificarClick(event);
  }

}