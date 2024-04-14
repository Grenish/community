import { useEffect, useState } from "react";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Post {
  id: string;
  username: string;
  created_at: string;
  content: string;
}

const Posts = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    document.title = "Posts";
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) console.log("Error fetching the post", error);
    else {
      setPosts(data);
    }
  };

  return (
    <div className="p-2 flex justify-between">
      <div className=" flex flex-col">
        {/* all posts */}
        {posts.map((post: Post) => (
          <div
            key={post.id}
            className=" w-[450px] bg-rose-400 rounded-xl p-2 mb-2"
          >
            <div className="flex flex-col">
              <div className="text-sm flex items-center">
                <img
                  src={user?.imageUrl}
                  alt=""
                  className="w-7 h-7  rounded-full"
                />
                <span className="ml-1">{post.username}</span>
              </div>
              <span className="text-xs">{post.created_at}</span>
            </div>
            <div className="mt-2 text-sm">{post.content}</div>
          </div>
        ))}
      </div>
      <div className="">
        <PostWrite onNewPost={fetchPosts} />
      </div>
    </div>
  );
};

export default Posts;

interface PostWriteProps {
  onNewPost: () => void;
}

const PostWrite: React.FC<PostWriteProps> = ({ onNewPost }) => {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    setLoading(true); // Start loading
    if (user && content) {
      const { error } = await supabase
        .from("posts")
        .insert([{ username: user.username, content: content }]);
      if (error) console.error("Error posting:", error);
      else {
        setContent("");
        onNewPost();
      }
    } else {
      console.error("User or content is not available");
    }
    setLoading(false); // End loading
  };

  return (
    <div className="">
      <div className="w-[450px] bg-rose-400 rounded-xl p-2">
        <div className="flex flex-col">
          <div className="text-sm flex items-center">
            <img
              src={user?.imageUrl}
              alt=""
              className="w-5 h-5 bg-green-400 rounded-full"
            />
            <span className="ml-1">{user?.username}</span>
          </div>
          <span className="text-xs">s ago</span>
        </div>
        <div className="mt-2 text-sm">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            className="w-full h-20 p-2 rounded-lg bg-rose-300 outline-none"
          ></textarea>
          <div className="flex justify-end">
            <button
              onClick={handlePost}
              className="bg-green-400 px-2 py-1 rounded-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-t-2 border-indigo-500 rounded-full animate-spin">
                  <div className="w-full h-full rounded-full border-t-4 border-rose-500 animate-spin"></div>
                </div>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </div>
      <SignOutButton />
    </div>
  );
};
