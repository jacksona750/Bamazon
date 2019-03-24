var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazonDB"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    initialPrompt();
  });

  function initialPrompt (){
    inquirer.prompt ([
      {
        type: "confirm",
        name: "what_to_do",
        message: "Would you like to buy something?"
      }
    ]).then(function(answer){
      if (answer = true){
        displayProducts();
      } else {
        connection.end();
      }
    })
  }

  function promptBuyer (){
      inquirer.prompt([
          {
              type: "input",
              name: "item_id",
              message: "Which item would you like to buy? (Input item ID)"  
          },
          {
              type: "input",
              name: "item_units",
              message: "How many units of the item would you like to buy?"
          },
      ]).then(function(answer){
          var itemId = answer.item_id;
          var itemUnits = answer.item_units;
          console.log(itemId)
          console.log(itemUnits)  
          console.log("Updating product inventory...\n");
          connection.query("SELECT stock_quantity, price FROM products WHERE item_id =?", itemId, function(err, res){
              if (err) throw err;
              var oldStockQuantity = res[0].stock_quantity;
              var newStockQuantity = oldStockQuantity - itemUnits;
              var price = res[0].price;
              var totalPrice = price * itemUnits;
              console.log(oldStockQuantity)
              console.log(newStockQuantity)
              if (newStockQuantity < 0){
                  console.log("Insufficient Quantity! There are only " + oldStockQuantity + " units of that item available.")
                  promptBuyer(); 
              } else{
              connection.query("UPDATE products SET ? WHERE ?",
                [
                  {stock_quantity: newStockQuantity}, 
                  {item_id: itemId}
                ], 
                function(err, res){
                    if(itemUnits <= 1){
                    console.log("The total price of your " + itemUnits + " item is: $" + totalPrice)
                    } else{
                      console.log("The total price of your " + itemUnits + " items is: $" + totalPrice)
                    }
                })
                displayProducts();
               }
          })
        })
    }

  function displayProducts(){
      connection.query("SELECT * FROM products", function(err, res){
          if(err) throw err;
          console.table(res);
          promptBuyer();
      })
  };

