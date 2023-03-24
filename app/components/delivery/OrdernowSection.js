import { Box, Text, Pressable, Switch } from "native-base";
import React from "react";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";

function OrdernowSection({ navigation, orderMode }) {
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
      onPress={() =>
        navigation.navigate("OrdernowEdit", { orderMode: orderMode })
      }
    >
      <Box flex="1">
        <Box mx="4" display="flex" flexDirection="row" alignItems="center">
          <Text fontSize="20" color="#3d4f21" fontWeight="bold" mr="3">
            Ordernow
          </Text>
          <MaterialCommunityIcons name="clock-fast" size={24} color="#3d4f21" />
        </Box>
      </Box>
      <Box alignItem="center" justifyContent="center">
        <Entypo name="chevron-small-right" size={20} color="#afb7c5" />
      </Box>
    </Pressable>
  );
}

export default OrdernowSection;
