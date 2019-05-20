let mysql = require('mysql');
let inquirer = require('inquirer');

let connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    afterConnection();
});

function afterConnection() {
    inquirer
        .prompt([
            {
                name: "manager_options",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Exit"
                ]
            }
        ])
        .then(function (answer) {
            let choice = answer.manager_options
            if (choice === "View Products for Sale") {
                viewProductsForSale();
            } else if (choice === "View Low Inventory") {
                viewLowInventory();
            } else if (choice === "Add to Inventory") {
                addToInventory();
            } else if (choice === "Add New Product") {
                addNewProduct();
            } else if (choice === 'Exit') {
                connection.end();
            }
        });
}

function viewProductsForSale() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) {
            console.log('Item list not found');
            throw err;
        } else {
            console.log('\n');
            console.log('Available Products For Sale:');
            console.log('\n');

            for (let i = 0; i < res.length; i++) {
                console.log('Item ID: ' + res[i].item_id);
                console.log('Product: ' + res[i].product_name);
                console.log('Price: $' + res[i].price);
                console.log('\n');
            }
        }
    });
    connection.end();
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) {
            console.log('Item list not found');
            throw err
        } else {
            console.log('\n');
            console.log('Products with Low Inventory:');
            console.log('\n');

            for (let i = 0; i < res.length; i++) {
                console.log('Item ID: ' + res[i].item_id);
                console.log('Product: ' + res[i].product_name);
                console.log('Price: $' + res[i].price);
                console.log('\n');
            }
        }
    });
    connection.end();
}

function addToInventory() {

}

function addNewProduct() {

}