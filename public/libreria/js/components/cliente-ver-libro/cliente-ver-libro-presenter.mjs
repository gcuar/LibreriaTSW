import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";

export class ClienteVerLibroPresenter extends Presenter {
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

  // Acceder al libro desde el modelo
  getLibro() {
    return model.getLibroPorId(this.id);
  }

  // Getters y setters para los elementos del DOM
  get isbnText() {
    return document.querySelector('#isbnText');
  }

  set isbn(isbn) {
    this.isbnText.textContent = isbn;
  }

  get tituloText() {
    return document.querySelector('#tituloText');
  }

  set titulo(titulo) {
    this.tituloText.textContent = titulo;
  }

  get autoresText() {
    return document.querySelector('#autoresText');
  }

  set autores(autores) {
    this.autoresText.textContent = autores;
  }

  get resumenText() {
    return document.querySelector('#resumenText');
  }

  set resumen(resumen) {
    this.resumenText.textContent = resumen;
  }

  get precioText() {
    return document.querySelector('#precioText');
  }

  set precio(precio) {
    this.precioText.textContent = precio;
  }

  get stockText() {
    return document.querySelector('#stockText');
  }

  set stock(stock) {
    this.stockText.textContent = stock;
  }

  // Obtener referencia al botón "Agregar al carro"
  // get agregarCarritoButton() {
  //   return document.querySelector('#agregarCarritoButton');
  // }

  get agregarCarritoButton() {
      return document.querySelector('#agregarAlCarroLink');
  }

  // Método para agregar el libro al carro con cantidad 1
  agregarAlCarroClick(event) {
    event.preventDefault();
    try {
      const clienteId = libreriaSession.getUsuarioId();
      if (!clienteId) {
        throw new Error('Usuario no autenticado');
      }
      const item = {
        libro: this.id,
        cantidad: 1
      };
      model.addClienteCarroItem(clienteId, item);
      this.mensajesPresenter.mensaje('Libro añadido al carro con éxito.');
      this.mensajesPresenter.refresh();
      // Redirigir al carrito
      router.navigate('/libreria/cliente-carro.html');
    } catch (e) {
      console.error(e);
      this.mensajesPresenter.error(e.message);
      this.mensajesPresenter.refresh();
    }
  }

  // Asignar los datos del libro a los elementos del DOM
  set libro(libro) {
    this.isbn = libro.isbn;
    this.titulo = libro.titulo;
    this.autores = libro.autores;
    this.resumen = libro.resumen;
    this.stock = libro.stock;
    this.precio = libro.precio;
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

    const libro = this.getLibro();
    if (libro) {
      this.libro = libro;
    } else {
      console.error(`Libro ${this.id} no encontrado`);
      this.mensajesPresenter.error('Libro no encontrado');
      this.mensajesPresenter.refresh();
      return;
    }

    // Asignar el evento al botón "Agregar al carro"
    this.agregarCarritoButton.onclick = event => this.agregarAlCarroClick(event);
  }
}
