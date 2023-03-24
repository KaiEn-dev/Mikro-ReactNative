import { NavigationContainer } from "@react-navigation/native";
import { Box, Center, Image, Text, Button, ScrollView } from "native-base";
import React, { useState, useEffect } from "react";
import registerlogo from "../../assets/registerlogo.png";
import { Entypo } from "@expo/vector-icons";

function RegisterScreen({ navigation }) {
  return (
    <Box h="100%" w="100%" bg="#E7F0DF">
      <Box top="25%" alignItems="center">
        <Image
          size="30%"
          source={registerlogo}
          alt="logo"
          resizeMode="contain"
        />
        <Text textAlign="center" fontWeight="600" fontSize="18" color="#3D4F21">
          Start Selling Today
        </Text>
        <Text fontWeight="500" fontSize="12" color="#7D9253" textAlign="center">
          Set up and manage your very own {`\n`} online store all in one app!
        </Text>
        <Button
          mt="10"
          bg="transparent"
          py="2"
          _pressed={{ bg: "#DBE3D4" }}
          onPress={() => navigation.navigate("RegisterMenu")}
        >
          <Center flexDirection="row" justifyContent="center">
            <Text fontSize="13" color="#2B342D" mr="1">
              get started
            </Text>
            <Entypo name="chevron-small-right" size={12} color="#2B342D" />
          </Center>
        </Button>
      </Box>
    </Box>
  );
}

export default RegisterScreen;
