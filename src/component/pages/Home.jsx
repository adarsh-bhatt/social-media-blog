import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../index";
import appwriteService from "../../conf/APPWRITE/config";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getPosts();

        if (response?.rows) {
          setPosts(response.rows);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError(true);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 🔹 LOADING STATE
  if (loading) {
    return (
      <div className="w-full py-8 text-center">
        <Container>
          <p className="text-lg font-semibold">Loading posts...</p>
        </Container>
      </div>
    );
  }

  // 🔹 ERROR / UNAUTHORIZED STATE
  if (error) {
    return (
      <div className="w-full py-8 text-center">
        <Container>
          <h1 className="text-2xl font-bold text-red-500">
            Login required to read posts
          </h1>
        </Container>
      </div>
    );
  }

  // 🔹 NO POSTS STATE
  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <h1 className="text-2xl font-bold hover:text-gray-500">
            No posts available
          </h1>
        </Container>
      </div>
    );
  }

  // 🔹 POSTS AVAILABLE
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
