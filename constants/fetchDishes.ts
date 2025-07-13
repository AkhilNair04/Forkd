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
