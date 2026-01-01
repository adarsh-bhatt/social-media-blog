import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../conf/APPWRITE/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    try {
      let featuredImageId = post?.featuredImage || null;

      // 🔹 Upload image if selected
      if (data.image && data.image[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);

        if (!file) {
          alert("Image upload failed. Please try again.");
          return;
        }

        featuredImageId = file.$id;

        // 🔹 Delete old image on update
        if (post?.featuredImage) {
          await appwriteService.deleteFile(post.featuredImage);
        }
      }

      // 🔹 UPDATE POST
      if (post) {
        const dbPost = await appwriteService.updatePost(post.$id, {
          title: data.title,
          content: data.content,
          featuredImage: featuredImageId,
          status: data.status,
        });

        if (dbPost) navigate(`/post/${dbPost.$id}`);
      }

      // 🔹 CREATE POST
      else {
        const dbPost = await appwriteService.createPost({
          title: data.title,
          content: data.content,
          featuredImage: featuredImageId,
          status: data.status,
          authorId: userData.$id, // ✅ REQUIRED (DB FIELD)
        });

        if (dbPost) navigate(`/post/${dbPost.$id}`);
      }
    } catch (error) {
      console.log("PostForm submit error", error);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]/g, "")
        .replace(/\s+/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, slugTransform]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      {/* LEFT */}
      <div className="w-2/3 px-2">
        <Input
          label="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />

        <Input
          label="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />

        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      {/* RIGHT */}
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image"
          type="file"
          className="mb-4"
          accept="image/*"
          {...register("image", { required: !post })}
        />

        {/* 🔹 IMAGE PREVIEW */}
        {post?.featuredImage && (
          <img
            src={appwriteService.getFileView(post.featuredImage)}
            alt={post.title}
            className="rounded-lg mb-4"
          />
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button type="submit" className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
