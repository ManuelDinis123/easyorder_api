# API for EasyOrder

1. Get Restaurants (http://localhost:3000/)

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

  You can filter the data with the following:
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
  - id: id of the restaurant;
  - restaurant_name: name of the restaurant. Uses wildcard search, for example if you send 'res' it would get all results with that substring for example: 'restaurant';
  - logo_from_url: If the logo is from an url from the web;
  - logo_from_file: If the logo is from a local file;


