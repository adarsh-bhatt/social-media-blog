import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../index";
import appwriteService from "../../conf/APPWRITE/config";

function AllPost() {
  const [posts, setPosts] = useState([]); // ✅ always array

  useEffect(() => {
    appwriteService.getPosts().then((response) => {
      if (response && response.rows) {
        setPosts(response.rows); // ✅ rows, not documents
      }
    });
  }, []); // ✅ run once

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              {/* ✅ spread props correctly */}
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPost;
