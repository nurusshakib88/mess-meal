// src/contexts/UserRoleContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [isManager, setIsManager] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (auth && auth.user) {
      if (auth.user.role === "manager") {
        setIsManager(true);
      } else if (auth.user.role === "admin") {
        setIsAdmin(true);
      } else if (auth.user.role === "member") {
        setIsMember(true);
      } else {
        setIsManager(false);
        setIsAdmin(false);
      }
    }
  }, [auth]);
  return (
    <UserRoleContext.Provider value={{ isManager, isAdmin, isMember }}>
      {children}
    </UserRoleContext.Provider>
  );
};
