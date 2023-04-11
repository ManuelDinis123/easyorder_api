const express = require("express");
const app = express();
var db = require("../database.js");

// Get all public restaurants and menu items
app.get("/", async function (req, res) {
  let final = [];
  db.query(
    "SELECT a.id AS restaurant_id, a.name AS restaurant_name,\
    CONCAT(\
        '[',\
        GROUP_CONCAT(\
            CONCAT(\
                '{\"name\":\"', c.name, '\",\"price\":', c.price, ',\"cost\":', c.cost, ',\"imageUrl\":\"', c.imageUrl, '\",\"side_items\": [',\
                IFNULL(\
                    (\
                        SELECT GROUP_CONCAT(CONCAT('{\"name\":\"', d.ingredient, '\",\"price\":', d.price, '}') SEPARATOR ',')\
                        FROM menu_item_ingredients d\
                        WHERE d.menu_item_id = c.id\
                    ),\
                    ''\
                ),\
                ']}'\
            )\
            SEPARATOR ','\
        ),\
        ']'\
    ) AS items \
FROM restaurants a \
INNER JOIN menu b ON a.id = b.restaurant_id \
INNER JOIN menu_item c ON c.menu_id = b.id \
WHERE a.isPublic = 1 \
GROUP BY a.id, b.id",
    function (err, rows) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send("Ocorreu um erro a ir buscar os restaurantes");
      }

      // rows.forEach((values) => {
      //   rows["items"] = JSON.parse(values.items);
      // });

      var aux = rows[0]["items"]

      res.send(aux);
    }
  );
});

module.exports = app;
