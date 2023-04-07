const app = require("./app")


const port = 3000
app.set("port", ""+port)

const http = require("http")
const server = http.createServer(app)

// Start the server
server.on('listening', () => {
    const address = server.address
    const bind = typeof address === "string" ? "pipe " + address : "port " + port
    console.log(`Listening on ${bind}`)
});

server.listen(port)