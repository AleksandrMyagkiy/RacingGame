const PORT = 3000;
const DOCROOT = './../dist/';

// 1. подключить нужные модули: http, express, path

const http = require('http');
const path = require('path');
const express = require('express');

// 2. создать сервер, используя express и http
const app = express();
const server = http.createServer(app);

// 3. настроить отдачу игры при запросе к серверу
const documentRoot = path.join(__dirname, DOCROOT);
const staticContent = express.static(documentRoot);
app.use(staticContent);

console.log(documentRoot);

// 4. запускаем сервер
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});