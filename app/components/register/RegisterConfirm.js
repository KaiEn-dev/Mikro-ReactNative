import {
  Box,
  Button,
  Image,
  Input,
  Pressable,
  Text,
  TextArea,
  ScrollView,
  KeyboardAvoidingView,
  Center,
} from "native-base";
import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function RegisterConfirm({ setPosition, createShop }) {
  return (
    <Center w="100%" h="78%">
      <Center mb="20">
        <MaterialCommunityIcons name="storefront" size={24} color="#7D9253" />
        <Text color="#3D4F21" fontSize="17" fontWeight="600">
          Create shop?
        </Text>
        <Button
          py="2"
          px="4"
          mt="7"
          borderRadius="5"
          bg="transparent"
          onPress={() => {
            createShop();
          }}
          _pressed={{ bg: "#fff" }}
        >
          <Text color="#ABABAB" fontWeight="500">
            let's go!
          </Text>
        </Button>
      </Center>
      <Box w="100%" flexDirection="row" p="4" position="absolute" bottom="0">
        <Box flex="1" alignItems="flex-start">
          <Button
            shadow="1"
            py="2"
            px="4"
            borderRadius="full"
            onPress={() => {
              setPosition(2);
            }}
            bg="#fff"
            _pressed={{ bg: "#D0D0D0" }}
          >
            <Text color="#A4A4A4">back</Text>
          </Button>
        </Box>
      </Box>
    </Center>
  );
}

export default RegisterConfirm;
