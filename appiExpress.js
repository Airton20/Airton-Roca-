const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const clientes = [
    {
        id: 1,
        nombre: "Luis Hidelgo",
        correo: "lius.hidelgo@correo.com",
        telefono: "1654-8548",
        direccion: "la cuchuilla"
    },
    {
        id: 2,
        nombre: "Manuel Moscoso",
        correo: "manuel.moscoso@correo.com",
        telefono: "5824-4598",
        direccion: "calle motacu"
    }
];

app.get("/", (req, res) => {
    res.send("API PROGRA yiyi- Clientes");
});

// Obtener todos los clientes
app.get("/api/clientes", (req, res) => {
    res.json(clientes);
});

// Obtener un cliente por id
app.get("/api/clientes/:id", (req, res) => {
    const id = Number(req.params.id);
    const cliente = clientes.find(
        cliente => cliente.id === id
    );
    if (!cliente) {
        return res.status(404).json({
            mensaje: "Cliente no encontrado"
        });
    }
    res.json(cliente);
});

// Registrar un nuevo cliente
app.post("/api/clientes", (req, res) => {
    const nuevoCliente = {
        id: clientes.length + 1, 
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono,
        direccion: req.body.direccion
    };
    clientes.push(nuevoCliente);
    res.status(201).json(nuevoCliente);
});

// Actualizar un cliente existente
app.put("/api/clientes/:id", (req, res) => {
    const id = Number(req.params.id);
    const cliente = clientes.find(
        cliente => cliente.id === id
    );
    if (!cliente) {
        return res.status(404).json({
            mensaje: "Cliente no encontrado"
        });
    }
    cliente.nombre = req.body.nombre ?? cliente.nombre;
    cliente.correo = req.body.correo ?? cliente.correo;
    cliente.telefono = req.body.telefono ?? cliente.telefono;
    cliente.direccion = req.body.direccion ?? cliente.direccion;
    res.json(cliente);
});

// Eliminar un cliente
app.delete("/api/clientes/:id", (req, res) => {
    const id = Number(req.params.id);
    const indice = clientes.findIndex(
        cliente => cliente.id === id
    );
    if (indice === -1) {
        return res.status(404).json({
            mensaje: "Cliente no encontrado"
        });
    }
    clientes.splice(indice, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});