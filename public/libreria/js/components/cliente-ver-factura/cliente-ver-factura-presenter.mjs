import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";

export class ClienteVerFacturaPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get searchParams() {
    return new URLSearchParams(document.location.search);
  }

  get id() {
    return this.searchParams.get('id');
  }

  // Acceder al factura desde el modelo
  getFactura() {
    return model.getFacturaPorId(this.id);
  }

  // Getters y setters para los elementos del DOM
  get numFacturaText() {
    return document.querySelector('#numFacturaText');
  }

  set numFactura(numFactura) {
    this.numFacturaText.textContent = numFactura;
  }

  get fechaText() {
    return document.querySelector('#fechaText');
  }

  set fecha(fecha) {
    this.fechaText.textContent = fecha;
  }

  get razonSocialText() {
    return document.querySelector('#razonSocialText');
  }

  set razonSocial(razonSocial) {
    this.razonSocialText.textContent = razonSocial;
  }

  get dniText() {
    return document.querySelector('#dniText');
  }

  set dni(dni) {
    this.dniText.textContent = dni;
  }

  get direccionText() {
    return document.querySelector('#direccionText');
  }

  set direccion(direccion) {
    this.direccionText.textContent = direccion;
  }

  get emailText() {
    return document.querySelector('#emailText');
  }

  set email(email) {
    this.emailText.textContent = email;
  }

  get clienteText() {
    return document.querySelector('#emailText');
  }

  set cliente(cliente) {
    this.clienteText.textContent = cliente;
  }

 
  // items = [];
  // subtotal;
  // iva;
  // total;



  // Asignar los datos de la factura a los elementos del DOM
  set factura(factura) {
    this.numFactura = factura.numFactura;
    this.fecha = factura.fecha;
    this.razonSocial = factura.razonSocial;
    this.dni = factura.dni;
    this.email = factura.email;
    this.direccion = factura.direccion;
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();

    // Verificar que el usuario es un cliente autenticado
    if (!libreriaSession.esCliente()) {
      this.mensajesPresenter.error('Acceso no autorizado');
      router.navigate('/libreria/home.html');
      return;
    }

    const factura = this.getFactura();
    if (factura) {
      this.factura = factura;
    } else {
      console.error(`Libro ${this.id} no encontrado`);
      this.mensajesPresenter.error('Libro no encontrado');
      this.mensajesPresenter.refresh();
      return;
    }

  }
}
