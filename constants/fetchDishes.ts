// constants/fetchDishes.ts

import { supabase } from "@/lib/supabase";

export interface Dish {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  tags: string[];
  is_available: boolean;
  is_veg: boolean;
  cuisine: string;
  imageUrl: string;
  rating:string,
  reviews:string,
  allergies:string[]
}

export interface DishWithPrice extends Dish {
  chefs: Array<{
    name: string;
    rating: number;
    reviews: number;
    price: number;
    avatar: string;
  }>;
}

export async function fetchDishes(): Promise<Dish[]> {
  const { data, error } = await supabase
    .from("Dish")
    .select(
      "id, title, description, ingredients, tags, is_available, is_veg, cuisine,rating_avg,reviews,contains"
    );

  if (error || !data) {
    console.error("❌ Failed to fetch dishes:", error?.message);
    return [];
  }

  const dishesWithImages: Dish[] = data.map((dish) => {
    const imagePath = `${dish.id}/dish.jpg`;
    const { data: publicUrlData } = supabase.storage
      .from("dish")
      .getPublicUrl(imagePath);

    // ✅ convert tags string to array
    const parsedTags: string[] =
      typeof dish.tags === "string"
        ? dish.tags.split(",").map((tag) => tag.trim())
        : [];

    return {
      ...dish,
      rating:dish.rating_avg,
      reviews:dish.reviews,
      allergies:dish.contains,
      tags: parsedTags,
      imageUrl: publicUrlData?.publicUrl || "",
    };
  });

  return dishesWithImages;
}

export async function fetchDishesWithPrices(): Promise<DishWithPrice[]> {
  // First, get all dishes
  const { data: dishes, error: dishesError } = await supabase
    .from("Dish")
    .select(
      "id, title, description, ingredients, tags, is_available, is_veg, cuisine, rating_avg, reviews, contains"
    );

  if (dishesError || !dishes) {
    console.error("❌ Failed to fetch dishes:", dishesError?.message);
    return [];
  }

  // Get all dish-chef relationships with prices
  const { data: dishChefData, error: dishChefError } = await supabase
    .from("Dish_To_Chef")
    .select(`
      dish_id,
      dish_price,
      chef:chef_id (
        id,
        name,
        rating_avg,
        reviews
      )
    `);

  if (dishChefError) {
    console.error("❌ Failed to fetch dish-chef relationships:", dishChefError?.message);
    return [];
  }

  // Create a map of dish_id to chefs with prices
  const dishChefMap = new Map<string, Array<{
    name: string;
    rating: number;
    reviews: number;
    price: number;
    avatar: string;
  }>>();

  // Process dish-chef relationships
  for (const item of dishChefData) {
    const chef = Array.isArray(item.chef) ? item.chef[0] : item.chef;
    if (!chef) continue;

    // Get chef avatar
    const imagePath = `${chef.id}/portrait.jpg`;
    const { data: imageData } = supabase.storage.from("chef").getPublicUrl(imagePath);

    const chefData = {
      name: chef.name,
      rating: chef.rating_avg || 0,
      reviews: chef.reviews || 0,
      price: item.dish_price,
      avatar: imageData?.publicUrl || "",
    };

    if (!dishChefMap.has(item.dish_id)) {
      dishChefMap.set(item.dish_id, []);
    }
    dishChefMap.get(item.dish_id)!.push(chefData);
  }

  // Combine dishes with their chef data
  const dishesWithPrices: DishWithPrice[] = dishes.map((dish) => {
    const imagePath = `${dish.id}/dish.jpg`;
    const { data: publicUrlData } = supabase.storage
      .from("dish")
      .getPublicUrl(imagePath);

    // Convert tags string to array
    const parsedTags: string[] =
      typeof dish.tags === "string"
        ? dish.tags.split(",").map((tag) => tag.trim())
        : [];

    return {
      ...dish,
      rating: dish.rating_avg,
      reviews: dish.reviews,
      allergies: dish.contains,
      tags: parsedTags,
      imageUrl: publicUrlData?.publicUrl || "",
      chefs: dishChefMap.get(dish.id) || [],
    };
  });

  return dishesWithPrices;
}
