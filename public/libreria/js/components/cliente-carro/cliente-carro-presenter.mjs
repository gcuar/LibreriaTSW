import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClienteCarroPresenter extends Presenter {
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

  // Obtener el carro de compras del cliente
  get carro() {
    return this.cliente.getCarro();
  }

  // Referencias a elementos del DOM
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

  // get comprarButton() {
  //   return document.querySelector('#comprarButton');
  // }

  get comprarButton() {
    return document.querySelector('#comprarLink');
  }

  // Método para renderizar los ítems del carro en la tabla
  renderCarroItems() {
    // Limpiamos el contenido actual del tbody
    this.carroItemsContainer.innerHTML = '';
    // Iteramos sobre cada ítem en el carro
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

    // Actualizamos los totales
    this.actualizarTotales();

    // Asignamos eventos a los elementos dinámicos
    this.assignEventHandlers();
  }

  // Método para actualizar los totales del carro
  actualizarTotales() {
    this.subtotalElement.textContent = `€ ${this.carro.subtotal.toFixed(2)}`;
    this.ivaElement.textContent = `€ ${this.carro.iva.toFixed(2)}`;
    this.totalElement.textContent = `€ ${this.carro.total.toFixed(2)}`;
  }

  // Método para asignar eventos a los elementos dinámicos
  assignEventHandlers() {
    // Manejar cambios en las cantidades
    const cantidadInputs = document.querySelectorAll('.cantidadInput');
    cantidadInputs.forEach(input => {
      input.addEventListener('change', event => this.actualizarCantidad(event));
    });
    const eliminarButtons = document.querySelectorAll('.eliminarButton');
  eliminarButtons.forEach(button => {
    button.addEventListener('click', event => this.eliminarItem(event));
  });
    // Asignar evento al botón de comprar
    this.comprarButton.onclick = event => this.comprarClick(event);
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

  // Método para manejar el evento de comprar
  comprarClick(event) {
    event.preventDefault();
    try {
      // Aquí iría la lógica para procesar la compra, como generar una factura
      // Por simplicidad, limpiaremos el carro y mostraremos un mensaje
      this.cliente.carro.removeItems();
      this.renderCarroItems();
      this.mensajesPresenter.mensaje('¡Compra realizada con éxito!');
      this.mensajesPresenter.refresh();
    } catch (error) {
      this.mensajesPresenter.error(error.message);
      this.mensajesPresenter.refresh();
    }
  }
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
    this.renderCarroItems();
  }
}
