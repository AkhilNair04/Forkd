// constants/updateFavorites.ts
import { supabase } from "./supabase";

/**
 * Toggle a chef in the user's fav_chef array.
 */
export async function toggleFavoriteChef(
  userId: string,
  chefId: string,
  isCurrentlyFavorite: boolean
) {
  const { data: userData, error } = await supabase
    .from("User_Details")
    .select("fav_chef")
    .eq("id", userId)
    .single();

  if (error || !userData) {
    console.error("Failed to fetch fav_dish array:", error);
    return;
  }

  let updatedChefs = userData.fav_chef ?? [];

  if (isCurrentlyFavorite) {
    updatedChefs = updatedChefs.filter((id: string) => id !== chefId);

  } else {
    updatedChefs.push(chefId);
  }

  const { error: updateError } = await supabase
    .from("User_Details")
    .update({ fav_chef: updatedChefs })
    .eq("id", userId);

  if (updateError) {
    console.error("Failed to update fav_dish array:", updateError);
  }
}

/**
 * Toggle a dish in the user's fav_dish array.
 */
export async function toggleFavoriteDish(
  userId: string,
  dishId: string,
  isCurrentlyFavorite: boolean
) {
  const { data: userData, error } = await supabase
    .from("User_Details")
    .select("fav_dish")
    .eq("id", userId)
    .single();

  if (error || !userData) {
    console.error("Failed to fetch fav_dish array:", error);
    return;
  }

  let updatedDishes = userData.fav_dish ?? [];

  if (isCurrentlyFavorite) {
    updatedDishes = updatedDishes.filter((id: string) => id !== dishId);
  } else {
    updatedDishes.push(dishId);
  }

  const { error: updateError } = await supabase
    .from("User_Details")
    .update({ fav_dish: updatedDishes })
    .eq("id", userId);

  if (updateError) {
    console.error("Failed to update fav_dish array:", updateError);
  }
}
