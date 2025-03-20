import { POSTS_API } from "@/lib/apiEndpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const submitFormData = async (formData: FormData) => {
  const response = await axios.post(POSTS_API.CREATE_POST, formData);
  return response.data;
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
