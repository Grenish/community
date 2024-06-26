import { useEffect, useState, useRef } from "react";
import { useUser, SignOutButton, SignedIn } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Post {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  created_at: string;
  content: string;
  userImageUrl: string;
}

const Posts = () => {
  // const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState<number | null>(null);
  const { user } = useUser();

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

  const deletePosts = async (post: Post) => {
    if (user?.username !== post.username) {
      alert("Cannot delete others post.");
      return;
    }

    const { error } = await supabase
      .from("posts")
      .delete()
      .match({ id: post.id });
    if (error) console.error("Error deleting the post", error);
    else {
      fetchPosts();
    }
  };

  return (
    <div className="p-2 flex justify-between">
      <div className=" flex flex-col">
        {/* all posts */}
        {posts
          .sort(
            (a: Post, b: Post) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((post: Post) => (
            <div
              key={post.id}
              className=" w-[450px] bg-rose-400 rounded-xl p-2 mb-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm flex items-center">
                    <img
                      src={post.userImageUrl}
                      alt={post.firstName}
                      className="w-7 h-7  rounded-full"
                    />
                    <div className="flex flex-col items-start ml-1">
                      <span className="text-sm">{post.firstName}</span>
                      <Link to={`/profile/${post.username}`}>
                        <span className="text-xs text-gray-700">
                          @{post.username}
                        </span>
                      </Link>
                    </div>
                  </div>
                  <span className="text-xs">{post.created_at}</span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsMenuOpen(isMenuOpen === post.id ? null : post.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                      />
                    </svg>
                  </button>
                  {isMenuOpen === post.id && (
                    <div className="absolute right-0 z-[99]">
                      <Menu
                        onDelete={() => deletePosts(post)}
                        setIsMenuOpen={setIsMenuOpen}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm whitespace-pre-wrap flex flex-col">
                <span>{post.content}</span>
              </div>
              <div className=""></div>
            </div>
          ))}
      </div>
      <SignedIn>
        <div className="">
          <PostWrite onNewPost={fetchPosts} />
          <button>
            <Link to={`/profile/${user?.id}`} className="flex items-center">
              <img
                src={user?.imageUrl}
                alt={user?.username || "User Avatar"}
                className="w-5 h-5 rounded-full mr-1"
              />{" "}
              {user?.username}'s Profile
            </Link>
          </button>
        </div>
      </SignedIn>
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
      const { error } = await supabase.from("posts").insert([
        {
          username: user?.username,
          content: content,
          userImageUrl: user?.imageUrl,
          firstName: user?.firstName,
          lastName: user?.lastName,
        },
      ]); // Add userImageUrl here
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
              className="w-7 h-7 bg-green-400 rounded-full"
            />
            <div className="flex flex-col items-start ml-1">
              <span className="text-sm">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-gray-700">@{user?.username}</span>
            </div>
          </div>
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

interface MenuProps {
  onDelete: () => void;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<number | null>>;
}

const Menu: React.FC<MenuProps> = ({ onDelete, setIsMenuOpen }) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-secondary w-28 p-1 rounded-xl">
      <ul className="text-xs">
        <li
          onClick={() => {
            setIsMenuOpen(null);
          }}
          className="hover:bg-gray-400 px-2 py-1 rounded-lg mt-1 transition-colors duration-200 ease-in-out cursor-pointer"
        >
          Share
        </li>
        <SignedIn>
          <li
            onClick={() => {
              onDelete();
              setIsMenuOpen(null);
            }}
            className="hover:bg-red-400 px-2 py-1 rounded-lg mt-1 transition-colors duration-200 ease-in-out cursor-pointer"
          >
            Delete
          </li>
        </SignedIn>
      </ul>
    </div>
  );
};
