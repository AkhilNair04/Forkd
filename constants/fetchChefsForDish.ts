// constants/fetchChefsForDish.ts
import { supabase } from "./supabase";

export interface ChefForDish {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  price: number;
}

export async function fetchChefsForDish(dishId: string): Promise<ChefForDish[]> {
  const { data, error } = await supabase
    .from("Dish_To_Chef")
    .select(`
      dish_price,
      chef:chef_id (
        id,
        name,
        rating_avg,
        reviews
      )
    `)
    .eq("dish_id", dishId);

  if (error || !data) {
    console.error("❌ Failed to fetch chefs for dish:", error?.message);
    return [];
  }

  const chefsWithImages: (ChefForDish | null)[] = await Promise.all(
    data.map(async (item) => {
      const chef = Array.isArray(item.chef) ? item.chef[0] : item.chef;

      if (!chef) return null;

      const imagePath = `${chef.id}/portrait.jpg`;
      const { data: imageData } = supabase.storage.from("chef").getPublicUrl(imagePath);

      return {
        id: chef.id,
        name: chef.name,
        avatar: imageData?.publicUrl || "",
        rating: chef.rating_avg || 0,
        reviews: chef.reviews || 0,
        price: item.dish_price,
      };
    })
  );

  return chefsWithImages.filter(Boolean) as ChefForDish[];
}
