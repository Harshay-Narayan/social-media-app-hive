import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

async function sendheartBeat() {
  const response = await axios.put("/api/user/active");
  return response.data;
}

function useHeartbeat() {
  const { mutate } = useMutation({ mutationFn: sendheartBeat });
  useEffect(() => {
    const timer = setInterval(() => mutate(), 50000);
    return () => clearInterval(timer);
  }, [mutate]);
  return null;
}

export default useHeartbeat;
