"use client";
import React, { useRef, useState, MouseEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { X, ImagePlus } from "lucide-react";
import Image from "next/image";
import CloseButton from "../UI/CloseButton";

interface IFormInput {
  post_content: string;
  post_image?: File;
}

type CreatePostFormProps = {
  showCreatePostFormHandler: () => void;
};

function CreatePostForm({ showCreatePostFormHandler }: CreatePostFormProps) {
  const { register, handleSubmit, setValue, reset, watch } =
    useForm<IFormInput>();
  const [imagePreview, setImagePreview] = useState<string | null>();
  const postImageInputRef = useRef<HTMLInputElement | null>(null);

  const postContent = watch("post_content");
  const postImage = watch("post_image");
  const isPostButtonDisabled = !postContent?.trim() && !postImage;

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setImagePreview("");
    console.log(data);
    reset();
    showCreatePostFormHandler();
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
    setValue("post_image", undefined);
    setImagePreview("");
    if (postImageInputRef.current) {
      postImageInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg w-[36rem]" role="dialog">
      <div className="flex p-2">
        <div className="ml-auto font-extrabold">Create Post</div>
        <CloseButton
          className="ml-auto"
          crossColor="#444"
          onClick={showCreatePostFormHandler}
          onClose={showCreatePostFormHandler}
        />
      </div>
      <div className="bg-gray-400 h-[1px] w-full"></div>
      <div className="p-2">
        <div className="flex mt-4">
          <div className="h-8 w-8">
            <Image
              src={"/globe.svg"}
              alt="profile_image"
              width={100}
              height={100}
            />
          </div>
          <div className="pl-2">Mr. Random</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {imagePreview ? (
            <div className="h-72 overflow-y-scroll">
              <textarea
                {...register("post_content")}
                className="w-full h-32 outline-none border border-red-100 p-2 mt-4"
              />

              <div className="mt-4 border h-60 p-2 rounded relative aspect-square z-10">
                <Image src={imagePreview} fill alt="Image-preview" />
                <div className="absolute right-3 top-3">
                  <CloseButton
                    className="ml-auto"
                    onClick={handleClearSelectedImage}
                  />
                </div>
              </div>
            </div>
          ) : (
            <textarea
              {...register("post_content")}
              className="w-full outline-none border border-red-100 p-2 h-56 mt-4"
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
    </div>
  );
}

export default CreatePostForm;
