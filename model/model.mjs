
export const ROL = {
  ADMIN: "ADMIN",
  CLIENTE: "CLIENTE",
};

class Identificable {
  _id;
  assignId() {
    this._id = Libreria.genId();
  }
}

export class Libreria {
  libros = [];
  usuarios = [];
  facturas = [];
  static lastId = 0;

  constructor() { }

  static genId() {
    return ++this.lastId;
  }

  /**
   * Libros
   */

  getLibros() {
    return this.libros;
  }

  addLibro(obj) {
    if (!obj.isbn) throw new Error('El libro no tiene ISBN');
    if (this.getLibroPorIsbn(obj.isbn)) throw new Error(`El ISBN ${obj.isbn} ya existe`)
    let libro = new Libro();
    Object.assign(libro, obj);
    // Convertir precio y stock a números
    libro.precio = parseFloat(libro.precio);
    libro.stock = parseInt(libro.stock);
    libro.assignId();
    this.libros.push(libro);
    return libro;
  }

  getLibroPorId(id) {
    return this.libros.find((v) => v._id == id);
  }

  getLibroPorIsbn(isbn) {
    return this.libros.find((v) => v.isbn == isbn);
  }

  getLibroPorTitulo(titulo) {
    titulo = titulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.libros.find(
      (v) => !!v.titulo.match(new RegExp(titulo, 'i'))
    );
  }

  removeLibro(id) {
    let libro = this.getLibroPorId(id);
    if (!libro) throw new Error('Libro no encontrado');
    else this.libros = this.libros.filter(l => l._id != id);
    return libro;
  }

  updateLibro(obj) {
    let libro = this.getLibroPorId(obj._id);
    if (!libro) {
      throw new Error(`No se encontró un libro con el ID: ${obj._id}`);
    }
    Object.assign(libro, obj);
    return libro;
  }

  /**
   * Usuario
   */

  addUsuario(obj) {
    if (obj.rol == ROL.CLIENTE)
      this.addCliente(obj);
    else if (obj.rol == ROL.ADMIN)
      this.addAdmin(obj);
    else throw new Error('Rol desconocido');
  }

  addCliente(obj) {
    let cliente = this.getClientePorEmail(obj.email);
    if (cliente) throw new Error('Correo electrónico registrado');
    cliente = new Cliente();
    Object.assign(cliente, obj);
    cliente.assignId();
    this.usuarios.push(cliente);
    return cliente;
  }

  addAdmin(obj) {
    let admin = new Administrador();
    Object.assign(admin, obj)
    admin.assignId();
    this.usuarios.push(admin);
    return admin;
  }

  getClientes() {
    return this.usuarios.filter((u) => u.rol == ROL.CLIENTE);
  }

  getAdmins() {
    return this.usuarios.filter((u) => u.rol == ROL.ADMIN);
  }

  getUsuarioPorId(_id) {
    return this.usuarios.find((u) => u._id == _id);
  }

  getUsuarioPorEmail(email) {
    return this.usuarios.find((u) => u.email == email);
  }

  getUsuarioPorDni(dni) {
    return this.usuarios.find((u) => u.dni == dni);
  }

  updateUsuario(obj) {
    let usuario = this.getUsuarioPorId(obj._id);
    Object.assign(usuario, obj);
    return usuario;
  }

  getClientePorEmail(email) {
    return this.usuarios.find(u => u.rol == ROL.CLIENTE && u.email == email);
  }

  getClientePorId(id) {
    return this.usuarios.find(u => u.rol == ROL.CLIENTE && u._id == id);
  }

  getAdministradorPorEmail(email) {
    return this.usuarios.find(u => u.rol == ROL.ADMIN && u.email == email);
  }

  autenticar(obj) {
    let email = obj.email;
    let password = obj.password;
    let usuario;

    if (obj.rol == ROL.CLIENTE) usuario = this.getClientePorEmail(email);
    else if (obj.rol == ROL.ADMIN) usuario = this.getAdministradorPorEmail(email);
    else throw new Error('Rol no encontrado');

    if (!usuario) throw new Error('Usuario no encontrado');
    else if (usuario.verificar(password)) return usuario;
    else throw new Error('Error en la contraseña');
  }

