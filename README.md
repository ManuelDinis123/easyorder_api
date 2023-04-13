# API for EasyOrder

## 1. Get Restaurants (http://localhost:3000/)

- Get all restaurants and their menu items.

  > Returns an Object.

  ```
  [
      {
          "restaurant_id": 1,
          "restaurant_name": "Restaurante1",
          "logo_url": null,
          "logo_name": "1675550064.png",
          "items": [
              {
                  "name":"Burguer",
                  "price": 10,
                  "cost": 5,
                  "imageUrl": "https://imagemdecomidayum.png",
                  "side_items": [
                      {
                          "name": "fries",
                          "price": 2,
                      },
                      {
                          "name": "salad",
                          "price": 3
                      }
                  ]
              }
          ]
      }
  ]
  ```

  > Filters

  You can filter the data by sending the following in the body of the request:

  ```
    {
        "filters": {
            "id": 1,
            "restaurant_name": "nome_restaurante",
            "logo_from_url": false,
            "logo_from_file": true
        }
    }
  ```

  - ***id***: id of the restaurant;
  - ***restaurant_name***: name of the restaurant. Uses wildcard search, for example if you send 'res' it would get all results with that substring for example: 'restaurant';
  - ***logo_from_url***: If the logo is from an url from the web;
  - ***logo_from_file***: If the logo is from a local file;

## 2. Get Reviews (http://localhost:3000/reviews)

- Gets all restaurants and their reviews.

  > Returns an Object.

  ```
  [
      {
          "restaurant_id": 1,
          "restaurant_name": "Restaurante1",
          "logo_url": null,
          "logo_name": "1675550064.png",
          "star_avg": 4
          "reviews": [
              {
                  "user":"John Doe",
                  "title": "Titulo da review",
                  "review": "Uma critica muito bem descritiva",
                  "stars": 5,
                  "written_at": "2023-04-13",
              }
          ]
      }
  ]
  ```

  > Filters

  You can filter the data by sending the following in the body of the request:

  ```
    {
        "filters": {
            "id": 1,
            "restaurant_name": "nome_restaurante",
            "logo_from_url": false,
            "logo_from_file": true,
            "star_avg": 4
        }
    }
  ```

  - ***id***: Id of the restaurant;
  - ***restaurant_name***: Name of the restaurant. Uses wildcard search, for example if you send 'res' it would get all results with that substring for example: 'restaurant';
  - ***logo_from_url***: If the logo is from an url from the web;
  - ***logo_from_file***: If the logo is from a local file;
  - ***star_avg***: Gets the restaurants by their star average;

## 3. Make an Order (http://localhost:3000/order)

- Creates an Order for a client.

  > Params: user, deadline, items
  > Returns: String with the status

  To place an order you need to send the following in the body of the request:

  ```
  {
        "user": 1,
        "deadline": "2023-04-12 15:00:00",
        "items": {
            "1": {"6":{"quantity": 2, "sides": {"35":2, "36":1}}, "8":{"quantity": 4, "sides": {"37":1}}},
            "20": {"68":{"quantity": 4, "sides": {"61":1, "62":3}}, "69":{"quantity": 2}}
        }
    }
  ```

  - ***user***: ID of the user doing the order;
  - ***deadline***: When the user wants their order done;
  - ***items***: An object with the items.
    ```
      {
          "1 (this is the id of the restaurant)": {
              "6 (this is the id of the menu item)": {
                "quantity": 2,
                "sides": {
                    "35 (id of the side item): 2 (quantity of the side item)"
                }
              }
          }
      }
      ```
