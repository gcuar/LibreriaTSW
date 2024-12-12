import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/proxy.mjs";
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

  get numero() {
    return this.searchParams.get('numero');
  }

  // Acceder al factura desde el modelo
  getFactura() {
    return model.getFacturaPorNumero(this.numero);
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
    return document.querySelector('#clienteText');
  }

  set cliente(cliente) {
    this.clienteText.textContent = cliente;
  }

  get subtotalText(){
    return document.querySelector('#subtotalText');
  }

  set subtotal(subtotal) {
    this.subtotalText.textContent = subtotal;
  }

  get ivaText(){
    return document.querySelector('#ivaText');
  }

  set iva(iva) {
    this.ivaText.textContent = iva;
  }

  get totalText(){
    return document.querySelector('#totalText');
  }

  set total(total) {
    this.totalText.textContent = total;
  }
 

  // Asignar los datos de la factura a los elementos del DOM
  set factura(factura) {
    this.numFactura = factura.numero;
    this.fecha = factura.fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    this.razonSocial = factura.razonSocial;
    this.dni = factura.dni;
    this.email = factura.email;
    this.direccion = factura.direccion;
    this.cliente = `${factura.cliente.nombre} ${factura.cliente.apellidos}`;

    this.subtotal = `€ ${factura.subtotal.toFixed(2)}`
    this.iva = `€ ${factura.iva.toFixed(2)}`
    this.total = `€ ${factura.total.toFixed(2)}`
  }

  renderFacturaItems(items) {
    const carroItemsContainer = document.querySelector('#carroItems');
    carroItemsContainer.innerHTML = '';
  
    items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.libro.titulo}</td>
        <td>${item.cantidad}</td>
        <td>€ ${item.libro.precio.toFixed(2)}</td>
        <td>€ ${(item.libro.precio * item.cantidad).toFixed(2)}</td>
      `;
      carroItemsContainer.appendChild(row);
    });
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
    console.log('Número de factura desde la URL:', this.numero);
    const factura = this.getFactura();
    console.log('Factura obtenida:', factura);
    if (factura) {
      this.factura = factura;
      this.renderFacturaItems(factura.items);
    } else {
      console.error(`Factura ${this.id} no encontrada`);
      this.mensajesPresenter.error('Factura no encontrada');
      this.mensajesPresenter.refresh();
      return;
    }

  }
}
