"use client";
import { createContext, useContext, useState } from "react";

interface CreatePostContextType {
  showCreatePostForm: boolean;
  toggleShowCreatePostFrom: () => void;
}

const CreatePostContext = createContext<CreatePostContextType | null>(null);

export const CreatePostProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const toggleShowCreatePostFrom = () => setShowCreatePostForm((prev) => !prev);
  return (
    <CreatePostContext.Provider
      value={{ showCreatePostForm, toggleShowCreatePostFrom }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};

export const useCreatePost = () => {
  const context = useContext(CreatePostContext);
  if (!context) {
    throw new Error("useCreatePost must be used within a CreatePostProvider");
  }
  return context;
};
