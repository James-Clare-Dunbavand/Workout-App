import "./layout.css";
import { Outlet } from "react-router";
import Navbar from "../navbar/Navbar";
export default function Layout() {
    return (
        <>
            <Navbar />
            <main className="outlet-wrapper">
                <Outlet />
            </main>
        </>
    );
}
