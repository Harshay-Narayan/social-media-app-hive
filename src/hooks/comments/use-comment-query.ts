import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchComments({ queryKey }: { queryKey: [string, string] }) {
  const [, postId] = queryKey;
  const response = await axios.get(`/api/comments?postId=${postId}`);
  return response.data;
}

function useCommentQuery(postId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["fetchComments", postId],
    queryFn: fetchComments,
  });
  return { data, isLoading };
}

export default useCommentQuery;
