import { Presenter } from "../../commons/presenter.mjs";

export class ClienteVerLibroPresenter extends Presenter {

    constructor(model, view){
        super(model, view);
    }

    get searchParams() {
        return new URLSearchParams(document.location.search);
    }

    get id() {
        return this.searchParams.get('id');
    }

    getLibro() {
        return this.model.getLibroPorId(this.id);
    }

    get isbnParagraph() {
        console.log(document);
        return document.querySelector('#isbnParagraph');
    }
    
    set isbn(isbn) {
        this.isbnParagraph.textContent = isbn;
    }

    get tituloParagraph() {
        return document.querySelector('#tituloParagraph');
    }
    
    set titulo(titulo) {
        this.tituloParagraph.textContent = titulo;
    }
    
    get autoresParagraph() {
        return document.querySelector('#autoresParagraph');
    }
    
    set autores(autores) {
        this.autoresParagraph.textContent = autores;
    }
    
    get resumenParagraph() {
        return document.querySelector('#resumenParagraph');
    }
    
    set resumen(resumen) {
        this.resumenParagraph.textContent = resumen;
    }
    
    get precioParagraph() {
        return document.querySelector('#precioParagraph');
    }
    
    set precio(precio) {
        this.precioParagraph.textContent = precio;
    }
    
    get stockParagraph() {
        return document.querySelector('#stockParagraph');
    }
    
    set stock(stock) {
        this.stockParagraph.textContent = stock;
    }

    set libro(libro) {    
        this.isbn = libro.isbn;
        this.titulo = libro.titulo;
        this.autores = libro.autores;
        this.resumen = libro.resumen;
        this.stock = libro.stock;
        this.precio = libro.precio;
      }

    async refresh(){
        await super.refresh();
        console.log(this.id);
        let libro = this.getLibro();
        if (libro) this.libro = libro;
        else console.error(`Libro ${id} not found!`);
    
    }

    

}
