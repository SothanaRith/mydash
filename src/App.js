import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { useState } from 'react';
import Setting from "./view/setting/Setting"
import Product from "./view/product/Product"
import HomePage from './view/home/HomePage';
import TopBar from "./component/top_bar/Topbar"
import LeftBar from './component/left_bar/LeftBar';
import Order from './view/order/Order';
import UserInfo from './view/userInfo/UserInfo';
import Review from './view/review_item/Review_item';
function App() {


  return (
      <div>
        <BrowserRouter>
        <Routes>
        <Route path="/" >
            </Route>
          <Route index element={<HomePage />} />
          <Route path="/setting" element={<Setting/>} />
          <Route path="/product" element={<Product />} />
          <Route path="/order" element={<Order />} />
          <Route path="/user" element={<UserInfo />} />
          <Route path="/manage" element={<Review />} />
        </Routes>
        </BrowserRouter>
      </div>
    
  );
}
export default App;