var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "jackso74",
    database: "bamazonDB"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadID + "\n")
    viewProducts();
});

function promptManager(){
    inquirer.prompt([
        {
            type: "list",
            name: "menu_options",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function(answer){
        var res = answer.menu_options
        console.log(res)
        if (res === "View Products for Sale"){
            viewProducts();
        } else if (res === "View Low Inventory"){
            viewLowInventory();
        } else if (res === "Add to Inventory"){
            addInventory();
        } else if (res === "Add New Product"){
            addProduct();
        } else {
            connection.end();
        }
    })
};

function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        console.table(res);
        promptManager();
    })
};

function viewLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
        if(err) throw err;
        console.table(res)
        promptManager();
    })
};

function addInventory(){
    inquirer.prompt([
        {
            type: "input",
            name: "add_product",
            message: "Which product would you like to add (Input item ID)?"
        },
        {
            type: "input",
            name: "add_stock",
            message: "How many units of the product would you like to add?"
        }
    ]).then(function(answer){
        var newProduct = answer.add_product;
        var newStockAmount = parseInt(answer.add_stock);
        console.log(newProduct)
        console.log(newStockAmount)
        connection.query("SELECT stock_quantity FROM products WHERE item_id =?", newProduct, function(err, res){
            if (err) throw err;
            var oldStockQuantity = res[0].stock_quantity;
            var newStockQuantity = oldStockQuantity + newStockAmount;
            console.log(oldStockQuantity)
            console.log(newStockQuantity)
            connection.query("UPDATE products SET ? WHERE ?", 
            [
                {stock_quantity: newStockQuantity},
                {item_id: newProduct}
            ], function(err, res){
                if (err) throw err;
                console.table(res)
                viewProducts();
            })
        })
    })
};

function addProduct(){
    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Name of Product"
        },
        {
            type: "input",
            name: "department_name",
            message: "Department Name"
        },
        {
            type: "input",
            name: "price",
            message: "Cost to Customer"
        },
        {
            type: "input",
            name: "stock_quantity",
            message: "Amount of Stock Available"
        }
    ]).then(function(answer){
        var product = answer.product_name;
        var department = answer.department_name;
        var price = answer.price;
        var stock = answer.stock_quantity;
    
        connection.query("INSERT INTO products SET ?",
        {
            product_name: product,
            department_name: department,
            price: price,
            stock_quantity: stock
        }, function(err, res){
            if (err) throw err;
            console.table(res)
            viewProducts();
        });
    })
}