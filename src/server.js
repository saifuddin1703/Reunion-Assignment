const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
dotenv.config({
    path : "src/.env"
})
const server = http.createServer(app);
server.listen(PORT,()=>{
    console.log(`server is listening on port ${process.env.port}`);
})