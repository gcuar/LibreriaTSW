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