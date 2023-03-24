import { Box, Button, Center, List, ScrollView, Text } from "native-base";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import OrderPendingTab from "./OrderPendingTab";
import OrderPreorderTab from "./OrderPreorderTab";
import OrderAllTab from "./OrderAllTab";
import OrderTodayTab from "./OrderTodayTab";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import GLOBAL from "../../global";

function OrderScreen({ navigation }) {
  const endpoint = "/customerOrder/shop/";
  const [tab, setTab] = useState(2);
  const [orders, setOrders] = useState();

  const getOrders = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.customerOrders;
        if (data.length == 0) {
          setOrders(null);
        } else {
          setOrders(data);
        }
      }
    });
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getOrders();
    });
    return unsubscribe;
  }, [navigation]);

  const displayTab = (tab) => {
    if (tab == 1) {
      return <OrderPendingTab orders={orders} navigation={navigation} />;
    }
    if (tab == 2) {
      return <OrderTodayTab orders={orders} navigation={navigation} />;
    }
    if (tab == 3) {
      return <OrderPreorderTab orders={orders} navigation={navigation} />;
    }
    if (tab == 4) {
      return <OrderAllTab orders={orders} navigation={navigation} />;
    }
  };

  const getBgStyle = (id) => {
    if (id == tab) {
      return "#7D9253";
    } else {
      return "#F3F3F3";
    }
  };

  const getFontStyle = (id) => {
    if (id == tab) {
      return "#FFF";
    } else {
      return "#7D9253";
    }
  };

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
          Orders
        </Text>
        <Button
          onPress={() => {
            navigation.navigate("OrderHistory", { orders: orders });
          }}
          bg="#fff"
          _pressed={{ bg: "#F4F4F4" }}
          borderRadius="full"
        >
          <MaterialIcons name="history" size={26} color="#2B3D2D" />
        </Button>
      </Box>
      <Box>
        <ScrollView
          directionalLockEnabled="true"
          horizontal="true"
          bg="#F3F3F3"
          shadow="1"
        >
          <List mx="2" borderWidth="0" flexDirection="row">
            <Button
              onPress={() => setTab(1)}
              w="22%"
              mx="1"
              borderRadius="full"
              bg={getBgStyle(1)}
              _pressed={{ bg: "#F3F3F3" }}
            >
              <Text fontWeight="500" color={getFontStyle(1)}>
                Pending
              </Text>
            </Button>
            <Button
              onPress={() => setTab(2)}
              w="22%"
              mx="1"
              borderRadius="full"
              bg={getBgStyle(2)}
              _pressed={{ bg: "#F3F3F3" }}
            >
              <Text fontWeight="500" color={getFontStyle(2)}>
                Today
              </Text>
            </Button>
            <Button
              onPress={() => setTab(3)}
              w="22%"
              mx="1"
              borderRadius="full"
              bg={getBgStyle(3)}
              _pressed={{ bg: "#F3F3F3" }}
            >
              <Text fontWeight="500" color={getFontStyle(3)}>
                Preorder
              </Text>
            </Button>
            <Button
              onPress={() => setTab(4)}
              w="22%"
              mx="1"
              borderRadius="full"
              bg={getBgStyle(4)}
              _pressed={{ bg: "#F3F3F3" }}
            >
              <Text fontWeight="500" color={getFontStyle(4)}>
                All
              </Text>
            </Button>
          </List>
        </ScrollView>
      </Box>
      {displayTab(tab)}
    </Box>
  );
}

export default OrderScreen;
