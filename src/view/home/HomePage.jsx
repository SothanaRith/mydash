
import Dataview from "../../component/dataview/Dataview";
import Slide from "../../component/slider/Slide";
import "./home.scss"
import HomeTopBar from "./home_topbar";
const HomePage = ({ }) => {
    return (
        <div className="home">
            <HomeTopBar /><br />
            <Slide/>
            <div className="intro">
                <h1>ALL Products</h1>
                <p>enjoy your day with special discount %</p>
            </div>

            <Dataview />

        </div>

    )
}
export default HomePage;