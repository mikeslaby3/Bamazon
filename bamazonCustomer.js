let mysql = require('mysql');
let inquirer = require('inquirer');

let connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
      if (err) throw err;
      
      for (let i = 0; i < res.length; i++) {
          console.log('Item ID: ' + res[i].item_id);
          console.log('Product: ' + res[i].product_name);
          console.log('Price: $' + res[i].price);
          console.log('\n');
      }

    //   connection.end();
    });
}

