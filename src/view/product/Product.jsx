import LeftBar from "../../component/left_bar/LeftBar";
import "./product.scss"
import RowExpansionDemo from "../../component/table/Table";

const Product =()=>{
    return(
        <div className="product">
            <LeftBar/>
            <RowExpansionDemo />
        </div>
    )
}
export default Product;