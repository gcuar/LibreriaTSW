// FILE FOR TESTING REST API

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
const ISBNS = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2', '978-3-16-148410-3', '978-3-16-148410-4'];
const C_DNIS = ['00000000C', '00000001C', '00000002C', '00000003C', '00000004C'];
const A_DNIS = ['00000000A', '00000001A', '00000002A', '00000003A', '00000004A', '00000000C'];

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
          assert.equal(esperado._id, actual._id, "El _id no coincide");
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
      // it(`PUT ${URL}/clientes`, async () => {
      //   let requester = chai.request.execute(app).keepOpen();
  
      //   let request = requester.get(`/api/clientes`);
      //   let response = await request.send();
      //   assert.equal(response.status, 200);
      //   assert.isTrue(response.ok);
      //   let clientes = response.body;

      //   // console.log("hay tantos clientes:",clientes.length);

      //   assert.equal(0, clientes.length);
  
      //   let clientes_esperados = C_DNIS.map(dni => crearCliente(dni));
      //   clientes_esperados.forEach((c, i) => c._id = i + 1);
  
      //   request = requester.put(`/api/clientes`);
      //   response = await request.send(clientes_esperados);

      //   console.log("hola", response.statusMessage);
      //   console.log("hola", response.statusCode);

      //   assert.equal(response.status, 200);
      //   assert.isTrue(response.ok);

      //   console.log(response.body.length);

      //   console.log("clientes:",clientes.length);
      //   clientes = response.body;
      //   console.log("clientes:",clientes.length);
      //   console.log("esperados:",clientes_esperados.length);
      //   assert.equal(clientes_esperados.length, clientes.length);


      //   clientes_esperados.forEach(esperado => {
      //     let actual = clientes.find(c => c.dni == esperado.dni);
      //     assert.equal(esperado.dni, actual.dni, "El dni no coincide");
      //     assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
      //     assert.equal(esperado.apellidos, actual.apellidos, "Los apellidos no coinciden");
      //     assert.equal(esperado.direccion, actual.direccion, "La direccion no coincide");
      //     assert.equal(esperado.email, actual.email, "El email no coincide");
      //     assert.equal(esperado.password, actual.password, "La password no coincide");
      //     assert.equal(esperado._id, actual._id, "El _id no coincide");
      //   });
      //   requester.close();
      // }); 

      it(`PUT ${URL}/clientes`, async () => {
        let requester = chai.request.execute(app).keepOpen();
      
        let request = requester.get(`/api/clientes`);
        let response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        let clientes = response.body;
      
        // console.log("Clientes iniciales:", clientes);
      
        assert.equal(0, clientes.length);
      
        let clientes_esperados = C_DNIS.map(dni => crearCliente(dni));
        clientes_esperados.forEach((c, i) => c._id = i + 1);
      
        // console.log("Clientes esperados:", clientes_esperados);
      
        request = requester.put(`/api/clientes`);
        response = await request.send(clientes_esperados);
      
        console.log("Response statusMessage:", response.statusMessage);
        console.log("Response statusCode:", response.statusCode);
        // console.log("Response body:", response.body);
      
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
      
        console.log("Response body length:", response.body.length);
        console.log("SALE UNDEFINED ENTONCES NO SE PUEDE HACER EL TEST, PUEDE SER UN ERROR DE LA API");
      
        clientes = response.body;
        console.log("Clientes después del PUT:", clientes.length);
        console.log("Clientes esperados:", clientes_esperados.length);
        assert.equal(clientes_esperados.length, clientes.length);
      
        clientes_esperados.forEach(esperado => {
          let actual = clientes.find(c => c.dni == esperado.dni);
          assert.equal(esperado.dni, actual.dni, "El dni no coincide");
          assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
          assert.equal(esperado.apellidos, actual.apellidos, "Los apellidos no coinciden");
          assert.equal(esperado.direccion, actual.direccion, "La direccion no coincide");
          assert.equal(esperado.email, actual.email, "El email no coincide");
          assert.equal(esperado.password, actual.password, "La password no coincide");
          assert.equal(esperado._id, actual._id, "El _id no coincide");
        });
        requester.close();
      });




      // Test para el metodo GET [getClientes()]
      // it(`GET ${URL}/clientes`, async () => {
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
      //   clientes_esperados.forEach(esperado => {
      //     let actual = clientes.find(c => c.dni == esperado.dni);
      //     assert.equal(esperado.dni, actual.dni, "El dni no coincide");
      //     assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
      //     assert.equal(esperado.apellidos, actual.apellidos, "Los apellidos no coinciden");
      //     assert.equal(esperado.direccion, actual.direccion, "La direccion no coincide");
      //     assert.equal(esperado.email, actual.email, "El email no coincide");
      //     assert.equal(esperado.password, actual.password, "La password no coincide");
      //     assert.equal(esperado._id, actual._id, "El _id no coincide");
      //   });
      //   requester.close();
      // });

      // Test para el metodo DELETE [removeClientes()]
      // it(`DELETE ${URL}/clientes`, async () => {
      // });

      // Test para el metodo POST [addCliente(obj)]
      // it(`POST ${URL}/clientes`, async () => {
      // });

      // Test para el metodo GET [getClientePorId(id)]
      // it(`GET ${URL}/clientes/:id`, async () => {
      // }); 

      // Test para el metodo GET [getClientePorEmail(email) Ruta: /api/clientes?email=email]
          // NO SE PUEDE HACER PORQUE NO SE HA IMPLEMENTADO O NO FUNCIONA 

      // Test para el metodo GET [getClientePorDni(dni) Ruta: /api/clientes?dni=dni]
          // NO SE PUEDE HACER PORQUE NO SE HA IMPLEMENTADO O NO FUNCIONA

      // Test para el metodo DELETE [removeCliente(id) Ruta: /api/clientes/:id]
      // it(`DELETE ${URL}/clientes/:id`, async () => {
      // });

      // Test para el metodo PUT [updateCliente(id) Ruta: /api/clientes/:id]
          // NO SE PUEDE HACER PORQUE NO SE HA IMPLEMENTADO O NO FUNCIONA 

      // Test para el metodo POST [autenticar(obj) Ruta: /api/clientes/autenticar y /api/clientes/singin]
          // NO SE PUEDE HACER PORQUE NO SE HA IMPLEMENTADO O NO FUNCIONA 

      // Test para el metodo GET [getCarroCliente(id) Ruta: /api/clientes/:id/carro]
          // NO SE PUEDE HACER PORQUE NO SE HA IMPLEMENTADO O NO FUNCIONA

      // Test para el metodo POST [addCarroClienteItem(id, item) Ruta: /api/clientes/:id/carro/items]
          // NO SE PUEDE HACER PORQUE NO SE HA IMPLEMENTADO O NO FUNCIONA

      // Test para el metodo PUT setClienteCarroItemCantidad(id, index, cantidad) Ruta: /api/clientes/:id/carro/items/:index
          // NO SE PUEDE HACER PORQUE NO SE HA IMPLEMENTADO O NO FUNCIONA




    }); 

    describe("Pruebas de administradores", function () {});

    describe("Pruebas de facturas", function () {});

  });