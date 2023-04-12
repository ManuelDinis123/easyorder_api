const express = require("express");
const app = express();
var db = require("../database.js");

// Get all public restaurants and menu items
app.get("/", async function (req, res) {
  const sql_where = restaurantFilters(req.body.filters);
  db.query(
    "SELECT a.id AS restaurant_id, a.name AS restaurant_name, a.logo_url, a.logo_name,\
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
WHERE a.isPublic = 1 " +
      sql_where +
      " \
GROUP BY a.id, b.id",
    function (err, rows) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send("Ocorreu um erro a ir buscar os restaurantes");
      }
      var final = rows;
      count = 0;
      final.forEach((values) => {
        final[count]["items"] = JSON.parse(values.items);
        count++;
      });
      res.send(final);
    }
  );
});

// Get all restaurants and their reviews
app.get("/reviews", async function (req, res) {
  const sql_where = restaurantFilters(req.body.filters);
  db.query(
    `select a.id as restaurant_id, a.name as restaurant_name, a.logo_url, a.logo_name, round(sum(b.stars)/count(b.review)) as star_avg,
    concat(
    '[', group_concat(
      concat(
        '{"user": "', concat(c.first_name, ' ', c.last_name), '", "title": "',b.title ,'", "review": "',REPLACE(b.review, '\n', '\\\\n') ,'", "stars": "',b.stars ,'", "written_at": "',b.written_at,'"}'
        )
    ) ,']') as reviews  
    from restaurants a
    inner join reviews b on b.restaurant_id = a.id
    inner join users c on c.id = b.written_by
    WHERE a.isPublic = 1 ` +
      sql_where +
      `
    group by a.id`,
    function (err, rows) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send("Ocorreu um erro a ir buscar os restaurantes");
      }
      var final = rows;
      count = 0;
      final.forEach((values) => {
        final[count]["reviews"] = JSON.parse(values.reviews);
        count++;
      });
      res.send(final);
    }
  );
});

// Place an order
app.post("/order", async function (req, res) {
  const menu_items = req.body.items;
  var currentdate = new Date();
  var datetime =
    currentdate.getFullYear() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getDate() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  Object.keys(menu_items).forEach((item) => {
    db.query(
      `INSERT INTO orders(ordered_at, ordered_by, restaurant_id, progress, deadline)
              VALUES("` +
        datetime +
        `", "` +
        req.body.user +
        `", "` +
        item +
        `", 0, "` +
        req.body.deadline +
        `")`,
      (err2, result) => {
        if (err2) {
          return res.status(500).send("Erro a criar os pedidos");
        }
        const itemsids = menu_items[item];
        Object.keys(itemsids).forEach((i) => {
          db.query(
            `SELECT
             a.id, a.price, a.cost
             FROM menu_item a INNER JOIN menu b ON b.id = a.menu_id INNER JOIN restaurants c on c.id = b.restaurant_id WHERE a.id = ` +
              i,
            function (err, rows) {
              if (err) {
                return res
                  .status(500)
                  .send("Ocorreu um erro a inserir a info dos items do menu");
              }
              let menu_item_data = rows;
              db.query(
                `INSERT INTO order_items(order_id, menu_item_id, quantity, price, cost)
                 VALUES(` +
                  result.insertId +
                  `,` +
                  menu_item_data[0].id +
                  `, ` +
                  itemsids[i] +
                  `, ` +
                  menu_item_data[0].price +
                  `, ` +
                  menu_item_data[0].cost +
                  `)`,
                function (err3, result2) {
                  if (err3) {
                    console.log(err3);
                    return res
                      .status(500)
                      .send("Erro a associar os items ao pedido");
                  }
                  // TODO: Side-Items (Ask if adding removing sides is needed, if not add only the default ones)
                }
              );
            }
          );
        });
      }
    );
  });
  return res.send("Pedido efetuado com sucesso");
});

/**
 * Create a WHERE string to filter restaurants
 *
 * @param {Object} filters
 * @returns String
 */
function restaurantFilters(filters) {
  filterMap = ["id", "restaurant_name", "logo_from_url", "logo_from_file"];
  sqlMap = {
    id: "a.id",
    restaurant_name: "a.name",
    logo_from_url: "a.logo_url",
    logo_from_file: "a.logo_name",
  };
  let sql_where = "";
  filterMap.forEach((filter) => {
    if (filters[filter]) {
      sql_where += " AND ";
      sql_where +=
        sqlMap[filter] +
        (filter == "logo_from_url" || filter == "logo_from_file"
          ? " IS NOT NULL"
          : filter == "restaurant_name"
          ? " LIKE '%" + filters[filter] + "%'"
          : " = " + filters[filter]);
    }
  });
  return sql_where;
}

module.exports = app;
