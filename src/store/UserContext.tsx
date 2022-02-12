import React, { createContext, useState } from "react";

interface IUser {
  userAccount: string;
  username: string;
  email: string;
  id: string;
}

export const UserContext = createContext<{
  userData: IUser | null;
  setUserData: React.Dispatch<React.SetStateAction<IUser | null>>;
}>({
  userData: null,
  setUserData: () => {},
});

const UserContextProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = useState<IUser | null>(null);
  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
