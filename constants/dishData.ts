// constants/dishData.ts

export const dishes = [
  {
    id: "1",
    name: "Crab Rangoon",
    cuisine: "American Cuisine",
    description:
      "Crab Rangoon is a popular appetizer consisting of crispy wontons filled with a savory mixture of cream cheese and crab meat.",
    ingredients:
      "Crab meat, cream cheese, garlic, green onions, soy sauce, Worcestershire sauce, wonton wrappers, oil",
    image: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg",
    tags: ["American", "Pescatarian", "Non-veg"],
    rating: 4.8,
    isFavorite: false,
    chefs: [
      {
        name: "Chef Anna P",
        rating: 4.8,
        reviews: 230,
        price: 499,
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        name: "Chef Chris T",
        rating: 4.5,
        reviews: 320,
        price: 399,
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      },
    ],
  },
  {
    id: "2",
    name: "Rigatoni Pasta",
    cuisine: "Italian Cuisine",
    description:
      "Classic Italian pasta dish with a rich tomato sauce and perfectly cooked rigatoni noodles.",
    ingredients: "Rigatoni, tomato sauce, olive oil, garlic, basil, parmesan",
    image: "https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg",
    tags: ["Italian", "Vegetarian"],
    rating: 4.7,
    isFavorite: true,
    chefs: [
      {
        name: "Chef Marco R",
        rating: 4.9,
        reviews: 190,
        price: 489,
        avatar: "https://randomuser.me/api/portraits/men/51.jpg",
      },
    ],
  },
  {
    id: "3",
    name: "Chicken Biriyani",
    cuisine: "Indian Cuisine",
    description:
      "Spiced and flavorful rice dish layered with marinated chicken and aromatic spices.",
    ingredients: "Chicken, basmati rice, saffron, yogurt, spices",
    image: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg",
    tags: ["Indian", "Non-veg"],
    rating: 4.3,
    isFavorite: false,
    chefs: [
      {
        name: "Chef Ravi K",
        rating: 4.6,
        reviews: 215,
        price: 359,
        avatar: "https://randomuser.me/api/portraits/men/66.jpg",
      },
    ],
  },
  {
    id: "4",
    name: "Tteokbokki",
    cuisine: "Korean Cuisine",
    description:
      "Korean dish made with chewy rice cakes simmered in a spicy, sweet sauce.",
    ingredients: "Rice cakes, gochujang, sugar, soy sauce, fish cakes",
    image: "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg",
    tags: ["Korean", "Spicy", "Vegetarian"],
    rating: 4.2,
    isFavorite: true,
    chefs: [
      {
        name: "Chef Soojin L",
        rating: 4.7,
        reviews: 180,
        price: 379,
        avatar: "https://randomuser.me/api/portraits/women/69.jpg",
      },
    ],
  },
  {
    id: "5",
    name: "Butter Chicken",
    cuisine: "Indian Cuisine",
    description:
      "Creamy tomato-based curry with tender chicken pieces, a North Indian favorite.",
    ingredients: "Chicken, butter, tomato, cream, garam masala",
    image: "https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg",
    tags: ["Indian", "Non-veg"],
    rating: 4.8,
    isFavorite: true,
    chefs: [
      {
        name: "Chef Albin S",
        rating: 4.6,
        reviews: 240,
        price: 399,
        avatar: "https://randomuser.me/api/portraits/men/58.jpg",
      },
    ],
  },
];
