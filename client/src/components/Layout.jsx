import React, { useContext } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import UserPic from "../assets/user.png";
import { AuthContext } from "../contexts/AuthContext";
import { UserRoleContext } from "../contexts/UserRoleContext";

const Layout = () => {
  const { auth, logout } = useContext(AuthContext);
  const { isManager, isAdmin, isMember } = useContext(UserRoleContext);
  return (
    <div className="flex sidebar">
      <div className="w-72 p-5 bg-slate-200 h-screen flex flex-col">
        <div className="flex gap-3 items-center border-b pb-5 border-black/50">
          <img
            src={UserPic}
            className="w-20 aspect-square bg-white p-3 rounded-lg"
            alt=""
          />
          <div>
            <h1 className="uppercase font-bold text-xl">{auth.user.name}</h1>
            <h1 className="capitalize font-bold text-sm text-primary">
              {auth.user.role}
            </h1>
          </div>
        </div>

        <div className="flex flex-col py-3 font-semibold">
          {(isManager || isMember) && (
            <>
              <NavLink to="/dashboard" className="p-2 rounded">
                Dashboard
              </NavLink>
              <NavLink to="/order" className="p-2 rounded">
                Order Meal
              </NavLink>
              <NavLink to="/all-order" className="p-2 rounded">
                All Orders
              </NavLink>
              <NavLink to="/deposit" className="p-2 rounded">
                Request Deposit
              </NavLink>
            </>
          )}

          {isManager && (
            <>
              <h1 className="mt-5 text-xs uppercase text-slate-400 font-bold p-2">
                Manager Section
              </h1>
              <NavLink to="/expense" className="p-2 rounded">
                Add Expense
              </NavLink>
              <NavLink to="/add-member" className="p-2 rounded">
                Add Member
              </NavLink>
            </>
          )}
        </div>
        <button className="mt-auto btn btn-active font-bold" onClick={logout}>
          LogOut
        </button>
      </div>

      <div className="h-screen overflow-y-auto p-10 container">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
