import { Text, Box, Center, ScrollView } from "native-base";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OrderCard from "./OrderCard";

function OrderAllTab({ orders, navigation }) {
  return (
    <Center flex="1" bg="#EBEBEB" justifyContent="center" alignItems="center">
      {!orders && (
        <Box alignItems="center">
          <MaterialCommunityIcons
            name="mailbox-open-up"
            size={24}
            color="#A0A0A0"
          />
          <Text color="#A0A0A0">No orders are currently available</Text>
        </Box>
      )}
      {orders && (
        <ScrollView flex="1" w="100%">
          {orders.map((order) => {
            return (
              <OrderCard
                key={order.order_id}
                order={order}
                navigation={navigation}
              />
            );
          })}
        </ScrollView>
      )}
    </Center>
  );
}

export default OrderAllTab;
