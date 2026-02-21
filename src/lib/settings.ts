import { createClient } from "@/lib/supabase/server";

export async function getSettings(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value");
  const settings: Record<string, string> = {};
  data?.forEach((row) => {
    settings[row.key] = row.value || "";
  });
  return settings;
}
