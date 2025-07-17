import { supabase } from "./supabase";

export async function deleteDish(dishId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Remove dish image from storage
    const imagePath = `${dishId}/dish_img.jpg`;
    const { error: storageError } = await supabase.storage.from("dish").remove([imagePath]);
    if (storageError) {
      console.warn("Failed to remove image:", storageError.message);
    }

    // 2. Remove dish-to-chef mapping
    await supabase.from("Dish_To_Chef").delete().eq("dish_id", dishId);

    // 3. Remove dish from Dish table
    const { error: dishError } = await supabase.from("Dish").delete().eq("id", dishId);
    if (dishError) return { success: false, error: dishError.message };

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}