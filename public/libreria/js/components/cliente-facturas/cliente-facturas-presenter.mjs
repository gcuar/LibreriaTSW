import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { proxy } from "../../model/proxy.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClienteFacturasPresenter extends Presenter {
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

  get facturasItemsContainer() {
    return document.querySelector('#facturasItems');
  }

  get totalFacturasElement() {
    return document.querySelector('#totalFacturas');
  }

  async refresh() {
    if (!libreriaSession.esCliente()) {
      this.mensajesPresenter.error('Acceso no autorizado');
      router.navigate('/libreria/home.html');
      return;
    }
    await super.refresh();
    await this.mensajesPresenter.refresh();
    this.renderFacturas();
  }

  renderFacturas() {
    const facturas = model.getFacturasPorClienteId(this.cliente._id);
    this.facturasItemsContainer.innerHTML = '';

    let totalFacturas = 0;

    facturas.forEach(factura => {
      console.log('Renderizando factura número:', factura.numero);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${factura.numero}</td>
        <td>${factura.fecha.toLocaleDateString()}</td>
        <td>€ ${factura.total.toFixed(2)}</td>
        <td>
          <button data-numero="${factura.numero}" class="verButton">Ver</button> 
        </td>
      `;
      this.facturasItemsContainer.appendChild(row);

      totalFacturas += factura.total;
    });

    this.totalFacturasElement.textContent = `€ ${totalFacturas.toFixed(2)}`;

    // Asignar eventos a los botones "Ver"
    this.assignEventHandlers();
  }

  assignEventHandlers() {
    const verButtons = document.querySelectorAll('.verButton');
    verButtons.forEach(button => {
      button.addEventListener('click', event => this.verFactura(event));
    });
  }

  verFactura(event) {
    event.preventDefault();
    const facturaNumero = event.target.getAttribute('data-numero');
    console.log('Número de factura seleccionado:', facturaNumero);
    // Aquí programaremos la funcionalidad para ver la factura más adelante
    router.navigate(`/libreria/cliente-ver-factura.html?numero=${facturaNumero}`);
    //alert(`Ver factura número: ${facturaNumero}`);
  }
}
