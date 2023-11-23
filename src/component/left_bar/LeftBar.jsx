import { Link } from "react-router-dom";
import "./left_bar.scss"
import { useState } from "react";


const LeftBar = () => {
    const [show, setShow] = useState(false)

    const showList = () => {
        setShow(!show)
    }
    return (
        <div className="leftbar">
            <div className="list">

                <Link to="/manage"><h4>Manages</h4></Link>
                <Link to="/product" onClick={showList}><h4 >Product</h4></Link>
                {show && 
                <div>
                    <Link to="/order"><h5>Food</h5></Link>
                    <Link to="/user"><h5>Drinks</h5></Link>
                    <Link to="/user"><h5>fashion</h5></Link>
                </div>}
                <Link to="/order"><h4>Order</h4></Link>
                <Link to="/user"><h4>Users Info</h4></Link>
                <Link to="/setting"><h4>Setting</h4></Link>
            </div>

        </div>
    )
}
export default LeftBar;