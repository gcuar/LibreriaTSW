import * as chai from 'https://cdnjs.cloudflare.com/ajax/libs/chai/5.1.1/chai.js';
let assert = chai.assert;

import { proxy as libreria } from '../model/proxy.mjs';


describe("Libreria model test suite", function () {

  const ISBNS = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2', '978-3-16-148410-3', '978-3-16-148410-4'];

  function crearLibro(isbn) {
    return {
      isbn: `${isbn}`,
      titulo: `TITULO_${isbn}`,
      autores: `AUTOR_A${isbn}; AUTOR_B${isbn}`,
      resumen:
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ullamcorper massa libero, eget dapibus elit efficitur id. Suspendisse id dui et dui tincidunt fermentum. Integer vel felis purus. Integer tempor orci risus, at dictum urna euismod in. Etiam vitae nisl quis ipsum fringilla mollis. Maecenas vitae mauris sagittis, commodo quam in, tempor mauris. Suspendisse convallis rhoncus pretium. Sed egestas porta dignissim. Aenean nec ex lacus. Nunc mattis ipsum sit amet fermentum aliquam. Ut blandit posuere lacinia. Vestibulum elit arcu, consectetur nec enim quis, ullamcorper imperdiet nunc. Donec vel est consectetur, tincidunt nisi non, suscipit metus._[${isbn}]`,
      portada: `http://google.com/${isbn}`,
      stock: 5,
      precio: (Math.random() * 100).toFixed(2),
    };
  }

  beforeEach('Model.Libreria.beforeEach()', async function () {
    await libreria.setLibros([]);
  });


  /**
   * Libreria Libro
   */
  describe("Model.Libreria.Libro", function () {
    it("Model.Libreria.Libro.setLibros()", async function () {
      let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
      libros_esperados.forEach((l, i) => l._id = i + 1);
      let libros = await libreria.setLibros(libros_esperados);
      assert.equal(libros.length, libros_esperados.length);
      libros_esperados.forEach(esperado => {
        let actual = libros.find(l => l.isbn == esperado.isbn);
        assert.equal(actual.isbn, esperado.isbn, "El isbn no coincide");
        assert.equal(actual.titulo, esperado.titulo, "El titulo no coincide");
        assert.equal(actual.resumen, esperado.resumen, "El resumen no coincide");
        assert.equal(actual.autores, esperado.autores, "Los autores no coinciden");
        assert.equal(actual.portada, esperado.portada, "La portada no coincide");
        assert.equal(actual.stock, esperado.stock, "El stock no coincide");
        assert.equal(actual.precio, esperado.precio, "El precio no coincide");
        assert.isDefined(actual._id, "El _id no esta definido");
      });
    });

    it("Model.Libreria.Libro.getLibros()", async function () {
      let libros = await libreria.getLibros();
      assert.equal(0, libros.length);

      let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
      await libreria.setLibros(libros_esperados);

      libros = await libreria.getLibros();
      assert.equal(libros.length, libros_esperados.length);

      libros_esperados.forEach(esperado => {
        let actual = libros.find(l => l.isbn == esperado.isbn);
        assert.equal(actual.isbn, esperado.isbn, "El isbn no coincide");
        assert.equal(actual.titulo, esperado.titulo, "El titulo no coincide");
        assert.equal(actual.resumen, esperado.resumen, "El resumen no coincide");
        assert.equal(actual.autores, esperado.autores, "Los autores no coinciden");
        assert.equal(actual.portada, esperado.portada, "La portada no coincide");
        assert.equal(actual.stock, esperado.stock, "El stock no coincide");
        assert.equal(actual.precio, esperado.precio, "El precio no coincide");
        assert.isDefined(actual._id, "El _id no esta definido");
      });
    });

    it("Model.Libreria.Libro.getLibroPorId(id)", async function () {
      let libros = await libreria.getLibros();
      assert.equal(libros.length, 0);

      let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
      libros = await libreria.setLibros(libros_esperados);

      libros.forEach(async esperado => {
        let actual = await libreria.getLibroPorId(esperado._id);
        assert.equal(actual.isbn, esperado.isbn, "El isbn no coincide");
        assert.equal(actual.titulo, esperado.titulo, "El titulo no coincide");
        assert.equal(actual.resumen, esperado.resumen, "El resumen no coincide");
        assert.equal(actual.autores, esperado.autores, "Los autores no coinciden");
        assert.equal(actual.portada, esperado.portada, "La portada no coincide");
        assert.equal(actual.stock, esperado.stock, "El stock no coincide");
        assert.equal(actual.precio, esperado.precio, "El precio no coincide");
        assert.equal(actual._id, esperado._id, "El _id no coincide");
      });
    });
  });

});