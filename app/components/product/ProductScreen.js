import { Box, Button, Progress, Text, Center } from "native-base";
import React, { useState, useEffect } from "react";

import { Entypo } from "@expo/vector-icons";
import ProductList from "./ProductList";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import GLOBAL from "../../global";

function ProductScreen({ navigation }) {
  const endpoint = "/product/shop/";
  const [products, setProducts] = useState();

  const getProducts = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.products;
        if (data.length == 0) {
          setProducts(null);
        } else {
          setProducts(data);
        }
      }
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getProducts();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Box h="92%" w="100%" bg="#F3F3F3">
      <Box
        height="11%"
        w="100%"
        bg="#fff"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        shadow="1"
        px="3"
      >
        <Text color="#2B3D2D" fontSize="22" fontWeight="bold" ml="3">
          Products
        </Text>
        <Button
          onPress={() => {
            navigation.navigate("ProductSetting", { products: products });
          }}
          bg="#fff"
          _pressed={{ bg: "#F4F4F4" }}
          borderRadius="full"
        >
          <Entypo name="menu" size={26} color="#2B3D2D" />
        </Button>
      </Box>
      <ProductList products={products} navigation={navigation} />
    </Box>
  );
}

export default ProductScreen;
