import React, { useState } from "react";
import { Box, Text } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import Navbar from "./Navbar";
import ShopScreen from "../shop/ShopScreen";
import ProductScreen from "../product/ProductScreen";
import OrderScreen from "../order/OrderScreen";
import DeliveryScreen from "../delivery/DeliveryScreen";
import ProfileScreen from "../profile/ProfileScreen";

function Home({ navigation }) {
  const [page, setPage] = useState(1);

  const displayPage = (page) => {
    if (page === 1) {
      return <ShopScreen navigation={navigation} />;
    }
    if (page === 2) {
      return <ProductScreen navigation={navigation} />;
    }
    if (page === 3) {
      return <OrderScreen navigation={navigation} />;
    }
    if (page === 4) {
      return <DeliveryScreen navigation={navigation} />;
    }
    if (page === 5) {
      return <ProfileScreen navigation={navigation} />;
    }
  };

  return (
    <Box flex={1} bg="#2B3D2D">
      <Box flex={1} safeArea>
        {displayPage(page)}
        <Navbar page={page} setPage={setPage} />
      </Box>
    </Box>
  );
}

export default Home;