  addClienteCarroItem(clienteId, item) {
    let cliente = this.getClientePorId(clienteId);
    if (!cliente) throw new Error('Cliente no encontrado');
    let libro = this.getLibroPorId(item.libro);
    if (!libro) throw new Error('Libro no encontrado');
    item.libro = libro;
    cliente.addCarroItem(item);
  }

  getAdminPorId(id) {
    return this.usuarios.find(u => u.rol == ROL.ADMIN && u._id == id);
  }


  updateAdmin(adminData, adminID) {
    // Buscar el administrador existente por su ID o email
    let admin =  this.getAdminPorId(adminID);
  
    // Si no se encuentra el administrador, lanzar un error
    if (!admin) throw new Error('Administrador no encontrado');

    // Actualizar los datos del administrador con los nuevos valores de adminData
    libreriaSession.setUsuarioId(adminID);
    Object.assign(admin, adminData);
  
    // Retornar el administrador actualizado como confirmación
    return admin;
  }

  updateCliente(clienteData, clienteID) {
    // Buscar el cliente existente por su ID o email
    let cliente =  this.getClientePorId(clienteID);
  
    // Si no se encuentra el cliente, lanzar un error
    if (!cliente) throw new Error('Cliente no encontrado');

    // Actualizar los datos del cliente con los nuevos valores de clienteData
    libreriaSession.setUsuarioId(clienteID);
    console.log("ID en sesión después de setUsuarioId:", sessionStorage.getItem("USUARIO_ID"));
    Object.assign(cliente, clienteData);
  
    // Retornar el cliente actualizado como confirmación
    return cliente;
  }


  setClienteCarroItemCantidad(id, index, cantidad) {
    let cliente = this.getClientePorId(id);
    return cliente.setCarroItemCantidad(index, cantidad);
  }

  getCarroCliente(id) {
    return this.getClientePorId(id).carro;
  }

  /**
   * Factura
   */
  crearFactura(datos) {
    const factura = new Factura();
    Object.assign(factura, datos);
    factura.cliente = datos.cliente; // Asegura que el cliente se asigna correctamente
    factura.genNumero(); // Genera un número único de factura
    factura.calcular(); // Asegúrate de que el método calcular está correcto en la clase Factura
    this.facturas.push(factura);
    return factura;
  }

  getFacturas() {
    return this.facturas;
  }

  getFacturasPorClienteId(clienteId) {
    return this.facturas.filter((f) => f.cliente._id == clienteId);
  }

  getFacturaPorId(id) {
    return this.facturas.find((f) => f._id == id);
  }

  getFacturaPorNumero(numero) {
    return this.facturas.find((f) => f.numero == numero);
  }

  facturarCompraCliente(cliente, datosFacturacion) {
    try {
      if (!cliente) {
        console.error('Cliente no definido en facturarCompraCliente');
        throw new Error('Cliente no definido');
      }
      console.log('Cliente en facturarCompraCliente:', cliente);
  
      if (!cliente.carro) {
        console.error('El cliente no tiene un carro');
        throw new Error('El cliente no tiene un carro');
      }
  
      if (!cliente.carro.items) {
        console.error('El carro del cliente no tiene items');
        throw new Error('El carro del cliente no tiene items');
      }
  
      if (cliente.carro.items.length < 1) {
        console.error('No hay productos en el carrito');
        throw new Error('No hay productos en el carrito');
      }
  
      let factura = new Factura();
      factura.cliente = cliente;
      factura.items = cliente.carro.items.map(item => {
        // Crear una copia de cada item
        let newItem = new Item();
        newItem.cantidad = item.cantidad;
        newItem.libro = item.libro; 
        newItem.calcular();
        return newItem;
      });
      
      // Asignar las propiedades faltantes de la factura
      factura.razonSocial = datosFacturacion.razonSocial;
      factura.dni = datosFacturacion.dni;
      factura.direccion = datosFacturacion.direccion;
      factura.email = datosFacturacion.email;
      factura.fecha = datosFacturacion.fecha;
      //Calcular el total
      factura.calcular();
      
      this.facturas.push(factura);
  
      cliente.carro.vaciar();
  
      console.log('Factura creada:', factura);
  
      return factura;
    } catch (error) {
      console.error('Error en facturarCompraCliente:', error);
      throw error; // Re-lanzar el error para que sea capturado en pagarClick
    }
  }
  
  

