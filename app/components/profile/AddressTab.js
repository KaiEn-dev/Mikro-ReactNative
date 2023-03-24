import { Box, Image, Pressable, Text } from "native-base";
import React, { useState, useEffect } from "react";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

function AddressTab({ navigation }) {
  const endpoint = "/address/shop/";
  const [address, setAddress] = useState();

  const getAddress = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.address;
        if (data.length == 0) {
        } else {
          setAddress(data[0]);
        }
      }
    });
  };

  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAddress();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Pressable
      m="4"
      mb="10"
      py="4"
      bg="#e7f0df"
      borderRadius="3"
      shadow="1"
      display="flex"
      flexDirection="row"
      _pressed={{ bg: "#DFE8D5" }}
      onPress={() => {
        navigation.navigate("EditLocation", { address: address });
      }}
    >
      <Box flex="1">
        <Box
          mx="4"
          mb="3"
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Text fontSize="20" color="#3d4f21" fontWeight="bold" mr="3">
            Location
          </Text>
          <FontAwesome5 name="map-marked-alt" size={20} color="#607040" />
        </Box>
        {address && (
          <Box ml="3" mr="1">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              height="10"
              p="2"
              bg="#fff"
              borderRadius="3"
              mb="1"
            >
              <Box flex="1">
                <Text fontWeight="500">address</Text>
              </Box>
              <Box flex="3">
                {address && (
                  <Text isTruncated color="#747474">
                    {address.address}
                  </Text>
                )}
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              height="10"
              bg="#fff"
              p="2"
              bgColor="#fff"
              borderRadius="3"
              mb="1"
            >
              <Box flex="1">
                <Text fontWeight="500">postcode</Text>
              </Box>
              <Box flex="3">
                {address && <Text color="#747474">{address.postcode}</Text>}
              </Box>
            </Box>
            <Text ml="1" my="1" fontSize="13" color="#828773">
              Coordinates
            </Text>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              height="10"
              bg="#fff"
              p="2"
              bgColor="#fff"
              borderRadius="3"
              mb="1"
            >
              <Box flex="1">
                <Text fontWeight="500">latitude</Text>
              </Box>
              <Box flex="3">
                {address && <Text color="#747474">{address.latitude}</Text>}
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              height="10"
              bg="#fff"
              p="2"
              bgColor="#fff"
              borderRadius="3"
              mb="1"
            >
              <Box flex="1">
                <Text fontWeight="500">longitude</Text>
              </Box>
              <Box flex="3">
                {address && <Text color="#747474">{address.longitude}</Text>}
              </Box>
            </Box>
          </Box>
        )}
        {!address && (
          <Box ml="3" mr="1">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              height="10"
              p="2"
              bg="#fff"
              borderRadius="3"
              mb="1"
            >
              <Box flex="1" alignItems="center">
                <Text color="#747474">location not set</Text>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box alignItem="center" justifyContent="center">
        <Entypo name="chevron-small-right" size={20} color="#afb7c5" />
      </Box>
    </Pressable>
  );
}

export default AddressTab;
