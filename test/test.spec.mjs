import puppeteer from 'puppeteer';
import { expect } from 'chai';
import { assert } from 'chai';
import mocha from 'mocha';
import { model, Libreria } from './model.mjs';

describe('Libreria App', function() {
    let browser;
    let page;

    // Set a timeout for the tests
    this.timeout(10000);

    before(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(() => {
        // Reiniciar el estado del modelo antes de cada test
        model.libros = [];
        model.usuarios = [];
        model.facturas = [];
        Libreria.lastId = 0;
    });   

    //Test de ejemplo
    it('should have the correct page title', async () => {
        await page.goto('http://localhost:3000/libreria/index.html'); // Replace with your app's URL
        const title = await page.title();
        expect(title).to.equal('Libreria 16.11.10'); // Replace with your expected title
    });

    it('should display the correct heading', async () => {
        await page.goto('http://localhost:3000/libreria/index.html');
        const heading = await page.$eval('h1', el => el.textContent);
        expect(heading).to.equal('Tecnologías y Sistemas Web 24/25'); // Replace with your expected heading
    });

    // Add more tests as needed


    // TESTS: GETTER Y SETTERS 
    
    // DE LIBRO:
    it('LIBRO: Debería asignar y devolver el título de un libro', () => {
        const libro = model.addLibro({ isbn: "978-84-670-1350-0", titulo: "El Quijote", autores: 'Cervantes', portada: 'https://es.wikipedia.org/wiki/Don_Quijote_de_la_Mancha', resumen: 'Las aventuras de Don Quijote y Sancho Panza por La Mancha', stock: '10', precio: '70'});
        assert.equal(libro.titulo, 'El Quijote');
        libro.titulo = "El Quijote Manchego";
        assert.equal(libro.titulo, 'El Quijote Manchego');
    });

    it('LIBRO: Debería asignar y devolver el ISBN de un libro', () => {
        const libro = model.addLibro({ isbn: "978-84-670-1350-1", titulo: "El Quijote", autores: 'Cervantes', portada: 'https://es.wikipedia.org/wiki/Don_Quijote_de_la_Mancha', resumen: 'Las aventuras de Don Quijote y Sancho Panza por La Mancha', stock: '10', precio: '70'});
        assert.equal(libro.isbn, '978-84-670-1350-1');
        libro.isbn = "978-84-670-1350-90";
        assert.equal(libro.isbn, '978-84-670-1350-90');
    });
 
    it('LIBRO: Debería asignar y devolver el autor de un libro', () => {
        const libro = model.addLibro({ isbn: "978-84-670-1350-2", titulo: "El Quijote", autores: 'Cervantes', portada: 'https://es.wikipedia.org/wiki/Don_Quijote_de_la_Mancha', resumen: 'Las aventuras de Don Quijote y Sancho Panza por La Mancha', stock: '10', precio: '70'});
        assert.equal(libro.autores, 'Cervantes');
        libro.autores = "Cervantes Saavedra";
        assert.equal(libro.autores, 'Cervantes Saavedra');
    });

    it('LIBRO: Debería asignar y devolver la portada de un libro', () => {
        const libro = model.addLibro({ isbn: "978-84-670-1350-3", titulo: "El Quijote", autores: 'Cervantes', portada: 'https://es.wikipedia.org/wiki/Don_Quijote_de_la_Mancha', resumen: 'Las aventuras de Don Quijote y Sancho Panza por La Mancha', stock: '10', precio: '70'});
        assert.equal(libro.portada, 'https://es.wikipedia.org/wiki/Don_Quijote_de_la_Mancha');
        libro.portada = "https://es.wikipedia.org/wiki/Platero_y_yo";
        assert.equal(libro.portada, 'https://es.wikipedia.org/wiki/Platero_y_yo');
    });

    it('LIBRO: Debería asignar y devolver el resumen de un libro', () => {
        const libro = model.addLibro({ isbn: "978-84-670-1350-4", titulo: "El Quijote", autores: 'Cervantes', portada: 'https://es.wikipedia.org/wiki/Don_Quijote_de_la_Mancha', resumen: 'Las aventuras de Don Quijote y Sancho Panza por La Mancha', stock: '10', precio: '70'});
        assert.equal(libro.resumen, 'Las aventuras de Don Quijote y Sancho Panza por La Mancha');   
        libro.resumen = "Un señor inestable mentalmente se escapa de su casa";
        assert.equal(libro.resumen, 'Un señor inestable mentalmente se escapa de su casa');
    });

    it('LIBRO: Debería asignar y devolver el stock de un libro', () => {
        const libro = model.addLibro({ isbn: "978-84-670-1350-5", titulo: "El Quijote", autores: 'Cervantes', portada: 'https://es.wikipedia.org/wiki/Don_Quijote_de_la_Mancha', resumen: 'Las aventuras de Don Quijote y Sancho Panza por La Mancha', stock: '10', precio: '70'});
        assert.equal(libro.stock, '10');
        libro.stock = "20";
        assert.equal(libro.stock, '20');
    });
        
    it('LIBRO: Debería asignar y devolver el precio de un libro', () => {
        const libro = model.addLibro({ isbn: "978-84-670-1350-6", titulo: "El Quijote", autores: 'Cervantes', portada: 'https://es.wikipedia.org/wiki/Don_Quijote_de_la_Mancha', resumen: 'Las aventuras de Don Quijote y Sancho Panza por La Mancha', stock: '10', precio: '70'});
        assert.equal(libro.precio, '70');
        libro.precio = "80";
        assert.equal(libro.precio, '80');
    });

    // DE CLIENTE:
    it('CLIENTE: Debería asignar y devolver el nombre de un cliente', () => {
        const cliente = model.addCliente({ dni: '12345678Z', nombre: 'Pepe', apellidos: 'Pérez', direccion: 'Calle Falsa 123', rol: 'CLIENTE', email: 'pepe0@perez.es', password: 'pepe123'});
        assert.equal(cliente.nombre, 'Pepe');
        cliente.nombre = 'Pepito';
        assert.equal(cliente.nombre, 'Pepito');
    });

    it('CLIENTE: Debería asignar y devolver el DNI de un cliente', () => {
        const cliente = model.addCliente({ dni: '12345678Z', nombre: 'Pepe', apellidos: 'Pérez', direccion: 'Calle Falsa 123', rol: 'CLIENTE', email: 'pepe1@perez.es', password: 'pepe123'});
        assert.equal(cliente.dni, '12345678Z');
        cliente.dni = '87654321Z';
        assert.equal(cliente.dni, '87654321Z');
    });

    it('CLIENTE: Debería asignar y devolver los apellidos de un cliente', () => {
        const cliente = model.addCliente({ dni: '12345678Z', nombre: 'Pepe', apellidos: 'Pérez', direccion: 'Calle Falsa 123', rol: 'CLIENTE', email: 'pepe2@perez.es', password: 'pepe123'});
        assert.equal(cliente.apellidos, 'Pérez');
        cliente.apellidos = 'Pérez Pérez';
        assert.equal(cliente.apellidos, 'Pérez Pérez');
    });

    it('CLIENTE: Debería asignar y devolver la dirección de un cliente', () => {
        const cliente = model.addCliente({ dni: '12345678Z', nombre: 'Pepe', apellidos: 'Pérez', direccion: 'Calle Falsa 123', rol: 'CLIENTE', email: 'pepe3@perez.es', password: 'pepe123'});
        assert.equal(cliente.direccion, 'Calle Falsa 123');
        cliente.direccion = 'Calle Falsa 124';
        assert.equal(cliente.direccion, 'Calle Falsa 124');
    });

    it('CLIENTE: Debería asignar y devolver el rol de un cliente', () => {
        const cliente = model.addCliente({ dni: '12345678Z', nombre: 'Pepe', apellidos: 'Pérez', direccion: 'Calle Falsa 123', rol: 'CLIENTE', email: 'pepe4@perez.es', password: 'pepe123'});
        assert.equal(cliente.rol, 'CLIENTE');
        cliente.rol = 'ADMIN';
        assert.equal(cliente.rol, 'ADMIN');
    });

    it('CLIENTE: Debería asignar y devolver el email de un cliente', () => {
        const cliente = model.addCliente({ dni: '12345678Z', nombre: 'Pepe', apellidos: 'Pérez', direccion: 'Calle Falsa 123', rol: 'CLIENTE', email: 'pepe5@perez.es', password: 'pepe123'});
        assert.equal(cliente.email, 'pepe5@perez.es');
        cliente.email = 'perez@pepe.es';
        assert.equal(cliente.email, 'perez@pepe.es');       
    });

    it('CLIENTE: Debería asignar y devolver la contraseña de un cliente', () => {
        const cliente = model.addCliente({ dni: '12345678Z', nombre: 'Pepe', apellidos: 'Pérez', direccion: 'Calle Falsa 123', rol: 'CLIENTE', email: 'pepe6@perez.es', password: 'pepe123'});
        assert.equal(cliente.password, 'pepe123');
        cliente.password = 'pepe321';
        assert.equal(cliente.password, 'pepe321');
    }); 

    it('CLIENTE: Debería asignar y devolver el carro de un cliente', () => {
        const cliente = model.addCliente({
            _id: 1000,
            dni: '12345678Z',
            nombre: 'Pepe',
            apellidos: 'Pérez',
            direccion: 'Calle Falsa 123',
            rol: 'CLIENTE',
            email: 'pepe7@perez.es',
            password: 'pepe123'
            // Eliminamos 'carro' de aquí
        });
        const libro = model.addLibro({
            _id: 1000,
            isbn: "978-84-670-1350-8",
            titulo: "El Quijote",
            autores: 'Cervantes',
            portada: 'https://es.wikipedia.org/wiki/Don_Quijote_de_la_Mancha',
            resumen: 'Las aventuras de Don Quijote y Sancho Panza por La Mancha',
            stock: 10,
            precio: 70
        });
        const item = { cantidad: 2, libro: libro._id, total: 140 };
        
        model.addClienteCarroItem(cliente._id, item);
        assert.equal(cliente.carro.items.length, 1);
        assert.equal(cliente.carro.items[0].libro.isbn, '978-84-670-1350-8');
    });
    
    it('ADMIN: Debería asignar y devolver el nombre, apellidos, DNI, dirección, rol, email y contraseña de un admin', () => {
        const admin = model.addAdmin({ dni: '111222333Z', nombre: 'Juan', apellidos: 'Pérez', direccion: 'Calle Falsa 666', rol: 'ADMIN', email: 'juan@perez.es', password: 'juan666'});
        assert.equal(admin.nombre, 'Juan');
        assert.equal(admin.apellidos, 'Pérez');
        assert.equal(admin.dni, '111222333Z');
        assert.equal(admin.direccion, 'Calle Falsa 666');
        assert.equal(admin.rol, 'ADMIN');
        assert.equal(admin.email, 'juan@perez.es');
        assert.equal(admin.password, 'juan666');

        admin.nombre = 'Juanito';
        admin.apellidos = 'Pérez Pérez';
        admin.dni = '333222111Z';
        admin.direccion = 'Calle Falsa 667';
        admin.rol = 'CLIENTE';
        admin.email = 'juanele@perez.es';
        admin.password = 'juan667';

        assert.equal(admin.nombre, 'Juanito');
        assert.equal(admin.apellidos, 'Pérez Pérez');
        assert.equal(admin.dni, '333222111Z');
        assert.equal(admin.direccion, 'Calle Falsa 667');
        assert.equal(admin.rol, 'CLIENTE');
        assert.equal(admin.email, 'juanele@perez.es');
        assert.equal(admin.password, 'juan667');

    });

        
    // TESTS: EXCEPCIONES
    
    //Agregar Libro sin ISBN
    it('EXCEPCIÓN: Debería lanzar un error al intentar agregar un libro sin ISBN', () => {
        expect(() => model.addLibro({ titulo: 'Libro Sin ISBN' })).to.throw('El libro no tiene ISBN');
    });
    
    //Agregar Libro con ISBN duplicado
    it('EXCEPCIÓN: Debería lanzar un error al agregar un libro con ISBN duplicado', () => {
        const libroData = { isbn: '978-84-670-1350-0', titulo: 'Libro Duplicado', autores: 'Autor', stock: '5', precio: '25' };
        model.addLibro(libroData);
        expect(() => model.addLibro(libroData)).to.throw(Error, `El ISBN ${libroData.isbn} ya existe`);
    });
    

    //Eliminar libro que no existe
    it('EXCEPCIÓN: Debería lanzar un error al intentar eliminar un libro que no existe', () => {
        expect(() => model.removeLibro(9999)).to.throw('Libro no encontrado');
    });

    //Modificar libro que no existe
    it('EXCEPCIÓN: Debería lanzar un error al intentar modificar un libro que no existe', () => {
        expect(() => model.updateLibro({ _id: 9999, titulo: 'Libro Inexistente' })).to.throw('No se encontró un libro con el ID: 9999');
    });
        
    // TESTS: AGREGAR, MODIFICAR Y ELIMINAR
    
    //Agregar Libro correctamente
    it('AGREGAR: Debería agregar un libro correctamente', () => {
        const libroData = { isbn: '978-84-670-1350-7', titulo: 'Nuevo Libro', autores: 'Nuevo Autor', stock: '15', precio: '50' };
        const libro = model.addLibro(libroData);
        assert.equal(libro.titulo, 'Nuevo Libro');
        assert.equal(libro.isbn, '978-84-670-1350-7');
    });

    //Agregar Cliente correctamente
    it('AGREGAR: Debería agregar un cliente correctamente', () => {
        const clienteData = { dni: '98765432X', nombre: 'Juan', apellidos: 'García', direccion: 'Calle Nueva 1', rol: 'CLIENTE', email: 'juan@garcia.es', password: 'juan123' };
        const cliente = model.addCliente(clienteData);
        assert.equal(cliente.nombre, 'Juan');
        assert.equal(cliente.email, 'juan@garcia.es');
    });
    
    //Modificar un libro correctamente
    it('MODIFICAR: Debería modificar un libro existente', () => {
        const libroData = { isbn: '978-84-670-1350-8', titulo: 'Libro Original', autores: 'Autor Original', stock: '20', precio: '60' };
        const libro = model.addLibro(libroData);
        
        const updatedData = { _id: libro._id, titulo: 'Libro Modificado', autores: 'Autor Modificado' };
        const libroModificado = model.updateLibro(updatedData);
        
        assert.equal(libroModificado.titulo, 'Libro Modificado');
        assert.equal(libroModificado.autores, 'Autor Modificado');
    });

    //Modificar un cliente correctamente
    it('MODIFICAR: Debería modificar un cliente existente', () => {
        const clienteData = { dni: '87654321X', nombre: 'María', apellidos: 'López', direccion: 'Avenida Siempre Viva 742', rol: 'CLIENTE', email: 'maria@lopez.es', password: 'maria123' };
        const cliente = model.addCliente(clienteData);
      
        const updatedData = { _id: cliente._id, direccion: 'Avenida Siempre Viva 743' };
        const clienteModificado = model.updateUsuario(updatedData);
      
        assert.equal(clienteModificado.direccion, 'Avenida Siempre Viva 743');
    });
    
    //Eliminar un libro correctamente
    it('ELIMINAR: Debería eliminar un libro existente', () => {
        const libroData = { isbn: '978-84-670-1350-9', titulo: 'Libro a Eliminar', autores: 'Autor', stock: '10', precio: '40' };
        const libro = model.addLibro(libroData);
      
        const libroEliminado = model.removeLibro(libro._id);
        assert.equal(libroEliminado.isbn, '978-84-670-1350-9');
      
        const libroBuscado = model.getLibroPorId(libro._id);
        assert.isUndefined(libroBuscado);
    });

    // TESTS: CÁLCULOS
    
    //Calculo de subtotal, IVA y total en carrito
    it('CÁLCULO: Debería calcular correctamente el subtotal, IVA y total en el carrito', () => {
        const clienteData = { dni: '12345678Y', nombre: 'Carlos', apellidos: 'Martínez', direccion: 'Calle Mayor 10', rol: 'CLIENTE', email: 'carlos@martinez.es', password: 'carlos123' };
        const cliente = model.addCliente(clienteData);
      
        const libro1 = model.addLibro({ isbn: '978-84-670-1351-0', titulo: 'Libro 1', autores: 'Autor 1', stock: '10', precio: '30' });
        const libro2 = model.addLibro({ isbn: '978-84-670-1351-1', titulo: 'Libro 2', autores: 'Autor 2', stock: '5', precio: '50' });
      
        model.addClienteCarroItem(cliente._id, { libro: libro1._id, cantidad: 2 });
        model.addClienteCarroItem(cliente._id, { libro: libro2._id, cantidad: 1 });
      
        const carro = cliente.getCarro();
      
        const expectedSubtotal = (2 * 30) + (1 * 50); // 110
        const expectedIva = expectedSubtotal * 0.21; // 23.1
        const expectedTotal = expectedSubtotal + expectedIva; // 133.1
      
        assert.equal(carro.subtotal, expectedSubtotal);
        assert.closeTo(carro.iva, expectedIva, 0.01);
        assert.closeTo(carro.total, expectedTotal, 0.01);
    });
    
    //Calculo en factura al facturar una compra
    it('CÁLCULO: Debería calcular correctamente el total en la factura al facturar una compra', () => {
        const clienteData = { dni: '56789012Z', nombre: 'Laura', apellidos: 'Gómez', direccion: 'Calle Luna 15', rol: 'CLIENTE', email: 'laura@gomez.es', password: 'laura123' };
        const cliente = model.addCliente(clienteData);
      
        const libro = model.addLibro({ isbn: '978-84-670-1351-2', titulo: 'Libro Factura', autores: 'Autor Factura', stock: '8', precio: '80' });
      
        model.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 1 });
      
        const datosFacturacion = {
          razonSocial: 'Laura Gómez',
          dni: '56789012Z',
          direccion: 'Calle Luna 15',
          email: 'laura@gomez.es',
          fecha: new Date()
        };
      
        const factura = model.facturarCompraCliente(cliente, datosFacturacion);
      
        const expectedSubtotal = 1 * 80; // 80
        const expectedIva = expectedSubtotal * 0.21; // 16.8
        const expectedTotal = expectedSubtotal + expectedIva; // 96.8
      
        assert.equal(factura.subtotal, expectedSubtotal);
        assert.closeTo(factura.iva, expectedIva, 0.01);
        assert.closeTo(factura.total, expectedTotal, 0.01);
    });         
});