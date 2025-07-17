import { supabase } from "./supabase";
import * as FileSystem from "expo-file-system";

// Utility to generate next ID like D0001, CD0001
async function getNextId(
  table: string,
  prefix: string,
  idField: string = "id"
): Promise<string> {
  const { data, error } = await supabase
    .from(table)
    .select(idField)
    .order(idField, { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);

  const lastId =
    (data?.[0] as unknown as Record<string, string>)?.[idField] ||
    `${prefix}0000`;

  const nextNumber = parseInt(lastId.slice(prefix.length)) + 1;
  return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
}

export async function addDish(
  chefId: string,
  dishData: {
    title: string;
    cuisine: string;
    description: string;
    ingredients: string;
    contains: string;
    tags: string;
    price: number;
    imageUri: string;
  }
): Promise<{ success: boolean; dishId?: string; error?: string }> {
  try {
    // 1. Generate new dish ID
    const dishId = await getNextId("Dish", "D");

    

    // 2. First upload the image
    const uploadResult = await uploadDishImage(dishData.imageUri, dishId);
    
    if (uploadResult.error) {
      return { success: false, error: `Image upload failed: ${uploadResult.error}` };
    }

    // 3. Insert into Dish table
    const { error: insertError } = await supabase.from("Dish").insert([
      {
        id: dishId,
        title: dishData.title,
        cuisine: dishData.cuisine,
        description: dishData.description,
        ingredients: dishData.ingredients,
        contains: dishData.contains.split(",").map((item) => item.trim()),
        tags: dishData.tags,
        is_veg: true,
        is_available: true, // Store the public URL
      },
    ]);

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // 4. Get chef ID from UUID
    const { data: chefData, error: chefError } = await supabase
      .from("Chef")
      .select("id")
      .eq("uuid", chefId)
      .single();

    if (chefError || !chefData) {
      return { success: false, error: chefError?.message || "Chef not found" };
    }

    // 5. Create relation in Dish_To_Chef table
    const dishToChefId = await getNextId("Dish_To_Chef", "CD");

    const { error: mappingError } = await supabase.from("Dish_To_Chef").insert([
      {
        id: dishToChefId,
        chef_id: chefData.id,
        dish_id: dishId,
        dish_price: dishData.price,
      },
    ]);

    if (mappingError) {
      return { success: false, error: mappingError.message };
    }

    return { success: true, dishId };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}

async function uploadDishImage(
  imageUri: string,
  dishId: string
): Promise<{ publicUrl: string | null; error: string | null }> {
  try {
    const filePath = `${dishId}/dish_img.jpg`;

    // Read the image as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to binary
    const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("dish")
      .upload(filePath, buffer, {
        upsert: true,
        contentType: 'image/jpeg',
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const publicUrl = "hiii";

    return { publicUrl, error: null };
  } catch (error: any) {
    console.error('Image upload errorrrrrr:', error);
    return { publicUrl: null, error: error.message || 'Image upload failed' };
  }
}