import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import HomePage from "../pages/HomePage";
import ListingsPage from "../pages/ListingsPage";
import ListingDetailPage from "../pages/ListingDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentCancelPage from "../pages/PaymentCancelPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "listings", element: <ListingsPage /> },
            { path: "listings/:id", element: <ListingDetailPage /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            {
                path: "my-bookings",
                element: (
                    <ProtectedRoute>
                        <MyBookingsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
            { path: "payment/success", element: <PaymentSuccessPage /> },
            { path: "payment/cancel", element: <PaymentCancelPage /> },
        ],
    },
]);