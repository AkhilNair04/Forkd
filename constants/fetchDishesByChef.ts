import { supabase } from "./supabase";

export async function fetchDishesByChef(chefId: string) {
  const { data, error } = await supabase
    .from("Dish_To_Chef")
    .select("dish_price, dish_id, Dish(*)")
    .eq("chef_id", chefId);

  if (error) {
    console.error("Error fetching dishes for chef:", error.message);
    return [];
  }
  console.log(data);

  return data.map((entry) => {
    const dish = Array.isArray(entry.Dish) ? entry.Dish[0] : entry.Dish;
    const imagePath = `${dish?.id}/dish.jpg`;

    const { data: imageUrlData } = supabase.storage
      .from("dish")
      .getPublicUrl(imagePath);

    return {
      ...dish,
      id: entry.dish_id,
      price: entry.dish_price,
      imageUrl: imageUrlData?.publicUrl ?? "",
    };
  });
}
