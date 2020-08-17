const http = require('http');
const URL = require('url').URL;

const items = ["milk", "bread", "eggs", "flour"];

http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const parameters = url.searchParams;
    // Write the response
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end(`You selected item ${parameters.get('itemNum')}: ${items[parameters.get('itemNum')]}`);
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');