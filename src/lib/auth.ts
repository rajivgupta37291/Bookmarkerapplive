import { supabase } from "../lib/superbaseClient";

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};
