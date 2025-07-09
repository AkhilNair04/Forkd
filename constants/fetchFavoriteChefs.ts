import { supabase } from "./supabase";

export async function fetchFavoriteChefs(userId: string) {
  // Step 1: Get the user's favorite chef IDs
  const { data: userData, error: userError } = await supabase
    .from("User_Details")
    .select("fav_chef")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    console.error("Error fetching user details:", userError?.message);
    return [];
  }

  const chefIds = userData.fav_chef ?? [];
  console.log(chefIds)

  if (chefIds.length === 0) return [];
  

  // Step 2: Fetch Chef details using those IDs
  const { data: chefs, error: chefsError } = await supabase
    .from("Chef")
    .select(
      "id, name, specialties, cuisine, rating_avg, reviews"
    )
    .in("id", chefIds);

  if (chefsError) {
    console.error("Error fetching favorite chefs:", chefsError.message);
    return [];
  }

  // Step 3: Add imageUrl like you did before
  const chefsWithImage = chefs.map((chef) => {
    const imagePath = `${chef.id}/portrait.jpg`;
    const { data: publicUrlData } = supabase.storage.from("chef").getPublicUrl(imagePath);
    const imageUrl = publicUrlData?.publicUrl ?? "";

    return {
      ...chef,
      rating: chef.rating_avg,
      imageUrl,
    };
  });

  return chefsWithImage;
}
