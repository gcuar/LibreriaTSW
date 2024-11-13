import puppeteer from 'puppeteer';
import { expect } from 'chai';
import { assert } from 'chai';
import mocha from 'mocha';
import { model } from './model.mjs';

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

    // it('CLIENTE: Debería asignar y devolver el carro de un cliente (no sé hacerla)', () => {
    //     const cliente = model.addCliente({ _id: 1000, dni: '12345678Z', nombre: 'Pepe', apellidos: 'Pérez', direccion: 'Calle Falsa 123', rol: 'CLIENTE', email: 'pepe7@perez.es', password: 'pepe123', carro: { items: [] }});
    //     const Libro = model.addLibro({_id: 1000, isbn: "978-84-670-1350-8", titulo: "El Quijote", autores: 'Cervantes', portada: 'https://es.wikipedia.org/wiki/Don_Quijote_de_la_Mancha', resumen: 'Las aventuras de Don Quijote y Sancho Panza por La Mancha', stock: 10, precio: 70 });
    //     const item = { cantidad: 2, libro: Libro, total: 140 };
        
    //     model.addClienteCarroItem(cliente._id, item);
    //     assert.equal(cliente.carro.items.length, 1);
    //     assert.equal(cliente.carro.items[0].libro.isbn, '978-84-670-1350-8');
    // });



 

    
        
    // TESTS: EXCEPCIONES

    // TESTS: AGREGAR, MODIFICAR Y ELIMINAR
   

    // TESTS: CÁLCULOS




   
});