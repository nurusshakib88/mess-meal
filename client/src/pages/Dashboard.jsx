import React, { useContext } from "react";

import { AuthContext } from "../contexts/AuthContext";
const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="font-bold text-5xl uppercase">Welcome to MESS MEAL</h1>
      <h1 className="uppercase font-bold text-xl my-5">{auth.user.name}</h1>
    </div>
  );
};

export default Dashboard;
