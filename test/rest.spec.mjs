import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { app } from "../app.mjs";
const chai = chaiModule.use(chaiHttp);
const assert = chai.assert;

const URL = '/api';

// Export crear libro
import { crearLibro } from "../model/seeder.mjs";
import { crearCliente } from "../model/seeder.mjs";
import { crearAdmin } from "../model/seeder.mjs";
import { afterEach } from "mocha";
const ISBNS = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2', '978-3-16-148410-3', '978-3-16-148410-4'];
const C_DNIS = ['00000000C', '00000001C', '00000002C', '00000003C', '00000004C'];
const A_DNIS = ['00000000A', '00000001A', '00000002A', '00000003A', '00000004A'];

describe("REST libreria", function () {
  describe("Pruebas de libros", function () {

      // Test para el metodo PUT [setLibros(array)]
      it(`PUT ${URL}/libros`, async () => {
        let requester = chai.request.execute(app).keepOpen();
  
        let request = requester.get(`/api/libros`);
        let response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        let libros = response.body;
        assert.equal(0, libros.length);
  
        let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
        libros_esperados.forEach((l, i) => l._id = i + 1);
  
        request = requester.put(`/api/libros`);
        response = await request.send(libros_esperados);
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        libros = response.body;
        assert.equal(libros_esperados.length, libros.length);
        libros_esperados.forEach(esperado => {
          let actual = libros.find(l => l.isbn == esperado.isbn);
          assert.equal(esperado.isbn, actual.isbn, "El isbn no coincide");
          assert.equal(esperado.titulo, actual.titulo, "El titulo no coincide");
          assert.equal(esperado.resumen, actual.resumen, "El resumen no coincide");
          assert.equal(esperado.autores, actual.autores, "Los autores no coinciden");
          assert.equal(esperado.portada, actual.portada, "La portada no coincide");
          assert.equal(esperado.stock, actual.stock, "El stock no coincide");
          assert.equal(esperado.precio, actual.precio, "El precio no coincide");
        });
        requester.close();
      });
  
      beforeEach(async function () {
        let requester = chai.request.execute(app).keepOpen();
        let request = requester.put(`/api/libros`);
        let response = await request.send([]);
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        requester.close();
      });
  
      // Test para el metodo GET [getLibros()]
      it(`GET ${URL}/libros`, async () => {
        let requester = chai.request.execute(app).keepOpen();
  
        let request = requester.get(`/api/libros`);
        let response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        let libros = response.body;
        assert.equal(0, libros.length);
  
        let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
        request = requester.put(`/api/libros`);
        await request.send(libros_esperados);
  
        request = requester.get(`/api/libros`);
        response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        libros = response.body;
        assert.equal(libros_esperados.length, libros.length);
        libros_esperados.forEach(esperado => {
          let actual = libros.find(l => l.isbn == esperado.isbn);
          assert.equal(esperado.isbn, actual.isbn, "El isbn no coincide");
          assert.equal(esperado.titulo, actual.titulo, "El titulo no coincide");
          assert.equal(esperado.resumen, actual.resumen, "El resumen no coincide");
          assert.equal(esperado.autores, actual.autores, "Los autores no coinciden");
          assert.equal(esperado.portada, actual.portada, "La portada no coincide");
          assert.equal(esperado.stock, actual.stock, "El stock no coincide");
          assert.equal(esperado.precio, actual.precio, "El precio no coincide");
          assert.isDefined(actual._id, "El _id no esta definido");
        });
        requester.close();
      });
  
      // Test para el metodo DELETE [removeLibros()]
      it(`DELETE ${URL}/libros`, async () => {
        let requester = chai.request.execute(app).keepOpen();

        let request = requester.get(`/api/libros`);
        let response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        let libros = response.body;
        assert.equal(0, libros.length);

        // console.log("Al iniciar debe ser 0:", libros.length);

        let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
        request = requester.put(`/api/libros`);
        await request.send(libros_esperados);

        request = requester.get(`/api/libros`);
        response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        libros = response.body;
        assert.equal(libros_esperados.length, libros.length);

        // console.log("Despues de añadir los libros debe ser 5:", libros.length);

        request = requester.delete(`/api/libros`);
        response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);

        request = requester.get(`/api/libros`);
        response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        libros = response.body;
        assert.equal(0, libros.length);

        // console.log("Despues de borrar los libros debe ser 0:", libros.length);

        requester.close();
      });

      // Test para el metodo POST [addLibro(obj)]
      it(`POST ${URL}/libros`, async () => {
        let requester = chai.request.execute(app).keepOpen();
  
        let request = requester.get(`/api/libros`);
        let response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        let libros = response.body;
        assert.equal(0, libros.length);
  
        let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
        request = requester.put(`/api/libros`);
        await request.send(libros_esperados);
  
        let nuevo_libro = crearLibro('978-3-16-148410-5');
        request = requester.post(`/api/libros`);
        response = await request.send(nuevo_libro);

        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        let actual = response.body;
        assert.equal(nuevo_libro.isbn, actual.isbn, "El isbn no coincide");
        assert.equal(nuevo_libro.titulo, actual.titulo, "El titulo no coincide");
        assert.equal(nuevo_libro.resumen, actual.resumen, "El resumen no coincide");
        assert.equal(nuevo_libro.autores, actual.autores, "Los autores no coinciden");
        assert.equal(nuevo_libro.portada, actual.portada, "La portada no coincide");
        assert.equal(nuevo_libro.stock, actual.stock, "El stock no coincide");
        assert.equal(nuevo_libro.precio, actual.precio, "El precio no coincide");
        assert.isDefined(actual._id, "El _id no esta definido");

        // console.log("El libro añadido es:", actual);
        // console.log("El libro esperado es:", nuevo_libro);


        requester.close();
      });

      // Test para el metodo GET [getLibroPorId(id)]
      it(`GET ${URL}/libros/:id`, async () => {
        // comentar seed
        let requester = chai.request.execute(app).keepOpen();
  
        let request = requester.get(`/api/libros`);
        let response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        let libros = response.body;
        assert.equal(0, libros.length);
  
        libros = ISBNS.map(isbn => crearLibro(isbn));
        request = requester.put(`/api/libros`);
        response = await request.send(libros);
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        libros = response.body;
  
        let responses = libros.map(async esperado => {
          request = requester.get(`/api/libros/${esperado._id}`);
          response = await request.send();
          assert.equal(response.status, 200);
          assert.isTrue(response.ok);
          let actual = response.body;
          assert.equal(esperado.isbn, actual.isbn, "El isbn no coincide");
          assert.equal(esperado.titulo, actual.titulo, "El titulo no coincide");
          assert.equal(esperado.resumen, actual.resumen, "El resumen no coincide");
          assert.equal(esperado.autores, actual.autores, "Los autores no coinciden");
          assert.equal(esperado.portada, actual.portada, "La portada no coincide");
          assert.equal(esperado.stock, actual.stock, "El stock no coincide");
          assert.equal(esperado.precio, actual.precio, "El precio no coincide");
          assert.equal(esperado._id, actual._id, "El _id no coincide");
        });
  
        await Promise.all(responses);
        requester.close();
      });

      // Test para el metodo GET [getLibroPorIsbn(isbn) Ruta: /api/libros?isbn=isbn]
          // NO SE PUEDE HACER PORQUE NO SE HA IMPLEMENTADO O NO FUNCIONA 

      // Test para el metodo GET [getLibroPorTitulo(titulo) Ruta: /api/libros?titulo=titulo]
          // NO SE PUEDE HACER PORQUE NO SE HA IMPLEMENTADO O NO FUNCIONA

      // Test para el metodo DELETE [removeLibro(id) Ruta: /api/libros/:id]
      it(`DELETE ${URL}/libros/:id`, async () => {
        let requester = chai.request.execute(app).keepOpen();
    
        // Obtener la lista inicial de libros
        let request = requester.get(`/api/libros`);
        let response = await request.send();
        assert.equal(response.status, 200);

        assert.isTrue(response.ok);
        let libros = response.body;
        assert.equal(0, libros.length);
    
        // Agregar libros esperados
        let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
        request = requester.put(`/api/libros`);
        await request.send(libros_esperados);

        // Verificar que los libros fueron agregados
        request = requester.get(`/api/libros`);
        response = await request.send();

        assert.equal(response.status, 200);

        assert.isTrue(response.ok);
        libros = response.body;
        assert.equal(libros_esperados.length, libros.length);
    
        // Eliminar un libro específico
        // console.log (libros[0]);
        const idToDelete = libros[0]._id;
        // console.log ("El id a eliminar es:", idToDelete);
        request = requester.delete(`/api/libros/${idToDelete}`);
        response = await request.send();

        assert.equal(response.status, 200);

        assert.isTrue(response.ok);
    
        // Obtener la lista de libros después de la eliminación
        request = requester.get(`/api/libros`);
        response = await request.send();

        assert.equal(response.status, 200);

        assert.isTrue(response.ok);
        libros = response.body;
    
        // Verificar que el libro específico fue eliminado
        assert.equal(libros_esperados.length - 1, libros.length);
        let libroEliminado = libros.find(libro => libro._id === idToDelete);
        assert.isUndefined(libroEliminado, "El libro no fue eliminado");

        // Verificar que los demás libros siguen presentes
        libros_esperados.slice(1).forEach(esperado => {
            let actual = libros.find(libro => libro.isbn === esperado.isbn);
            assert.isDefined(actual, `El libro con ISBN ${esperado.isbn} no está presente`);
            assert.equal(esperado.isbn, actual.isbn, "El ISBN no coincide");
            assert.equal(esperado.titulo, actual.titulo, "El título no coincide");
            assert.equal(esperado.resumen, actual.resumen, "El resumen no coincide");
            assert.equal(esperado.autores, actual.autores, "Los autores no coinciden");
            assert.equal(esperado.portada, actual.portada, "La portada no coincide");
            assert.equal(esperado.stock, actual.stock, "El stock no coincide");
            assert.equal(esperado.precio, actual.precio, "El precio no coincide");
        });
    
        requester.close();
      });

      // Test para el metodo PUT [updateLibro(id) Ruta: /api/libros/:id]
      it (`PUT ${URL}/libros/:id`, async () => {
        let requester = chai.request.execute(app).keepOpen();
    
        // Obtener la lista inicial de libros
        let request = requester.get(`/api/libros`);
        let response = await request.send();
        assert.equal(response.status, 200);

        assert.isTrue(response.ok);
        let libros = response.body;
        assert.equal(0, libros.length);
    
        // Agregar libros esperados
        let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
        request = requester.put(`/api/libros`);
        await request.send(libros_esperados);

        // Verificar que los libros fueron agregados
        request = requester.get(`/api/libros`);
        response = await request.send();

        assert.equal(response.status, 200);

        assert.isTrue(response.ok);
        libros = response.body;
        assert.equal(libros_esperados.length, libros.length);
    
        // Modificar un libro específico
        const idToUpdate = libros[0]._id;
        const libroAntes = libros[0];
        const libroModificado = {
            isbn: "978-3-16-148410-0",
            titulo: "Nuevo título",
            resumen: "Nuevo resumen",
            autores: "Nuevo autor",
            portada: "Nueva portada",
            stock: 10,
            precio: 100
        };
        request = requester.put(`/api/libros/${idToUpdate}`);
        response = await request.send(libroModificado);

        assert.equal(response.status, 200);

        assert.isTrue(response.ok);

        // Obtener el libro modificado
        request = requester.get(`/api/libros/${idToUpdate}`);
        response = await request.send();

        assert.equal(response.status, 200);

        assert.isTrue(response.ok);
        let actual = response.body;

        // console.log(libroAntes.isbn, libroModificado.isbn, actual.isbn);
        // console.log(libroAntes.titulo, libroModificado.titulo, actual.titulo);
        // console.log(libroAntes.resumen, libroModificado.resumen, actual.resumen);
        // console.log(libroAntes.autores, libroModificado.autores, actual.autores);
        // console.log(libroAntes.portada, libroModificado.portada, actual.portada);
        // console.log(libroAntes.stock, libroModificado.stock, actual.stock); 
        // console.log(libroAntes.precio, libroModificado.precio, actual.precio);

        assert.equal(libroModificado.isbn, actual.isbn, "El ISBN no coincide");
        assert.equal(libroModificado.titulo, actual.titulo, "El título no coincide");
        assert.equal(libroModificado.resumen, actual.resumen, "El resumen no coincide");
        assert.equal(libroModificado.autores, actual.autores, "Los autores no coinciden");
        assert.equal(libroModificado.portada, actual.portada, "La portada no coincide");
        assert.equal(libroModificado.stock, actual.stock, "El stock no coincide");
        assert.equal(libroModificado.precio, actual.precio, "El precio no coincide");
        assert.equal(idToUpdate, actual._id, "El _id no coincide");

        requester.close();
      });

  });

  describe("Pruebas de clientes", function () {

    // Test para el metodo PUT [setClientes(array)]
    it(`PUT ${URL}/clientes`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/clientes`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let clientes = response.body;
      assert.equal(0, clientes.length);

      let clientes_esperados = C_DNIS.map(dni => crearCliente(dni));
      clientes_esperados.forEach((c, i) => c._id = i + 1);

      request = requester.put(`/api/clientes`);
      response = await request.send(clientes_esperados);

      // console.log(clientes_esperados);
      // console.log(response);

      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      clientes = response.body;
      assert.equal(clientes_esperados.length, clientes.length);
      clientes_esperados.forEach(esperado => {
        let actual = clientes.find(c => c.dni == esperado.dni);
        assert.equal(esperado.dni, actual.dni, "El dni no coincide");
        assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
        assert.equal(esperado.apellidos, actual.apellidos, "Los apellidos no coinciden");
        assert.equal(esperado.email, actual.email, "El email no coincide");
      });
      requester.close();
    });

    afterEach(async function () {
      let requester = chai.request.execute(app).keepOpen();
      let request = requester.put(`/api/clientes`);
      let response = await request.send([]);
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      requester.close();
    });

    // Test para el metodo GET [getClientes()]
    it(`GET ${URL}/clientes`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/clientes`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let clientes = response.body;
      assert.equal(0, clientes.length);

      let clientes_esperados = C_DNIS.map(dni => crearCliente(dni));
      request = requester.put(`/api/clientes`);
      await request.send(clientes_esperados);

      request = requester.get(`/api/clientes`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      clientes = response.body;
      assert.equal(clientes_esperados.length, clientes.length);
      clientes_esperados.forEach(esperado => {
        let actual = clientes.find(c => c.dni == esperado.dni);
        assert.equal(esperado.dni, actual.dni, "El dni no coincide");
        assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
        assert.equal(esperado.apellidos, actual.apellidos, "Los apellidos no coinciden");
        assert.equal(esperado.email, actual.email, "El email no coincide");
        assert.isDefined(actual._id, "El _id no esta definido");
      });
      requester.close();
    });

    // Test para el metodo DELETE [removeClientes()]
    it(`DELETE ${URL}/clientes`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/clientes`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let clientes = response.body;
      assert.equal(0, clientes.length);

      let clientes_esperados = C_DNIS.map(dni => crearCliente(dni));
      request = requester.put(`/api/clientes`);
      await request.send(clientes_esperados);

      request = requester.get(`/api/clientes`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      clientes = response.body;
      assert.equal(clientes_esperados.length, clientes.length);

      request = requester.delete(`/api/clientes`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);

      request = requester.get(`/api/clientes`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      clientes = response.body;
      assert.equal(0, clientes.length);

      requester.close();
    });

    // Test para el metodo POST [addCliente(obj)]
    it(`POST ${URL}/clientes`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/clientes`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let clientes = response.body;
      assert.equal(0, clientes.length);

      let clientes_esperados = C_DNIS.map(dni => crearCliente(dni));
      request = requester.put(`/api/clientes`);
      await request.send(clientes_esperados);

      let nuevo_cliente = crearCliente('00000005C');
      request = requester.post(`/api/clientes`);
      response = await request.send(nuevo_cliente);

      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let actual = response.body;
      assert.equal(nuevo_cliente.dni, actual.dni, "El dni no coincide");
      assert.equal(nuevo_cliente.nombre, actual.nombre, "El nombre no coincide");
      assert.equal(nuevo_cliente.apellidos, actual.apellidos, "Los apellidos no coinciden");
      assert.equal(nuevo_cliente.email, actual.email, "El email no coincide");
      assert.isDefined(actual._id, "El _id no esta definido");

      requester.close();
    });

    // Test para el metodo GET [getClientePorId(id) Ruta: /api/clientes/:id]
    it(`GET ${URL}/clientes/:id`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/clientes`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let clientes = response.body;
      assert.equal(0, clientes.length);

      clientes = C_DNIS.map(dni => crearCliente(dni));
      request = requester.put(`/api/clientes`);
      response = await request.send(clientes);
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      clientes = response.body;

      let responses = clientes.map(async esperado => {
        request = requester.get(`/api/clientes/${esperado._id}`);
        response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        let actual = response.body;
        assert.equal(esperado.dni, actual.dni, "El dni no coincide");
        assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
        assert.equal(esperado.apellidos, actual.apellidos, "Los apellidos no coinciden");
        assert.equal(esperado.email, actual.email, "El email no coincide");
        assert.equal(esperado._id, actual._id, "El _id no coincide");
      });

      await Promise.all(responses);
      requester.close();
    });

    // // Test para el metodo DELETE [removeCliente(id) Ruta: /api/clientes/:id]
    it(`DELETE ${URL}/clientes/:id`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/clientes`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let clientes = response.body;
      assert.equal(0, clientes.length);

      let clientes_esperados = C_DNIS.map(dni => crearCliente(dni));
      request = requester.put(`/api/clientes`);
      await request.send(clientes_esperados);

      request = requester.get(`/api/clientes`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      clientes = response.body;
      assert.equal(clientes_esperados.length, clientes.length);

      const idToDelete = clientes[0]._id;
      request = requester.delete(`/api/clientes/${idToDelete}`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);

      request = requester.get(`/api/clientes`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      clientes = response.body;
      assert.equal(clientes_esperados.length - 1, clientes.length);
      let clienteEliminado = clientes.find(cliente => cliente._id === idToDelete);
      assert.isUndefined(clienteEliminado, "El cliente no fue eliminado");

      clientes_esperados.slice(1).forEach(esperado => {
        let actual = clientes.find(cliente => cliente.dni === esperado.dni);
        assert.isDefined(actual, `El cliente con DNI ${esperado.dni} no está presente`);
        assert.equal(esperado.dni, actual.dni, "El DNI no coincide");
        assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
        assert.equal(esperado.apellidos, actual.apellidos, "Los apellidos no coinciden");
        assert.equal(esperado.email, actual.email, "El email no coincide");
      });

      requester.close();
    });

    // // Test para el metodo PUT [updateCliente(id) Ruta: /api/clientes/:id]
    // it(`PUT ${URL}/clientes/:id`, async () => {
    //   let requester = chai.request.execute(app).keepOpen();

    //   let request = requester.get(`/api/clientes`);
    //   let response = await request.send();
    //   assert.equal(response.status, 200);
    //   assert.isTrue(response.ok);
    //   let clientes = response.body;
    //   assert.equal(0, clientes.length);

    //   let clientes_esperados = C_DNIS.map(dni => crearCliente(dni));
    //   request = requester.put(`/api/clientes`);
    //   await request.send(clientes_esperados);

    //   request = requester.get(`/api/clientes`);
    //   response = await request.send();
    //   assert.equal(response.status, 200);
    //   assert.isTrue(response.ok);
    //   clientes = response.body;
    //   assert.equal(clientes_esperados.length, clientes.length);

    //   const idToUpdate = clientes[0]._id;
    //   const clienteModificado = {
    //     dni: "00000005C",
    //     nombre: "Nuevo nombre",
    //     apellidos: "Nuevos apellidos",
    //     email: "nuevoemail@example.com"
    //   };
    //   request = requester.put(`/api/clientes/${idToUpdate}`);
    //   response = await request.send(clienteModificado);
    //   assert.equal(response.status, 200);
    //   assert.isTrue(response.ok);

    //   request = requester.get(`/api/clientes/${idToUpdate}`);
    //   response = await request.send();
    //   assert.equal(response.status, 200);
    //   assert.isTrue(response.ok);
    //   let actual = response.body;
    //   assert.equal(clienteModificado.dni, actual.dni, "El DNI no coincide");
    //   assert.equal(clienteModificado.nombre, actual.nombre, "El nombre no coincide");
    //   assert.equal(clienteModificado.apellidos, actual.apellidos, "Los apellidos no coinciden");
    //   assert.equal(clienteModificado.email, actual.email, "El email no coincide");
    //   assert.equal(idToUpdate, actual._id, "El _id no coincide");

    //   requester.close();
    // });

  });

  describe("Pruebas de admins", function () {

    // Test para el metodo PUT [setAdmins(array)]
    it(`PUT ${URL}/admins`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/admins`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let admins = response.body;
      // console.log("admines", admins.length)
      assert.equal(0, admins.length);

      let admins_esperados = A_DNIS.map(dni => crearAdmin(dni));
      admins_esperados.forEach((a, i) => a._id = i + 1);

      request = requester.put(`/api/admins`);
      response = await request.send(admins_esperados);

      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      admins = response.body;

      // console.log("esperados", admins_esperados.length);
      // console.log("admines", admins.length);

      assert.equal(admins_esperados.length, admins.length);
      admins_esperados.forEach(esperado => {
        let actual = admins.find(a => a.dni == esperado.dni);
        assert.equal(esperado.dni, actual.dni, "El dni no coincide");
        assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
        assert.equal(esperado.apellidos, actual.apellidos, "Los apellidos no coinciden");
        assert.equal(esperado.email, actual.email, "El email no coincide");
      });
      requester.close();
    });

    afterEach(async function () {
      let requester = chai.request.execute(app).keepOpen();
      let request = requester.put(`/api/admins`);
      let response = await request.send([]);
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      requester.close();

    });

    // Test para el metodo GET [getAdmins()]
    it(`GET ${URL}/admins`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/admins`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let admins = response.body;
      assert.equal(0, admins.length);

      let admins_esperados = A_DNIS.map(dni => crearAdmin(dni));
      request = requester.put(`/api/admins`);
      await request.send(admins_esperados);

      request = requester.get(`/api/admins`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      admins = response.body;
      assert.equal(admins_esperados.length, admins.length);
      admins_esperados.forEach(esperado => {
        let actual = admins.find(a => a.dni == esperado.dni);
        assert.equal(esperado.dni, actual.dni, "El dni no coincide");
        assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
        assert.equal(esperado.apellidos, actual.apellidos, "Los apellidos no coinciden");
        assert.equal(esperado.email, actual.email, "El email no coincide");
        assert.isDefined(actual._id, "El _id no esta definido");
      });
      requester.close();
    });

    // Test para el metodo DELETE [removeAdmins()]
    it(`DELETE ${URL}/admins`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/admins`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let admins = response.body;
      assert.equal(0, admins.length);

      let admins_esperados = A_DNIS.map(dni => crearAdmin(dni));
      request = requester.put(`/api/admins`);
      await request.send(admins_esperados);

      request = requester.get(`/api/admins`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      admins = response.body;
      assert.equal(admins_esperados.length, admins.length);

      request = requester.delete(`/api/admins`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);

      request = requester.get(`/api/admins`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      admins = response.body;
      assert.equal(0, admins.length);

      requester.close();
    });

    // Test para el metodo POST [addAdmin(obj)]
    it(`POST ${URL}/admins`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/admins`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let admins = response.body;
      assert.equal(0, admins.length);

      let admins_esperados = A_DNIS.map(dni => crearAdmin(dni));
      request = requester.put(`/api/admins`);
      await request.send(admins_esperados);

      let nuevo_admin = crearAdmin('00000005A');
      request = requester.post(`/api/admins`);
      response = await request.send(nuevo_admin);

      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let actual = response.body;
      assert.equal(nuevo_admin.dni, actual.dni, "El dni no coincide");
      assert.equal(nuevo_admin.nombre, actual.nombre, "El nombre no coincide");
      assert.equal(nuevo_admin.apellidos, actual.apellidos, "Los apellidos no coinciden");
      assert.equal(nuevo_admin.email, actual.email, "El email no coincide");
      assert.isDefined(actual._id, "El _id no esta definido");

      requester.close();
    });

    // Test para el metodo GET [getAdminPorId(id) Ruta: /api/admins/:id]
    it(`GET ${URL}/admins/:id`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/admins`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let admins = response.body;
      assert.equal(0, admins.length);

      admins = A_DNIS.map(dni => crearAdmin(dni));
      request = requester.put(`/api/admins`);
      response = await request.send(admins);
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      admins = response.body;

      let responses = admins.map(async esperado => {
        request = requester.get(`/api/admins/${esperado._id}`);
        response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        let actual = response.body;
        assert.equal(esperado.dni, actual.dni, "El dni no coincide");
        assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
        assert.equal(esperado.apellidos, actual.apellidos, "Los apellidos no coinciden");
        assert.equal(esperado.email, actual.email, "El email no coincide");
        assert.equal(esperado._id, actual._id, "El _id no coincide");
      });

      await Promise.all(responses);
      requester.close();
    });


  });


});