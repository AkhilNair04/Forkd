import { supabase } from "./supabase";

export async function fetchDishesByChef(uuid: string | null | undefined) {
  if (!uuid) {
    console.warn("UUID is null or undefined. Cannot fetch chef dishes.");
    return [];
  }

  // Step 1: Get Chef ID using uuid
  const { data: chefData, error: chefError } = await supabase
    .from("Chef")
    .select("id")
    .eq("uuid", uuid)
    .maybeSingle();

  if (chefError || !chefData) {
    console.error(
      "Error fetching chef ID:",
      chefError?.message || "Chef not found"
    );
    return [];
  }

  const chefId = chefData.id;

  // Step 2: Get all dishes linked to that chef
  const { data: linkData, error: linkError } = await supabase
    .from("Dish_To_Chef")
    .select("dish_id, dish_price")
    .eq("chef_id", chefId);

  if (linkError) {
    console.error("Error fetching dishes for chef:", linkError.message);
    return [];
  }

  // Step 3: Get dish details in parallel using their IDs
  const dishesWithPrices = await Promise.all(
    linkData.map(async (entry) => {
      const { data: dishData, error: dishError } = await supabase
        .from("Dish")
        .select("*")
        .eq("id", entry.dish_id)
        .maybeSingle(); // each dish_id is unique

      if (dishError || !dishData) {
        console.warn(`Dish not found for ID: ${entry.dish_id}`);
        return null;
      }

      const imagePath = `${dishData.id}/dish_img.jpg`;
      const { data: imageUrlData } = supabase.storage
        .from("dish")
        .getPublicUrl(imagePath);

      return {
        ...dishData,
        price: entry.dish_price,
        imageUrl: imageUrlData?.publicUrl ?? "",
      };
    })
  );

  // Filter out any null (failed) fetches
  return dishesWithPrices.filter(Boolean);
}
