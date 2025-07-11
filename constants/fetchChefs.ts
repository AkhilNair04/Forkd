import { supabase } from "@/lib/supabase";

export interface Chef {
  service_type: string[];
  experience_level: string;
  id: string;
  name: string;
  specialties: string[];
  cuisine: string;
  rating: number;
  reviews: number;
  pricePerHour: number;
  verified: boolean;
  available_times: {
    label: string;
    available: boolean;
  }[];
  imageUrl: string;
}

export async function fetchChefs(): Promise<Chef[]> {
  const { data, error } = await supabase
    .from("Chef")
    .select(
      "id, name, specialties, cuisine, rating_avg, reviews, price_per_hour, is_verified, available_times,experience_level,service_type"
    );

  if (error || !data) {
    console.error("❌ Failed to fetch chefs:", error?.message);
    return [];
  }

  const chefsWithImage: Chef[] = data.map((chef) => {
    const imagePath = `${chef.id}/portrait.jpg`;
    const { data: publicUrlData } = supabase.storage.from("chef").getPublicUrl(imagePath);
    const imageUrl = publicUrlData?.publicUrl || "";
   
    return {
      id: chef.id,
      name: chef.name,
      specialties: chef.specialties,
      experience_level:chef.experience_level,
      service_type:chef.service_type,
      cuisine: chef.cuisine,
      rating: chef.rating_avg,
      reviews: chef.reviews,
      pricePerHour: chef.price_per_hour,
      verified: chef.is_verified,
      available_times:chef.available_times,
      imageUrl,
    };
  });

  return chefsWithImage;
}
