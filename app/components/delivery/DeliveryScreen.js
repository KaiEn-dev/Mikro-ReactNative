import { Box, Button, ScrollView, Text } from "native-base";
import React, { useState, useEffect } from "react";
import DeliveryMethodTab from "./DeliveryMethodTab";
import OrderMethodTab from "./OrderMethodTab";

function DeliveryScreen({ navigation }) {
  const [tab, setTab] = useState(1);

  const displayTab = (tab) => {
    if (tab == 2) {
      return <OrderMethodTab navigation={navigation} />;
    }
    if (tab == 1) {
      return <DeliveryMethodTab navigation={navigation} />;
    }
  };

  const getFontColor = (x) => {
    if (x == tab) {
      return "#7D9253";
    } else {
      return "#838383";
    }
  };

  const getLineColor = (x) => {
    if (x == tab) {
      return "#7D9253";
    } else {
      return "#F3F3F3";
    }
  };

  return (
    <Box h="92%" w="100%" bg="#F3F3F3">
      <Box
        height="10%"
        w="100%"
        bg="#fff"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        shadow="1"
        px="3"
      >
        <Text color="#2B3D2D" fontSize="20" fontWeight="bold" ml="3">
          Delivery
        </Text>
      </Box>
      <Box w="100%" flexDirection="row" bg="#F3F3F3" shadow="1">
        <Button
          flex="1"
          borderRadius="0"
          bg="#F3F3F3"
          _pressed={{ bg: "#E8E8E8" }}
          borderBottomWidth="2"
          borderBottomColor={getLineColor(1)}
          onPress={() => setTab(1)}
        >
          <Text fontWeight="600" color={getFontColor(1)}>
            Delivery
          </Text>
        </Button>
        <Button
          flex="1"
          borderRadius="0"
          bg="#F3F3F3"
          _pressed={{ bg: "#E8E8E8" }}
          borderBottomWidth="2"
          borderBottomColor={getLineColor(2)}
          onPress={() => setTab(2)}
        >
          <Text fontWeight="600" color={getFontColor(2)}>
            Order
          </Text>
        </Button>
      </Box>
      {displayTab(tab)}
    </Box>
  );
}

export default DeliveryScreen;
