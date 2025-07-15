import { supabase } from "@/constants/supabase";

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

  // ✅ Cast the data to a generic record so TypeScript knows it has string keys
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
  }
): Promise<{ success: boolean; dishId: string } | {
  success: boolean; error: any 
}> {
  try {
    // 1. Generate new dish ID
    const dishId = await getNextId("Dish", "D");

    // 2. Insert into Dish table
    const { error: insertError } = await supabase.from("Dish").insert([
      {
        id: dishId,
        title: dishData.title,
        cuisine: dishData.cuisine,
        description: dishData.description,
        ingredients: dishData.ingredients,
        contains: dishData.contains.split(",").map((item) => item.trim()), // ensure it's a text[] array
        tags: dishData.tags,
        is_veg: true,
        is_available: true,
      },
    ]);

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // 3. Create relation in Dish_To_Chef table
    const dishToChefId = await getNextId("Dish_To_Chef", "CD");
    

    const { data: chefData, error: chefError } = await supabase
    .from("Chef")
    .select("id")
    .eq("uuid", chefId)
    .maybeSingle();

    console.log("Fetched Chef Data:", chefData?.id);
console.log("Generated Dish_To_Chef ID:", dishToChefId);
    console.log("Chef ID:", chefData?.id);
    console.log("Dish ID:", dishId);
    console.log("Price:", dishData.price);
    
    const { error: mappingError } = await supabase.from("Dish_To_Chef").insert([
      {
        id: dishToChefId,
        chef_id: chefData?.id,
        dish_id: dishId,
        dish_price: dishData.price,
      },
    ]);

    if (mappingError) {
      return { success: false, error: mappingError.message };
    }

    return { success: true, dishId };
  } catch (err: any) {
    return { success: false, error: err.message || err };
  }
}
