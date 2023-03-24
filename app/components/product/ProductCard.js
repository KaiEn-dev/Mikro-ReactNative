import { Box, Pressable, Image, Text, Center } from "native-base";
import React, { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";

import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import GLOBAL from "../../global";

function ProductCard({ product, navigation }) {
  const endpoint = "/image/";
  const [image, setImage] = useState();

  const getImage = () => {
    apiClient.get(endpoint + product.product_image).then((response) => {
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
        } else {
          setImage(data[0]);
        }
      }
    });
  };

  useEffect(() => {
    getImage();
  }, []);

  const getStatusColor = () => {
    if (product.availability == 0) {
      return "#FF0000";
    }
    if (product.availability == 1) {
      return "#00EB16";
    }
  };

  return (
    <Pressable
      height="150"
      m="3"
      bg="#FFF"
      borderRadius="4"
      shadow="1"
      display="flex"
      flexDirection="row"
      _pressed={{ bg: "#EDEDED" }}
      onPress={() =>
        navigation.navigate("ProductEdit", { product: product, image: image })
      }
    >
      <Box flex="1" m="2">
        <Box flex="1" w="100%" flexDirection="row" alignItems="center">
          <Center flex="1">
            {image && (
              <Image size="100%" src={image.image_link} alt="product.jpg" />
            )}
          </Center>
          <Box
            justifyContent="center"
            bg="#EEEEEE"
            flex="2"
            ml="2"
            h="100%"
            pl="2"
          >
            <Text mb="2" fontSize="16" fontWeight="500" color="#3D4F21">
              {product.product_name}
            </Text>
            <Text fontWeight="500" color="#627F35">
              {product.product_description}
            </Text>
            <Text fontWeight="500" color="#627F35">
              {product.price}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box alignItem="center" justifyContent="center" bg={getStatusColor()}>
        <Entypo name="chevron-small-right" size={5} color="transparent" />
      </Box>
    </Pressable>
  );
}

export default ProductCard;
