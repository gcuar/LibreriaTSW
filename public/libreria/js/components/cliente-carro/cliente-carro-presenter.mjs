import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClienteCarroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get usuarioId() {
    return libreriaSession.getUsuarioId();
  }

  get cliente() {
    return model.getClientePorId(this.usuarioId);
  }

  get carro() {
    return this.cliente.getCarro();
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
        <td>€ ${item.total.toFixed(2)}</td>
        <td>
          <button data-index="${index}" class="eliminarButton">Eliminar</button>
        </td>
      `;
      this.carroItemsContainer.appendChild(row);
    });

    // Actualizar los totales
    this.subtotalElement.textContent = `€ ${this.carro.subtotal.toFixed(2)}`;
    this.ivaElement.textContent = `€ ${this.carro.iva.toFixed(2)}`;
    this.totalElement.textContent = `€ ${this.carro.total.toFixed(2)}`;

    // Asignar eventos a los inputs y botones
    this.assignEventHandlers();
  }

  assignEventHandlers() {
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

  actualizarCantidad(event) {
    const index = event.target.getAttribute('data-index');
    const nuevaCantidad = parseInt(event.target.value);
    try {
      if (nuevaCantidad <= 0) {
        throw new Error('La cantidad debe ser al menos 1');
      }
      this.cliente.setCarroItemCantidad(index, nuevaCantidad);
      this.renderCarroItems();
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

  async refresh() {
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
