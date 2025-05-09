"use client";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import CloseButton from "../UI/CloseButton";
import Container from "../UI/container";
import { useCreatePost } from "@/context";
import { useUser } from "@clerk/nextjs";
import useCreatePostMutation from "@/hooks/post/use-create-post-mutation";
import Spinner from "../UI/spinner";
import toast from "react-hot-toast";

interface FormInput {
  post_content: string | null;
  post_image: File | null;
}

function CreatePostForm() {
  const { toggleShowCreatePostFrom } = useCreatePost();
  const { createPostMutation } = useCreatePostMutation();
  const { user } = useUser();
  const { register, handleSubmit, setValue, reset, watch } = useForm<FormInput>(
    {
      defaultValues: { post_content: null, post_image: null },
    }
  );
  const [imagePreview, setImagePreview] = useState<string | null>();
  const postImageInputRef = useRef<HTMLInputElement | null>(null);
  const postContent = watch("post_content");
  const postImage = watch("post_image");
  const isPostButtonDisabled = !postContent?.trim() && !postImage;

  const onSubmit: SubmitHandler<FormInput> = (input) => {
    setImagePreview(null);
    const formData = new FormData();
    formData.append("post_content", input.post_content || "");
    formData.append("post_image", input.post_image || "");
    createPostMutation.mutate(formData, {
      onSuccess: () => {
        toggleShowCreatePostFrom();
        toast.success("Posted!");
      },
      onError: () => {
        toast.error("something went wrong!", { duration: 5000 });
        toggleShowCreatePostFrom();
      },
    });
    reset();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("post_image", file);
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleClearSelectedImage = () => {
    setValue("post_image", null);
    setImagePreview("");
    if (postImageInputRef.current) {
      postImageInputRef.current.value = "";
    }
  };

  return (
    <Container role="dialog" className="sm:w-[34rem] relative mx-2 sm:mx-auto">
      {createPostMutation.isPending && (
        <div className="absolute inset-0 bg-black/20 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="flex p-2">
        <div className="ml-auto font-extrabold">Create Post</div>
        <CloseButton
          className="ml-auto"
          crossColor="#444"
          onClose={toggleShowCreatePostFrom}
        />
      </div>
      <div className="bg-gray-400 h-[1px] w-full"></div>
      <div className="p-3">
        <div className="flex p-2 items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={user?.imageUrl ?? "/avatar.svg"}
              alt="profile_image"
              width={100}
              height={100}
            />
          </div>
          <div className="pl-2 font-bold">
            {user?.firstName} {user?.lastName}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {imagePreview ? (
            <div className="h-72 overflow-y-scroll hidden-scrollbar">
              <textarea
                {...register("post_content")}
                className="w-full h-32 outline-none p-2 mt-4"
                placeholder={`What's on your mind, ${user?.firstName}`}
              />

              <div className="mt-4 border p-2 rounded relative z-10">
                <Image
                  src={imagePreview}
                  width={500}
                  height={500}
                  alt="Image-preview"
                />
                <div className="absolute right-3 top-3">
                  <CloseButton
                    className="ml-auto"
                    onClose={handleClearSelectedImage}
                  />
                </div>
              </div>
            </div>
          ) : (
            <textarea
              {...register("post_content")}
              className="w-full outline-none p-2 h-56 mt-4"
              placeholder={`What's on your mind, ${user?.firstName}`}
            />
          )}
          <div className="mt-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col cursor-pointer bg-gray-300 w-full items-center rounded p-2 hover:bg-slate-400 text-sm font-extrabold"
            >
              <ImagePlus />
              <span>Add photos/Videos</span>
            </label>
            <input
              type="file"
              id="file-upload"
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
              ref={postImageInputRef}
            />
          </div>
          <button
            type="submit"
            className={`w-full ${
              isPostButtonDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500"
            } text-white rounded p-2 mt-4`}
            disabled={isPostButtonDisabled}
          >
            Post
          </button>
        </form>
      </div>
    </Container>
  );
}

export default CreatePostForm;
