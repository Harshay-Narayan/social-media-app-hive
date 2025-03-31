import { POSTS_API } from "@/lib/apiEndpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const submitFormData = async (formData: FormData) => {
  try {
    const response = await axios.post(POSTS_API.CREATE_POST, formData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Error in Post creation: ${error.response}`);
    }
    throw new Error("Error in Post creation");
  }
};

function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const createPostMutation = useMutation({
    mutationFn: submitFormData,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getPosts"] }),
  });
  return { createPostMutation };
}

export default useCreatePostMutation;
