//SERVIDOR EN NODEJS PURO PARA CAPTURAR DATOS DE CLIENTE
const http = require('http');
const url = require('url');

const PORT = 3000;

const clientes = [
    {
        id: 1,
        nombre: "Maria Lopez",
        correo: "maria.lopez@correo.com",
        telefono: "7000-1234",
        direccion: "Zona av lujan "
    },
    {
        id: 2,
        nombre: "Carlos Perez",
        correo: "carlos.perez@correo.com",
        telefono: "7000-5678",
        direccion: "Zona los pazos "
    }
];

const servidor = http.createServer((req, res) => {
    const partesUrl = url.parse(req.url, true);
    const ruta = partesUrl.pathname;
    const metodo = req.method;

    res.setHeader("Content-Type", "application/json");

    // GET /
    if (ruta === "/" && metodo === "GET") {
        res.writeHead(200);
        res.end(JSON.stringify({ mensaje: "API NODE YIYI" }));
        return;
    }

    // GET /api/clientes
    if (ruta === "/api/clientes" && metodo === "GET") {
        res.writeHead(200);
        res.end(JSON.stringify(clientes));
        return;
    }

    // GET /api/clientes/:id
    if (ruta.match(/^\/api\/clientes\/\d+$/) && metodo === "GET") {
        const id = Number(ruta.split("/")[3]);
        const cliente = clientes.find(cliente => cliente.id === id);
        if (!cliente) {
            res.writeHead(404);
            res.end(JSON.stringify({ mensaje: "Cliente no encontrado" }));
            return;
        }
        res.writeHead(200);
        res.end(JSON.stringify(cliente));
        return;
    }

    // POST /api/clientes
    if (ruta === "/api/clientes" && metodo === "POST") {
        let cuerpo = "";
        req.on("data", chunk => {
            cuerpo += chunk;
        });
        req.on("end", () => {
            const datos = JSON.parse(cuerpo);
            const nuevoCliente = {
                id: clientes.length + 1, // generamos el id tomando el ultimo y sumando 1
                nombre: datos.nombre,
                correo: datos.correo,
                telefono: datos.telefono,
                direccion: datos.direccion
            };
            clientes.push(nuevoCliente);
            res.writeHead(201);
            res.end(JSON.stringify(nuevoCliente));
        });
        return;
    }

    // PUT /api/clientes/:id
    if (ruta.match(/^\/api\/clientes\/\d+$/) && metodo === "PUT") {
        const id = Number(ruta.split("/")[3]);
        const cliente = clientes.find(cliente => cliente.id === id);
        if (!cliente) {
            res.writeHead(404);
            res.end(JSON.stringify({ mensaje: "Cliente no encontrado" }));
            return;
        }
        let cuerpo = "";
        req.on("data", chunk => {
            cuerpo += chunk;
        });
        req.on("end", () => {
            const datos = JSON.parse(cuerpo);
            cliente.nombre = datos.nombre ?? cliente.nombre;
            cliente.correo = datos.correo ?? cliente.correo;
            cliente.telefono = datos.telefono ?? cliente.telefono;
            cliente.direccion = datos.direccion ?? cliente.direccion;
            res.writeHead(200);
            res.end(JSON.stringify(cliente));
        });
        return;
    }

    // DELETE /api/clientes/:id
    if (ruta.match(/^\/api\/clientes\/\d+$/) && metodo === "DELETE") {
        const id = Number(ruta.split("/")[3]);
        const indice = clientes.findIndex(cliente => cliente.id === id);
        if (indice === -1) {
            res.writeHead(404);
            res.end(JSON.stringify({ mensaje: "Cliente no encontrado" }));
            return;
        }
        clientes.splice(indice, 1);
        res.writeHead(204);
        res.end();
        return;
    }

    // Ruta no encontrada
    res.writeHead(404);
    res.end(JSON.stringify({ mensaje: "Ruta no encontrada" }));
});

servidor.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});