import React from "react";
import UserContextProvider from "./UserContext";

const Provider: React.FC = ({ children }) => {
  return <UserContextProvider>{children}</UserContextProvider>;
};

export default Provider;
