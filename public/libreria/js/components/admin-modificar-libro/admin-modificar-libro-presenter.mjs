import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/proxy.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class AdminModificarLibroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  // Obtener los parámetros de la URL para obtener el ID del libro
  get searchParams() {
    return new URLSearchParams(window.location.search);
  }

  get id() {
    return this.searchParams.get('id');
  }

  // Referencias a los elementos del formulario
  get idInput() { return document.querySelector('#idInput'); }
  get isbnInput() { return document.querySelector('#isbnInput'); }
  get tituloArea() { return document.querySelector('#tituloArea'); }
  get autoresArea() { return document.querySelector('#autoresArea'); }
  get resumenArea() { return document.querySelector('#resumenArea'); }
  get stockInput() { return document.querySelector('#stockInput'); }
  get precioInput() { return document.querySelector('#precioInput'); }
  get modificarInput() { return document.querySelector('#modificarInput'); }

  // Cargar los datos del libro en el formulario
  cargarDatosLibro() {
    const libro = model.getLibroPorId(this.id);
    if (!libro) {
      this.mensajesPresenter.error('Libro no encontrado');
      return;
    }
    this.idInput.value = libro._id;
    this.isbnInput.value = libro.isbn;
    this.tituloArea.value = libro.titulo;
    this.autoresArea.value = libro.autores;
    this.resumenArea.value = libro.resumen;
    this.stockInput.value = libro.stock;
    this.precioInput.value = libro.precio;
  }

  // Manejar el evento de modificar el libro
  modificarLibro(event) {
    event.preventDefault();
    try {
      const libroActualizado = {
        _id: this.idInput.value,
        isbn: this.isbnInput.value,
        titulo: this.tituloArea.value,
        autores: this.autoresArea.value,
        resumen: this.resumenArea.value,
        stock: parseInt(this.stockInput.value),
        precio: parseFloat(this.precioInput.value)
      };

      console.log("libroActualizado:", libroActualizado); // Debug line

      if (!libroActualizado._id || !libroActualizado.isbn || !libroActualizado.titulo) {
        throw new Error("Missing fields in libroActualizado"); // Add a specific error for missing fields
      }

      model.updateLibro(libroActualizado);
      this.mensajesPresenter.mensaje('¡Libro modificado con éxito!');
      router.navigate('/libreria/admin-home.html');
    } catch (error) {
      console.error(error);
      this.mensajesPresenter.error(error.message);
      this.mensajesPresenter.refresh();
    }
  }

  // Método refresh para inicializar el formulario
  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    this.cargarDatosLibro();
    // Asignar el evento al botón de modificar
    this.modificarInput.onclick = event => this.modificarLibro(event);
  }
}