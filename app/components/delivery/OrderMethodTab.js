import { Box, Center, ScrollView, Text } from "native-base";
import React, { useState, useEffect } from "react";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import OrdernowSection from "./OrdernowSection";
import OrderSchedule from "./OrderSchedule";
import PreorderSection from "./PreorderSection";

function OrderMethodTab({ navigation }) {
  const endpoint = "/orderMode/shop/";
  const [orderMode, setOrderMode] = useState();

  const getOrderMode = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.orderMode;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        } else {
          setOrderMode(data[0]);
        }
      }
    });
  };

  useEffect(() => {
    getOrderMode();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getOrderMode();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Center flex="1" bg="#E7E7E7">
      <ScrollView flex="1" w="100%">
        <OrdernowSection orderMode={orderMode} navigation={navigation} />
        <PreorderSection orderMode={orderMode} navigation={navigation} />
        <OrderSchedule navigation={navigation} />
      </ScrollView>
    </Center>
  );
}

export default OrderMethodTab;
