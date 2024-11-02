import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClientePagoPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
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

  // Obtener el carro de compras del cliente
  get carro() {
    return this.cliente.getCarro();
  }

  // Referencias a elementos del DOM
  get fechaInput() {
    return document.querySelector('#fecha');
  }

  get dniInput() {
    return document.querySelector('#dni');
  }

  get razonSocialInput() {
    return document.querySelector('#razonSocial');
  }

  get direccionInput() {
    return document.querySelector('#direccion');
  }

  get emailInput() {
    return document.querySelector('#email');
  }

  get carroItemsContainer() {
    return document.querySelector('#carroItems');
  }

  get subtotalElement() {
    return document.querySelector('#subtotal');
  }

  get ivaElement() {
    return document.querySelector('#iva');
  }

  get totalElement() {
    return document.querySelector('#total');
  }

  get pagarButton() {
    return document.querySelector('#pagarButton');
  }

  // Método para inicializar y refrescar la vista
  async refresh() {
    // Verificar que el usuario es un cliente autenticado
    if (!libreriaSession.esCliente()) {
      this.mensajesPresenter.error('Acceso no autorizado');
      router.navigate('/libreria/home.html');
      return;
    }
    await super.refresh();
    await this.mensajesPresenter.refresh();

    // Rellenar los campos con los datos del cliente
    this.fechaInput.value = new Date().toLocaleDateString();
    this.dniInput.value = this.cliente.dni;
    this.razonSocialInput.value = `${this.cliente.nombre} ${this.cliente.apellidos}`;
    this.direccionInput.value = this.cliente.direccion;
    this.emailInput.value = this.cliente.email;

    // Renderizar los ítems del carro
    this.renderCarroItems();

    // Asignar eventos
    this.assignEventHandlers();
  }

  // Método para renderizar los ítems del carro en la tabla
  renderCarroItems() {
    this.carroItemsContainer.innerHTML = '';

    this.carro.items.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.libro.titulo}</td>
        <td>
          <input type="number" min="1" value="${item.cantidad}" data-index="${index}" class="cantidadInput">
        </td>
        <td>€ ${item.libro.precio.toFixed(2)}</td>
        <td>€ ${(item.libro.precio * item.cantidad).toFixed(2)}</td>
        <td>
          <button data-index="${index}" class="eliminarButton">Eliminar</button>
        </td>
      `;
      this.carroItemsContainer.appendChild(row);
    });

    // Actualizar los totales
    this.actualizarTotales();

    // Asignar eventos a los elementos dinámicos
    this.assignItemEventHandlers();
  }

  // Método para actualizar los totales del carro
  actualizarTotales() {
    this.subtotalElement.textContent = `€ ${this.carro.subtotal.toFixed(2)}`;
    this.ivaElement.textContent = `€ ${this.carro.iva.toFixed(2)}`;
    this.totalElement.textContent = `€ ${this.carro.total.toFixed(2)}`;
  }

  // Método para asignar eventos a los elementos dinámicos del carro
  assignItemEventHandlers() {
    // Manejar cambios en las cantidades
    const cantidadInputs = document.querySelectorAll('.cantidadInput');
    cantidadInputs.forEach(input => {
      input.addEventListener('change', event => this.actualizarCantidad(event));
    });

    // Manejar eliminación de ítems
    const eliminarButtons = document.querySelectorAll('.eliminarButton');
    eliminarButtons.forEach(button => {
      button.addEventListener('click', event => this.eliminarItem(event));
    });
  }

  // Método para asignar eventos generales
  assignEventHandlers() {
    this.pagarButton.onclick = event => this.pagarClick(event);
  }

  // Método para actualizar la cantidad de un ítem
  actualizarCantidad(event) {
    const index = event.target.getAttribute('data-index');
    const nuevaCantidad = parseInt(event.target.value);
    try {
      if (nuevaCantidad <= 0 || isNaN(nuevaCantidad)) {
        throw new Error('La cantidad debe ser un número entero positivo.');
      }
      this.cliente.setCarroItemCantidad(index, nuevaCantidad);
      this.renderCarroItems();
    } catch (error) {
      this.mensajesPresenter.error(error.message);
      this.mensajesPresenter.refresh();
    }
  }

  // Método para eliminar un ítem del carro
  eliminarItem(event) {
    const index = event.target.getAttribute('data-index');
    try {
      this.cliente.borrarCarroItem(index);
      this.renderCarroItems();
    } catch (error) {
      this.mensajesPresenter.error(error.message);
      this.mensajesPresenter.refresh();
    }
  }

  // Método para manejar el evento de pagar
  pagarClick(event) {
    event.preventDefault();
    try {
      // Aquí podrías agregar lógica para generar una factura o confirmar la compra
      // Por simplicidad, vaciaremos el carro y mostraremos un mensaje

      // Vaciar el carro
      this.cliente.carro.removeItems();
      this.renderCarroItems();

      // Mostrar mensaje de éxito
      this.mensajesPresenter.mensaje('¡Compra realizada con éxito!');
      this.mensajesPresenter.refresh();
    } catch (error) {
      this.mensajesPresenter.error(error.message);
      this.mensajesPresenter.refresh();
    }
  }
}
