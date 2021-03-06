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
            switch(choice) {
                case "View Products for Sale":
                    viewProductsForSale();
                    break;
                case "View Low Inventory":
                    viewLowInventory();
                    break;
                case "Add to Inventory":
                    addToInventory();
                    break;
                case "Add New Product":
                    addNewProduct();
                    break;
                case "Exit":
                    connection.end();
                    break;
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
                console.log('Department: ' + res[i].department_name);
                console.log('Price: $' + res[i].price);
                console.log('Quantity in Stock: ' + res[i].stock_quantity);
                console.log('\n');
            }
        }
    });
    connection.end();
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5 ORDER BY stock_quantity DESC", function (err, res) {
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
                if (res[i].stock_quantity <= 0) {
                    console.log('OUT OF STOCK')
                } else {
                    console.log('Quantity in Stock: ' + res[i].stock_quantity);
                }
                console.log('\n');
            }
        }
    });
    connection.end();
}

function addToInventory() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: 'product_name',
                    type: 'rawlist',
                    choices: function () {
                        let productArray = [];
                        for (let i = 0; i < res.length; i++) {
                            productArray.push(res[i].product_name);
                        }
                        return productArray;
                    },
                    message: 'Which product would you like increase the inventory of?'
                },
                {
                    name: 'stock_quantity',
                    type: 'input',
                    message: 'How many more items would you like to add to your inventory?'
                }
            ])
            .then(function (answer) {
                if (isNaN(answer.stock_quantity)) {
                    console.log('Not a valid number, try again');
                    addToInventory();
                } else {
                    let chosenItem;
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].product_name === answer.product_name) {
                            chosenItem = res[i];
                        }
                    }

                    let updatedQuantity = chosenItem.stock_quantity + parseInt(answer.stock_quantity);
                    console.log(updatedQuantity);

                    connection.query(
                        'UPDATE products SET ? WHERE ?',
                        [
                            { stock_quantity: updatedQuantity },
                            { product_name: answer.product_name }
                        ],
                        function (err) {
                            if (err) {
                                console.log('Inventory update failed');
                                throw err;
                            } else {
                                console.log(answer.stock_quantity + ' item(s) added to the ' + answer.product_name + ' inventory');
                                connection.end();
                            }
                        }
                    );
                }
            });
    });
}

function addNewProduct() {
    inquirer
        .prompt([
            {
                name: 'product_name',
                type: 'input',
                message: 'What\'s the name of the product you\'d like to add?'
            },
            {
                name: 'department_name',
                type: 'input',
                message: 'What department does this product belong to?'
            },
            {
                name: 'price',
                type: 'input',
                message: 'How much does this product cost?'
            },
            {
                name: 'stock_quantity',
                type: 'input',
                message: 'How many items are in stock?'
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity
                },
                function (err) {
                    if (err) {
                        console.log('Unsuccessful new item');
                        throw error;
                    } else {
                        console.log('Item successfully added to store!');
                        connection.end();
                    }
                }
            );
        });
}