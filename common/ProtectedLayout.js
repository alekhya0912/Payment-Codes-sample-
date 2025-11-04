import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedLayout() {
    const token = localStorage.getItem("token");
    if(!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />
};

export default ProtectedLayout;
