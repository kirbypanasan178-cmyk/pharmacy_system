import { Outlet } from "react-router-dom"
import { AdminNavBar } from "./AdminNavbar"
import "../../css/AdminLayout.css"


export const AdminLayout = () => {

    return (
        <div className="admin-wrapper">
            < AdminNavBar />
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    )
}