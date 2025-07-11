import { supabase } from "@/lib/supabase";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ChefRestrictionContextType {
  isRestricted: boolean;
  isLoading: boolean;
  restrictionReason: string;
  refreshRestrictionStatus: () => Promise<void>;
}

const ChefRestrictionContext = createContext<
  ChefRestrictionContextType | undefined
>(undefined);

export const useChefRestriction = () => {
  const context = useContext(ChefRestrictionContext);
  if (!context) {
    throw new Error(
      "useChefRestriction must be used within a ChefRestrictionProvider"
    );
  }
  return context;
};

interface ChefRestrictionProviderProps {
  children: ReactNode;
}

export const ChefRestrictionProvider: React.FC<
  ChefRestrictionProviderProps
> = ({ children }) => {
  const [isRestricted, setIsRestricted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [restrictionReason, setRestrictionReason] = useState("");

  const checkRestrictionStatus = async () => {
    try {
      setIsLoading(true);
      console.log("🔍 Checking chef restriction status...");

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("❌ No authenticated user found");
        setIsLoading(false);
        return;
      }

      console.log("👤 User found:", user.id);

      // Check if user is a chef
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("user_type")
        .eq("user_id", user.id)
        .single();

      if (profileError || profileData?.user_type !== "chef") {
        console.log("❌ User is not a chef or profile not found");
        setIsLoading(false);
        return; // Not a chef, no restriction needed
      }

      console.log("👨‍🍳 User is a chef, checking restriction status...");

      // Get chef restriction status
      const { data: chefData, error: chefError } = await supabase
        .from("Chef")
        .select("is_restricted, fssai_license_img, pcc_certificate")
        .eq("id", user.id)
        .single();

      if (chefError) {
        console.error("❌ Error fetching chef data:", chefError);
        setIsLoading(false);
        return;
      }

      const restricted = chefData?.is_restricted || false;
      setIsRestricted(restricted);

      console.log("🔒 Restriction status:", restricted);

      // Set restriction reason
      if (restricted) {
        const missingDocs = [];
        if (!chefData?.fssai_license_img) missingDocs.push("FSSAI License");
        if (!chefData?.pcc_certificate) missingDocs.push("PCC Certificate");

        const reason = `Account restricted due to missing required documents: ${missingDocs.join(
          ", "
        )}`;
        setRestrictionReason(reason);
        console.log("📋 Restriction reason:", reason);
      } else {
        setRestrictionReason("");
        console.log("✅ Chef account is not restricted");
      }
    } catch (error) {
      console.error("❌ Error checking restriction status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRestrictionStatus = async () => {
    console.log("🔄 Refreshing restriction status...");
    await checkRestrictionStatus();
  };

  useEffect(() => {
    checkRestrictionStatus();
  }, []);

  const value: ChefRestrictionContextType = {
    isRestricted,
    isLoading,
    restrictionReason,
    refreshRestrictionStatus,
  };

  return (
    <ChefRestrictionContext.Provider value={value}>
      {children}
    </ChefRestrictionContext.Provider>
  );
};