  removeFactura(id) {
    let factura = this.getFacturaPorId(id);
    if (!factura) throw new Error('Factura no encontrada');
    this.facturas = this.facturas.filter(f => f._id != id);
    return factura;
  }
  lastFacturaNumero = 0; // Inicializar lastFacturaNumero
  genNumeroFactura() {
    console.log('Nuevo número de factura:', this.lastFacturaNumero);
    return ++this.lastFacturaNumero;
  }
}

class Libro extends Identificable {
  isbn;
  titulo;
  autores;
  portada;
  resumen;
  stock;
  precio;
  constructor() {
    super();
  }

  incStockN(n) {
    this.stock = this.stock + n;
  }

  decStockN(n) {
    this.stock = this.stock - n;
  }

  incPrecioP(porcentaje) {
    this.precio = this.precio * (1 + porcentaje / 100);
  }

  dexPrecioP(porcentaje) {
    this.precio = this.precio * (porcentaje / 100);
  }
}

class Usuario extends Identificable {
  dni;
  nombre;
  apellidos;
  direccion;
  rol;
  email;
  password;

  verificar(password) {
    return this.password == password;
  }
}

class Cliente extends Usuario {
  carro;
  constructor() {
    super();
    this.rol = ROL.CLIENTE;
    this.carro = new Carro();
  }


  getCarro() {
    return this.carro;
  }
  addCarroItem(item) {
    this.carro.addItem(item);
  }
  setCarroItemCantidad(index, cantidad) {
    this.getCarro().setItemCantidad(index, cantidad);
  }
  borrarCarroItem(index) {
    this.carro.borrarItem(index);
  }

}

class Administrador extends Usuario {
  constructor() {
    super();
    this.rol = ROL.ADMIN;
  }
}

class Factura extends Identificable {
  id;
  numero;
  fecha;
  razonSocial;
  direccion;
  email;
  dni;
  items = [];
  subtotal;
  iva;
  total;
  cliente;
  constructor() {
    super();
    this.assignId(); //Asignar Id único
    this.numero = model.genNumeroFactura(); // Genera un número único
    this.fecha = new Date();
    this.clienteId = null;
    this.items = [];
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;
  }

  genNumero() {
    this.numero = model.genNumeroFactura();
  }

  addItem(obj) {
    let item = new Item();
    Object.assign(item, obj);
    this.items.push(item);
    this.calcular();
    return item;
  }

  removeItems() {
    this.items = [];
    this.calcular();
  }

  calcular() {
    this.subtotal = 0;
    // Recorremos los items y sumamos los totales
    this.items.forEach(item => {
      if (typeof item.total === 'undefined') {
        item.calcular(); // Si no tiene total, lo calculamos
      }
      this.subtotal += item.total;
    });
    this.iva = this.subtotal * 0.21; // Calcular IVA (21%)
    this.total = this.subtotal + this.iva; // Actualizar el total incluyendo el IVA
  }
}

class Item {
  cantidad;
  libro;
  total;
  constructor() {
    this.cantidad = 0;
  }

  calcular() {
    this.total = this.cantidad * this.libro.precio;
  }
}

class Carro {
  items = [];
  subtotal;
  iva;
  total;
  constructor() {
    this.items = [];
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;
  }

  addItem(obj) {
    let item = this.items.find(i => i.libro._id == obj.libro._id);
    if (!item) {
      item = new Item();
      Object.assign(item, obj);
      item.calcular();
      this.items.push(item);
    } else {
      item.cantidad = item.cantidad + obj.cantidad;
      item.calcular();
    }
    this.calcular();
  }

  setItemCantidad(index, cantidad) {
    if (cantidad < 0) throw new Error('Cantidad inferior a 0')
    if (cantidad == 0) this.items = this.items.filter((v, i) => i != index);
    else {
      let item = this.items[index];
      item.cantidad = cantidad;
      item.calcular();
    }
    this.calcular();
  }

  borrarItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.calcular();
    } else {
      throw new Error('Índice de ítem inválido');
    }
  }
  calcular() {
    this.subtotal = this.items.reduce((total, i) => total + i.total, 0);
    this.iva = this.subtotal * 0.21;
    this.total = this.subtotal + this.iva;
  }
  vaciar(){
    this.items = [];
  }

}
export const model = new Libreria();