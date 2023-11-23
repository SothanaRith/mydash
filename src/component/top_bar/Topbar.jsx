import { useState } from "react"
import "../top_bar/topbar.scss"
import menu from "./img/app.png"
import mail from "./img/mail.png"
import LeftBar from "../left_bar/LeftBar"
import { Link, Outlet } from "react-router-dom"
const Topbar = () => {
    return (
        <div className="topbar">

            <div className="insize">
                <div className="left">

                    <Link to="/"><img src={menu} alt="" /></Link>

                </div>
                <div className="right">
                    <img src={mail} alt="" />
                    <div className="user">
                        <h3>name</h3>
                        <img className="img1" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="" />
                    </div>

                </div>

            </div>

            
        </div>

    )
}
export default Topbar;