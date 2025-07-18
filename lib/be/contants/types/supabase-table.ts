import { Database } from "@/types/supabase";

// supabase table types
export type Users = Database["public"]["Tables"]["users"]["Row"];
export type Updates = Database["public"]["Tables"]["updates"]["Row"];
export type ClickLogs = Database["public"]["Tables"]["click_logs"]["Row"];
