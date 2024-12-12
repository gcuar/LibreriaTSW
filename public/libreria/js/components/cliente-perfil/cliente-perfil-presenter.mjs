import { libreriaSession } from "../../commons/libreria-session.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/proxy.mjs";
import { ROL } from "../../model/model.mjs";
// import { Router } from "../../commons/router.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');


export class ClientePerfilPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }



  get modificarButton() { return document.querySelector('#modificarInput'); }
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
  get rolSelect() { return document.querySelector('#rolSelect'); }
  get rolText() { return this.rolSelect.value; }

  

  
  get searchParams(){
    return new URLSearchParams(document.location.search);
  }

  get id(){
    const id = this.searchParams.get('id');
    console.log("ID capturado:", id);
    return id;
  }

  

  async loadUser() {
    console.log("Ejecutando load...");

    const clienteID = libreriaSession.getUsuarioId();
    console.log("ID obtenido del usuario en sesión:", clienteID);

    const user2 = model.getClientePorId(clienteID);
    console.log("Cliente encontrado:", user2);

    if (user2) {
        this.populateFields(user2);
        console.log('funciona');
    } else {
        this.mensajesPresenter.error('User no encontrado');
        console.error(`User ${clienteID} no encontrado!`);
    }
}

  populateFields(mostrarUser) {
    document.querySelector('#dniInput').value = mostrarUser.dni;
    document.querySelector('#nombreInput').value = mostrarUser.nombre;
    document.querySelector('#apellidosInput').value = mostrarUser.apellidos;
    document.querySelector('#direccionInput').value = mostrarUser.direccion;
    document.querySelector('#emailInput').value = mostrarUser.email;
    console.log(mostrarUser);
    document.querySelector('#passwordInput').value = mostrarUser.password;
  }
  

  async modificarClienteClick(event) {
    event.preventDefault();
        
    const clienteID = libreriaSession.getUsuarioId();
    const user2 = model.getClientePorId(clienteID);

    console.log("este es el id:" + user2._id);
    const clienteData = {
        //_id: user2.id,
        dni: this.dniInput.value,
        nombre: this.nombreInput.value,
        apellidos: this.apellidosInput.value,
        direccion: this.direccionInput.value,
        rol: ROL.CLIENTE,
        email: this.emailInput.value,
        password: this.passwordInput.value
        
    };

    try {
        model.updateCliente(clienteData, clienteID); // Llamada al modelo para actualizar el cliente
        libreriaSession.setUsuarioId(clienteID);
        this.mensajesPresenter.mensaje('Cliente modificado!');
        
        localStorage.setItem('usuarioActual', JSON.stringify(user2));
        const usuarioActual2 = JSON.parse(localStorage.getItem('usuarioActual'));
        console.log(usuarioActual2);
        

        router.navigate('/libreria/cliente-home.html'); 
    } catch (err) {
        console.log(err);
        this.mensajesPresenter.error(err.message);
        await this.mensajesPresenter.refresh();
    }
}

async refresh() {
    console.log("Ejecutando refresh...");
    await super.refresh();
    await this.mensajesPresenter.refresh();
    await this.loadUser();
    
    this.modificarButton.onclick = event => this.modificarClienteClick(event); 
}

}