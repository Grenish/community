import { useUser } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Profile = () => {
  const { user } = useUser();
  return (
    <div>
      <img src={user?.imageUrl} alt="" />
    </div>
  );
};

export default Profile;
