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
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log('\n');
        console.log('Available Products:');
        console.log('\n');

        for (let i = 0; i < res.length; i++) {
            console.log('Item ID: ' + res[i].item_id);
            console.log('Product: ' + res[i].product_name);
            console.log('Price: $' + res[i].price);
            console.log('\n');
        }

        getItem();
        //   connection.end();
    });
}

function getItem() {
    inquirer
    .prompt([
        {
          name: "item_id",
          type: "input",
          message: "What's the item ID of the product you'd like to purchase?"
        }
    ])
    .then(function(answer) {
        connection.query(
            'SELECT * FROM products WHERE item_id =' + answer.item_id, 
        function (err, res){
            if (err) {
                console.log('Item selection failed');
                throw err;
            } else {
                if (res.length === 0) {
                    console.log('Item not found');
                    getItem();
                } else {
                    purchaseItem();
                }
            }
        }
        )
    });
}

function purchaseItem() {
    inquirer
    .prompt([
        {
          name: "item_id",
          type: "input",
          message: "What's the item ID of the product you'd like to purchase?"
        },
        {
          name: 'stock_quantity',
          type: 'input',
          message: 'How many units of product would you like to buy?'
        }
    ])
    .then(function(answer) {
        connection.query(
            'SELECT * FROM products WHERE item_id =' + answer.item_id, 
        function (err, res){
            if (err) {
                console.log('Item selection failed');
                throw err;
            } else {
                console.log(res.length);
                if (res.length === 0) {
                    console.log('Item not found');
                } else {
                    if (res[0].stock_quantity >= answer.stock_quantity) {
                        let updatedQuantity = res[0].stock_quantity - answer.stock_quantity;
                        connection.query(
                          'UPDATE products SET ? WHERE ?', 
                          [
                            {stock_quantity: updatedQuantity},
                            {item_id: answer.item_id}
                          ],
                          function(err) {
                            if (err) {
                                console.log('Product update failed');
                                throw err;
                            } else {
                                console.log(answer.stock_quantity + ' item(s) purchased')
                            }
                          }
                        );
                    } else {
                        console.log('Error: Requested ' + answer.stock_quantity + ' and available = ' + res[0].stock_quantity);
                    }
                }
            }
            afterConnection();
        }
        )
    });
}

