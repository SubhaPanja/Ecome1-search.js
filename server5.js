const http = require('http');
const url = require('url');
const fs = require('fs');

// Task 1: Create an endpoint to handle "/products?category=cloths"
const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    // Task 1: Endpoint "/products?category=cloths" returns products matching the category
    if (reqUrl.pathname === '/products' && reqUrl.query.category) {
        const category = reqUrl.query.category.toLowerCase();

        fs.readFile('products.json', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                console.error('Error reading products.json:', err);
                return;
            }

            const products = JSON.parse(data);
            const filteredProducts = products.filter(product => product.category.toLowerCase() === category);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(filteredProducts));
        });
    }

    // Task 2: Endpoint "/filterproducts?category=cloths&price=300" returns products matching the category and price
    else if (reqUrl.pathname === '/filterproducts' && reqUrl.query.category && reqUrl.query.price) {
        const category = reqUrl.query.category.toLowerCase();
        const price = parseFloat(reqUrl.query.price);

        fs.readFile('products.json', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                console.error('Error reading products.json:', err);
                return;
            }

            const products = JSON.parse(data);
            const filteredProducts = products.filter(product => 
                product.category.toLowerCase() === category && product.price >= price
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(filteredProducts));
        });
    }

    // Handle invalid endpoints
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
server.listen(3001, () => {
    console.log('Server started...');
});

// Handle server start error
server.on('error', (error) => {
    console.error('Unable to start server:', error);
});
