import { Box, Center, Text, Pressable } from "native-base";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function OrderCard({ order, navigation }) {
  const displayETA = (e) => {
    if (order.order_method == "ordernow") {
      const date = order.date.slice(0, 10);
      const time = order.time.slice(0, 5);

      return (
        <Box px="2">
          <Text fontSize="10" color="#8E8E8E">
            Ordered on
          </Text>
          <Box flexDirection="row">
            <Text color="#3D4F21" fontWeight="500">
              {date}
            </Text>
            <Text color="#3D4F21" fontWeight="500" ml="4">
              {time}
            </Text>
          </Box>
        </Box>
      );
    }
    if (order.order_method == "preorder") {
      return (
        <Box px="2">
          <Text fontSize="10" color="#8E8E8E">
            Scheduled for
          </Text>
          <Box flexDirection="row">
            <Text color="#3D4F21" fontWeight="500">
              {JSON.parse(order.schedule).date}
            </Text>
            <Text color="#3D4F21" fontWeight="500" ml="4">
              {JSON.parse(order.schedule).time}
            </Text>
          </Box>
        </Box>
      );
    }
  };

  const getStatusBg = (status) => {
    if (status == "pending") {
      return "#FBBC05";
    }
    if (status == "preparing") {
      return "#4285F4";
    }
    if (status == "cancelled") {
      return "#EA4335";
    }
    if (status == "complete") {
      return "#3DA853";
    }
  };

  const getStatusIcon = (status) => {
    if (status == "pending") {
      return "account-clock";
    }
    if (status == "preparing") {
      return "timer-sand";
    }
    if (status == "cancelled") {
      return "close-circle";
    }
    if (status == "complete") {
      return "check-circle";
    }
  };
  return (
    <Pressable
      onPress={() => navigation.navigate("OrderDetails", { order: order })}
      mx="5"
      my="3"
      p="5"
      bg="#FFF"
      shadow="2"
      borderRadius="5"
      _pressed={{ bg: "#F6F6F6" }}
    >
      <Box flexDirection="row" mb="7">
        <Box flex="1">
          <Box px="2">
            <Text fontWeight="bold" color="#7d9253">
              Order ID: {order.order_id}
            </Text>
          </Box>
        </Box>
        <Box flexDirection="row" flex="2" justifyContent="flex-end">
          <Center bg="#E7F0DF" borderRadius="full" px="3" mr="5">
            <Text fontWeight="600" color="#7D9253">
              {order.delivery_method}
            </Text>
          </Center>
          <Center bg="#E7F0DF" borderRadius="full" px="3">
            <Text fontWeight="600" color="#7D9253">
              {order.order_method}
            </Text>
          </Center>
        </Box>
      </Box>
      <Box flexDirection="row">
        <Box flex="2">{displayETA()}</Box>
        <Box flex="1">
          <Center
            bg={getStatusBg(order.status)}
            flexDirection="row"
            borderRadius="full"
            borderWidth="1"
            borderColor="#F2F2F2"
            px="3"
            py="2"
          >
            <Text mr="1" color="#fff" fontWeight="bold">
              {order.status}
            </Text>
            <MaterialCommunityIcons
              name={getStatusIcon(order.status)}
              size={20}
              color="#fff"
            />
          </Center>
        </Box>
      </Box>
    </Pressable>
  );
}

export default OrderCard;
