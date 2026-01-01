import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../../conf/APPWRITE/config";
import { Button, Container } from "../index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((data) => {
        if (data) setPost(data);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const isAuthor = post && userData
    ? post.authorId === userData.$id
    : false;

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        if (post.featuredImage) {
          appwriteService.deleteFile(post.featuredImage);
        }
        navigate("/");
      }
    });
  };

  console.log("post.authorId:", post?.authorId);
  console.log("userData.$id:", userData?.$id);

  return post ? (
    <div className="py-8">
      <Container>
        {/* IMAGE */}
        {post.featuredImage && (
          <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
            <img
              src={appwriteService.getFileView(post.featuredImage)}
              alt={post.title}
              className="rounded-xl"
            />

            {/* EDIT / DELETE */}
            {isAuthor && (
              <div className="absolute right-6 top-6">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button bgColor="bg-green-500" className="mr-3">
                    Edit
                  </Button>
                </Link>
                <Button bgColor="bg-red-500" onClick={deletePost}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TITLE */}
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>

        {/* CONTENT */}
        <div className="browser-css">
          {parse(post.content)}
        </div>
      </Container>
    </div>
  ) : null;
}
