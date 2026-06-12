import React, { createContext, useContext, useState } from "react";
import { getComments } from "../data/books";

const CommentsContext = createContext();

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useComments must be used within CommentsProvider");
  }
  return context;
};

export const CommentsProvider = ({ children }) => {
  const [userComments, setUserComments] = useState(getComments());

  const addComment = (bookId, comment) => {
    setUserComments((prev) => ({
      ...prev,
      [bookId]: [...(prev[bookId] || []), comment],
    }));
  };

  const getBookComments = (bookId) => {
    return userComments[bookId] || [];
  };

  const deleteComment = (bookId, index) => {
    setUserComments((prev) => ({
      ...prev,
      [bookId]: prev[bookId].filter((_, i) => i !== index),
    }));
  };

  return (
    <CommentsContext.Provider value={{ getBookComments, addComment, deleteComment }}>
      {children}
    </CommentsContext.Provider>
  );
};
