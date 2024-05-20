export const articles = Object.fromEntries(
  [
    {
      id: "01",
      name: "Peanutbutter",
      category: "staple",
      price: 1.98,
      ingredients: ["peanuts", "water", "salt"]
    },
    {
      id: "02",
      name: "Cracked Wheat",
      category: "staple",
      price: 1.29,
      ingredients: ["wheat"]
    },
    {
      id: "03",
      name: "Milk",
      category: "staple",
      price: 1.05,
      ingredients: ["milk"]
    },
    {
      id: 10,
      name: "Pizza Quattro Stagioni",
      price: 8.0,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano"]
    },
    {
      id: 11,
      name: "Pizza Salami",
      price: 7.0,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano"]
    },
    {
      id: 12,
      name: "Pizza Hawaii",
      price: 7.0,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano"]
    },
    {
      id: 13,
      name: "Pizza Margherita",
      price: 17.0,
      category: "pizza",
      ingredients: [
        "tomato sauce",
        "house-made mozzarella",
        "basil",
        "oregano",
        "chili flake"
      ]
    },
    {
      id: 14,
      name: "Pizza Funghi",
      price: 7.0,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano"]
    },
    {
      id: 15,
      name: "Pizza Calzone",
      price: 7.0,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano", "eggs"]
    },
    {
      id: 16,
      name: "Pizza Tonno",
      price: 7.0,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano"]
    },
    {
      id: 17,
      name: "Pizza Frutti di Mare",
      price: 7.0,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano", "scampi"]
    },
    {
      id: 18,
      name: "Pizza Prosciutto",
      price: 7.0,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano"]
    },
    {
      id: 19,
      name: "Pizza Peperoni",
      price: 7.0,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano", "peperoni"]
    },
    {
      id: 20,
      name: "Pizza Chef",
      price: 7.5,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano"]
    },
    {
      id: 21,
      name: "Pizza Speciale",
      price: 8.5,
      category: "pizza",
      ingredients: ["tomato sauce", "basil", "oregano"]
    },
    {
      id: 23,
      name: "Hot Dog",
      price: 2.0,
      category: "to go",
      ingredients: ["pork"]
    },
    {
      id: 32,
      name: "Cheesecake",
      price: 2.0,
      category: "dessert",
      ingredients: ["wheet", "milk", "eggs"]
    },
    {
      id: 33,
      name: "Panna Cotta",
      price: 2.0,
      category: "dessert",
      ingredients: ["wheet", "milk", "eggs"]
    }
  ].map(a => [a.id, a])
);

export const categories = Object.values(articles).reduce((all, c) => {
  if (!all[c.category]) {
    all[c.category] = { cid: c.category, name: c.category, articles: [] };
  }
  all[c.category].articles.push(c);
  c.category = all[c.category];
  if (c.ingredients === undefined) {
    c.ingredients = [];
  }
  return all;
}, {});
