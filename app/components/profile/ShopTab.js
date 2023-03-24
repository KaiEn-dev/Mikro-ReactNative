import { Box, Image, Pressable, Text } from "native-base";
import React, { useState, useEffect } from "react";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

function ShopTab({ navigation }) {
  const endpoint = "/shop/";
  const imgEndpoint = "/image/";
  const [shop, setShop] = useState();
  const [shopImg, setShopImg] = useState();

  const getShop = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.shop;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        }
        setShop(data[0]);
        getImage(data[0].shop_image);
      }
    });
  };

  const getImage = (id) => {
    apiClient.get(imgEndpoint + id).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.image;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        }
        setShopImg(data[0]);
      }
    });
  };

  useEffect(() => {
    getShop();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getShop();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Pressable
      m="4"
      py="4"
      bg="#e7f0df"
      borderRadius="3"
      shadow="1"
      display="flex"
      flexDirection="row"
      _pressed={{ bg: "#DFE8D5" }}
      onPress={() => {
        navigation.navigate("EditShop", { shop: shop, shopImg: shopImg });
      }}
    >
      <Box flex="1">
        <Box
          mx="4"
          mb="3"
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Text fontSize="20" color="#3d4f21" fontWeight="bold" mr="3">
            Shop
          </Text>
          <MaterialCommunityIcons name="storefront" size={22} color="#607040" />
        </Box>
        <Box ml="3" mr="1">
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            height="10"
            p="2"
            bg="#fff"
            borderRadius="3"
            mb="1"
          >
            <Box flex="2">
              <Text fontWeight="500">name</Text>
            </Box>
            <Box flex="5">
              {shop && <Text color="#747474">{shop.shop_name}</Text>}
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            bg="#fff"
            p="2"
            bgColor="#fff"
            borderRadius="3"
            mb="1"
          >
            <Box flex="2">
              <Text fontWeight="500">image</Text>
            </Box>
            <Box flex="5">
              {shopImg && (
                <Image
                  size="sm"
                  resizeMode="contain"
                  src={shopImg.image_link}
                  alt="Shop image"
                />
              )}
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            height="10"
            bg="#fff"
            p="2"
            bgColor="#fff"
            borderRadius="3"
            mb="1"
          >
            <Box flex="2">
              <Text fontWeight="500">description</Text>
            </Box>
            <Box flex="5">
              {shop && (
                <Text isTruncated color="#747474">
                  {shop.shop_description}
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box alignItem="center" justifyContent="center">
        <Entypo name="chevron-small-right" size={20} color="#afb7c5" />
      </Box>
    </Pressable>
  );
}

export default ShopTab;
