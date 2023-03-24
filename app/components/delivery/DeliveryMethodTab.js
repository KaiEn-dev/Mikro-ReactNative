import { Box, Center, ScrollView, Text } from "native-base";
import React, { useState, useEffect } from "react";
import DeliverySection from "./DeliverySection";
import PickupSection from "./PickupSection";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import DeliveryAreaEdit from "./DeliveryAreaEdit";
import DeliveryAreaSection from "./DeliveryAreaSection";

function DeliveryMethodTab({ navigation }) {
  const endpoint = "/deliveryMode/shop/";
  const [deliveryMode, setDeliveryMode] = useState();

  const getDeliveryMode = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.deliveryMode;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        } else {
          setDeliveryMode(data[0]);
        }
      }
    });
  };

  useEffect(() => {
    getDeliveryMode();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getDeliveryMode();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Center flex="1" bg="#E7E7E7">
      <ScrollView flex="1" w="100%">
        <DeliverySection deliveryMode={deliveryMode} navigation={navigation} />
        <PickupSection deliveryMode={deliveryMode} navigation={navigation} />
        <DeliveryAreaSection navigation={navigation} />
      </ScrollView>
    </Center>
  );
}

export default DeliveryMethodTab;
