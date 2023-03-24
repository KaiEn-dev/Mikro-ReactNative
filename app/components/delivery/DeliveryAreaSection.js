import { Box, Text, Pressable } from "native-base";
import React, { useState, useEffect } from "react";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";

function DeliveryAreaSection({ navigation }) {
  const endpoint = "/deliveryArea/shop/";
  const [area, setArea] = useState();

  const getDeliveryArea = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.deliveryArea;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        }
        setArea(data[0]);
      }
    });
  };

  useEffect(() => {
    getDeliveryArea();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getDeliveryArea();
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
      onPress={() => navigation.navigate("DeliveryAreaEdit", { area: area })}
    >
      <Box flex="1">
        <Box mx="4" display="flex" flexDirection="row" alignItems="center">
          <Text fontSize="20" color="#3d4f21" fontWeight="bold" mr="3">
            Delivery Area
          </Text>
          <FontAwesome5 name="map-pin" size={20} color="#607040" />
        </Box>
      </Box>
      <Box alignItem="center" justifyContent="center">
        <Entypo name="chevron-small-right" size={20} color="#afb7c5" />
      </Box>
    </Pressable>
  );
}

export default DeliveryAreaSection;
