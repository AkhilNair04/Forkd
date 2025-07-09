import { supabase } from "./supabase";

export async function fetchFavoriteDishes(userId: string) {
  // Step 1: Get the user's favorite dish IDs
  const { data: userData, error: userError } = await supabase
    .from("User_Details")
    .select("fav_dish")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    console.error("Error fetching user details:", userError?.message);
    return [];
  }

  const dishIds = userData.fav_dish ?? [];
  console.log(dishIds);

  if (dishIds.length === 0) return [];

  // Step 2: Fetch Dish details using those IDs
  const { data: dishes, error: dishesError } = await supabase
    .from("Dish")
    .select("id, title, cuisine,rating_avg,reviews")
    .in("id", dishIds);

  if (dishesError || !dishes) {
    console.error("Error fetching favorite dishes:", dishesError.message);
    return [];
  }

  // Step 3: Add imageUrl and parse tags
  const dishesWithImage = dishes.map((dish) => {
    const imagePath = `${dish.id}/dish.jpg`;
    const { data: publicUrlData } = supabase.storage
      .from("dish")
      .getPublicUrl(imagePath);
    const imageUrl = publicUrlData?.publicUrl ?? "";

    return {
      ...dish,
      rating: dish.rating_avg,
      imageUrl,
    };
  });

  return dishesWithImage;
}
