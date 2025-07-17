import { supabase } from "./supabase";

export async function fetchFavoriteChefs(userId: string) {
  // Step 1: Get the user's favorite chef IDs
  const { data: userData, error: userError } = await supabase
    .from("user_profiles")
    .select("fav_chef")
    .eq("user_id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user chef details:", userError?.message);
    return [];
  }

  // Defensive: handle null, empty, not array
  const chefIds =
    Array.isArray(userData?.fav_chef) && userData?.fav_chef.length > 0
      ? userData.fav_chef.filter(Boolean)
      : [];

  if (chefIds.length === 0) return [];

  // Step 2: Fetch Chef details using those IDs
  const { data: chefs, error: chefsError } = await supabase
    .from("Chef")
    .select("id, name, specialties, cuisine, rating_avg, reviews, price_per_hour")
    .in("id", chefIds);

  if (chefsError || !chefs) {
    console.error("Error fetching favorite chefs:", chefsError?.message);
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
      pricePerHour: chef.price_per_hour,
      imageUrl,
    };
  });

  return chefsWithImage;
}