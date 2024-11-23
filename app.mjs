import express from 'express';
import path from 'path';
import url from 'url';
import { model } from './model/model.mjs';
import { seed } from './model/seeder.mjs';
import { ROL } from './model/model.mjs';
seed();

const STATIC_DIR = url.fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/libros', function (req, res, next) {
  res.json(model.getLibros());
})

app.get('/api/libros/:id', function (req, res, next) {
  let id = req.params.id;
  if (!id) res.status(500).json({ error: 'ID no definido' });
  else {
    try {
      let libro = model.getLibroPorId(id);
      if (!libro) res.status(404).json({ error: 'Libro no encontrado' });
      else res.json(libro);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
})

app.delete('/api/libros/:id', function (req, res, next) {
  let id = req.params.id;
  if (!id) res.status(500).json({ error: 'ID no definido' });
  else {
    try {
      let libro = model.removeLibro(id);
      if (!libro) res.status(404).json({ error: 'Libro no encontrado' });
      else res.json(libro);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
})

app.post('/api/libros', function (req, res, next) {
  let obj = req.body;
  try {
    let libro = model.addLibro(obj);
    res.json(libro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/libros', function (req, res, next) {
  let libros = req.body;
  try {
    res.json(model.setLibros(libros));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/libros/:id', function (req, res, next) {
  let id = req.params.id;
  if (!id) res.status(500).json({ error: 'ID no definido' });
  else {
    try {
      let libro = model.getLibroPorId(id);
      if (!libro) res.status(404).json({ error: 'Libro no encontrado' });
      else {
        libro = Object.assign(libro, req.body);
        model.updateLibro(libro);
        res.json(model.getLibroPorId(id));
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
});

app.post('/api/autenticar', function (req, res, next) {
  console.log('/api/autenticar')
  try {
    let usuario = model.autenticar(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(401).json({ message: err.message })
  }
})
//Admins

app.get('/api/admins', function (req, res) {
  console.log('/api/admins');
  try {
    const admins = model.getAdmins(); // Llama al método para obtener los clientes
    res.json(admins); // Envía la lista de clientes como respuesta en formato JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los admins' }); // Manejo de errores
  }
});

app.put('/api/admins', function (req, res, next) {
  let admins = req.body;
  try {
    res.json(model.addAdmin(admins));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admins/:id', function (req, res) {
  console.log('/api/admins/:id');
  try {
    const id = req.params.id; // Obtener el ID desde los parámetros de la URL
    const clienteEliminado = model.removeAdmin(id); // Llamar a la función para eliminar el admin
    res.json({ message: 'Admin eliminado con éxito', admin: adminEliminado });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message }); // Manejar errores y enviar una respuesta adecuada
  }
});

app.post('/api/admins', function (req, res, next) {
  console.log('/api/admins')
  try {
    let usuario = model.addAdmin(req.body);
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: err.message })
  }
})

app.put('/api/admins/:id', function (req, res, next) {
  let id = req.params.id;
  if (!id) res.status(500).json({ error: 'ID no definido' });
  else {
    let admin = model.getAdminPorId(id);
    if (!admin) res.status(404).json({ error: 'Admin no encontrado' });
    else {
      admin = Object.assign(admin, req.body);
      model.updateAdmin(admin);
      res.json(model.getAdminPorId(id));
    }
  }
});

// autenticar(obj) - admins
app.post('/api/admins/autenticar', function (req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const admin = model.autenticar({ email, password, rol: ROL.ADMIN });

    res.status(200).json({ message: 'Autenticación exitosa', admin });
  } catch (err) {
    // console.error('Error en autenticación:', err.message); // Log detallado del error
    
    if (err.message === 'Rol no encontrado') {
      res.status(400).json({ error: 'Rol no válido' });
    } else if (err.message === 'Usuario no encontrado') {
      res.status(404).json({ error: 'Administrador no encontrado' });
    } else if (err.message === 'Error en la contraseña') {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
  }
  });

  app.get('api/libros?titulo=titulo', function(req, res, next){
    let titulo = req.query.titulo;
    if (!titulo) res.status(400).json({ error: 'Id no definido' });
    else {
        let libroPorTitulo = model.getLibroPorTitulo(titulo);
        if(!libroPorTitulo){
          res.status(404).json({ error: 'Libro con Titulo no encontrado' });
        } else {
          res.json(libroPorTitulo); 
      }
    }
  });

  app.put('/api/libros/:id', function (req, res, next) {
    let id = req.params.id;
    if (!id) res.status(500).json({ error: 'ID no definido' });
    else {
      let libro = model.getLibroPorId(id);
      if (!libro) res.status(404).json({ error: 'Libro no encontrado' });
      else {
        libro = Object.assign(libro, req.body);
        model.updateLibro(libro);
        res.json(model.getLibroPorId(id));
      }
    }
  });
  
  app.get('/api/clientes', function (req, res) {
    console.log('/api/clientes');
    try {
      const clientes = model.getClientes(); // Llama al método para obtener los clientes
      res.json(clientes); // Envía la lista de clientes como respuesta en formato JSON
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener los clientes' }); // Manejo de errores
    }
  });
  
app.post('/api/clientes', function (req, res, next) {
  console.log('/api/clientes')
  try {
    let usuario = model.addCliente(req.body);
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: err.message })
  }
})

app.delete('/api/clientes/:id', function (req, res) {
  console.log('/api/clientes/:id');
  try {
    const id = req.params.id; // Obtener el ID desde los parámetros de la URL
    const clienteEliminado = model.removeCliente(id); // Llamar a la función para eliminar el cliente
    res.json({ message: 'Cliente eliminado con éxito', cliente: clienteEliminado });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message }); // Manejar errores y enviar una respuesta adecuada
  }
});

//FACTURAS

 app.get('/api/facturas', (req, res) => {
  try {
    const facturas = model.getFacturas();
    res.json(facturas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener las facturas' });
  }
});

app.put('/api/facturas', (req, res) => {
  try {
    const {facturas} = req.body; // Array de facturas sin ID
    if (!Array.isArray(facturas)) {
      return res.status(400).json({ message: 'El cuerpo debe ser un array' });
    }

    facturas.forEach((factura) => {
      const nuevaFactura = model.crearFactura(factura); // El ID y número se generan automáticamente
      console.log(`Factura creada: ${nuevaFactura.numero}`);
    });

    res.status(201).json({ message: 'Facturas creadas correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear facturas' });
  }
});

app.delete('/api/facturas', (req, res) => {
  try {
    model.facturas = []; // Elimina todas las facturas
    res.json({ message: 'Todas las facturas han sido eliminadas' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar las facturas' });
  }
});

app.post('/api/facturas', (req, res) => {
  try {
    const { clienteId, datosFacturacion } = req.body; // Cliente y datos necesarios
    if (!clienteId || !datosFacturacion) {
      return res.status(400).json({ message: 'Cliente y datos de facturación son requeridos' });
    }

    const cliente = model.getClientePorId(clienteId);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const factura = model.facturarCompraCliente(cliente, datosFacturacion);
    res.status(201).json(factura);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al facturar compra del cliente' });
  }
});

 app.get('/api/facturas/:id', (req, res) => {
  try {
    const id = req.params;
    const factura = model.getFacturaPorId(id);
    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.json(factura);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener la factura' });
  }
});

app.get('/api/facturas?numero=numero', (req, res) => {
  try {
    const {numero, cliente}  = req.query;

    if (numero) {
      const factura = model.getFacturaPorNumero(numero);
      if (!factura) {
        return res.status(404).json({ message: 'Factura no encontrada' });
      }
      return res.json(factura);
    }

    if (cliente) {
      const facturas = model.getFacturasPorClienteId(cliente);
      return res.json(facturas);
    }

    res.status(400).json({ message: 'Debe proporcionar un número o un ID de cliente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener la factura o facturas' });
  }
});

app.get('/api/facturas/cliente=id', (req, res) => {
  console.log('GET /api/facturas');
  const cliente = req.query;

  try {
    if (!cliente) {
      return res.status(400).json({ message: 'El parámetro cliente es obligatorio.' });
    }

    const facturas = model.getFacturasPorCliente(cliente);

    if (facturas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron facturas para este cliente.' });
    }

    res.json(facturas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener las facturas.' });
  }
});

app.use('/', express.static(path.join(STATIC_DIR, 'public')));

app.use('/libreria*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'public/libreria/index.html'));
});


app.all('*', function (req, res, next) {
  console.error(`${req.originalUrl} not found!`);
  res.status(404).send('<html><head><title>Not Found</title></head><body><h1>Not found!</h1></body></html>')
})

app.listen(PORT, function () {
  console.log(`Static HTTP server listening on ${PORT}`)
})