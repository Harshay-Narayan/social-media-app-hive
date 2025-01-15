"use client";
import React, { useRef, useState, MouseEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { X, ImagePlus } from "lucide-react";
import Image from "next/image";
import CloseButton from "../UI/CloseButton";
import createPost from "@/actions/createPost";
import Container from "../UI/container";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Loader from "../UI/loader";
import UserService from "@/lib/services/userService";
import { revalidatePath } from "next/cache";

interface IFormInput {
  post_content: string | null;
  post_image: File | null;
}

type CreatePostFormProps = {
  showCreatePostFormHandler: () => void;
};

const submitFormData = async (formData: FormData) => {
  const { data } = await axios.post("/api/posts", formData);
  return data;
};

function CreatePostForm({ showCreatePostFormHandler }: CreatePostFormProps) {
  const { userProfileImageUrl, userFullName } = UserService.getUserInfo();
  const { register, handleSubmit, setValue, reset, watch } =
    useForm<IFormInput>({
      defaultValues: { post_content: null, post_image: null },
    });
  const [imagePreview, setImagePreview] = useState<string | null>();
  const postImageInputRef = useRef<HTMLInputElement | null>(null);

  const postContent = watch("post_content");
  const postImage = watch("post_image");
  const isPostButtonDisabled = !postContent?.trim() && !postImage;

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: submitFormData,
  });

  const onSubmit: SubmitHandler<IFormInput> = (input) => {
    setImagePreview(null);

    const formData = new FormData();
    formData.append("post_content", input.post_content || "");
    formData.append("post_image", input.post_image || "");
    mutate(formData, {
      onSuccess: () => {},
    });
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
    setValue("post_image", null);
    setImagePreview("");
    if (postImageInputRef.current) {
      postImageInputRef.current.value = "";
    }
  };

  return (
    <Container role="dialog" className="w-[36rem]">
      {/* <Loader /> */}
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
        <div className="flex mt-4 items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={userProfileImageUrl ? userProfileImageUrl : "/avatar.svg"}
              alt="profile_image"
              width={100}
              height={100}
            />
          </div>
          <div className="pl-2 font-bold">{userFullName}</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} action={createPost}>
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
    </Container>
  );
}

export default CreatePostForm;
