import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Authors from "./pages/Authors";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import DeletePost from "./pages/DeletePost";
import CategoryPost from "./pages/CategoryPost";
import AuthorPost from "./pages/AuthorPost";
import DashBoard from "./pages/Dashboard";
import Logout from "./pages/Logout";

const router = createBrowserRouter([
    {
        path: "/",

        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/posts/:id",
                element: <PostDetail />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/profile",
                element: <UserProfile />,
            },
            {
                path: "/authors",
                element: <Authors />,
            },
            {
                path: "/create",
                element: <CreatePost />,
            },
            {
                path: "/post/categories/:category",
                element: <CategoryPost />,
            },
            {
                path: "/post/user/:id",
                element: <AuthorPost />,
            },
            {
                path: "/myposts/:id",
                element: <DashBoard />,
            },
            {
                path: "/post/:id/edit",
                element: <EditPost />,
            },
            {
                path: "/post/:id/delete",
                element: <DeletePost />,
            },
            {
                path: "/logout",
                element: <Logout />,
            },
        ],
    },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
