const express = require("express");
const app = express();
var bodyparser = require("body-parser");
var fs = require('fs');

app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({
  extended: true
}));

const products = require("./products.json", 'utf-8');


// Landing page route
app.get("/", (req, res) => {
  res.render("landing");
});

// About Page Route
app.get("/about-us", (req, res) => {
  res.render("about");
});

// Dashboard Route
app.get("/dashboard", (req, res) => {
  const sProducts = products.sort(sortByProperty("profitPercentage"));
  res.render("dashboard", {
    sProducts: sProducts
  });
});

// Login Route
app.get("/login", (req, res) => {
  res.render("login");
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Show products
app.get("/all-products", (req, res) => {
  res.render("all-products", {
    products: products
  });
});

// Add products
app.get("/add-products", (req, res) => {
  res.render("add-products");
});

// Product Added
app.post('/product-added', (req, res) => {
  const newProduct = req.body.product;

  fs.readFile('products.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      obj = JSON.parse(data); //now it an object
      obj.push(newProduct); //add some data
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile('products.json', json, 'utf8', function (err, productAdded) {
        if (err) {
          console.log(err)
        } else {
          res.redirect("/all-products")
        }
      }); // write it back 
    }
  });


  // var obj = {
  //   table: []
  // };
  // obj.table.push(newProduct);
  // var json = JSON.stringify(obj);
  // var fs = require('fs');
  // fs.writeFile('products.json', json, 'utf8', function (err, productAdded) {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     res.redirect("/all-products")
  //   }
  // });

  // -------------------------------------------------------------------------------------

  // products.create(newProduct, function (err, productAdded) {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     res.redirect("/all-products")
  //   }
  // })
})

//Update Products
app.get("/:id/edit-products", (req, res) => {
  res.render("update-products");
});



//Sorting Function
function sortByProperty(property) {
  return function (a, b) {
    if (a[property] < b[property])
      return 1;
    else if (a[property] > b[property])
      return -1;

    return 0;
  }
}

const port = process.env.PORT || 3000;

app.listen(port, process.env.IP, () =>
  console.log(`Server running on port ${port} 🔥`)
);