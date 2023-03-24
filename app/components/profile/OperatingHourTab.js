import { Box, Image, Pressable, Text } from "native-base";
import React, { useState, useEffect } from "react";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

function OperatingHourTab({ navigation }) {
  const endpoint = "/operatingHour/shop/";
  const [operatingHour, setOperatingHour] = useState();

  const getOperatingHour = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.operatingHour;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        }
        setOperatingHour(data[0]);
      }
    });
  };

  useEffect(() => {
    getOperatingHour();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getOperatingHour();
    });
    return unsubscribe;
  }, [navigation]);

  const displayHours = (day, open, close) => {
    let info;
    if (day) {
      let start = open.slice(0, -3);
      let stop = close.slice(0, -3);
      info = start + " - " + stop;
    } else {
      info = "close";
    }
    return info;
  };

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
      onPress={() => {
        navigation.navigate("EditOperatingHour", {
          operatingHour: operatingHour,
        });
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
            Operating Hour
          </Text>
          <MaterialCommunityIcons name="clock" size={22} color="#607040" />
        </Box>
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
            <Box flex="2">
              <Text fontWeight="500">monday</Text>
            </Box>
            <Box flex="5">
              {operatingHour && (
                <Text color="#747474">
                  {displayHours(
                    operatingHour.mon,
                    operatingHour.mon_open,
                    operatingHour.mon_close
                  )}
                </Text>
              )}
            </Box>
          </Box>
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
            <Box flex="2">
              <Text fontWeight="500">tuesday</Text>
            </Box>
            <Box flex="5">
              {operatingHour && (
                <Text color="#747474">
                  {displayHours(
                    operatingHour.tues,
                    operatingHour.tues_open,
                    operatingHour.tues_close
                  )}
                </Text>
              )}
            </Box>
          </Box>
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
            <Box flex="2">
              <Text fontWeight="500">wednesday</Text>
            </Box>
            <Box flex="5">
              {operatingHour && (
                <Text color="#747474">
                  {displayHours(
                    operatingHour.wed,
                    operatingHour.wed_open,
                    operatingHour.wed_close
                  )}
                </Text>
              )}
            </Box>
          </Box>
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
            <Box flex="2">
              <Text fontWeight="500">thursday</Text>
            </Box>
            <Box flex="5">
              {operatingHour && (
                <Text color="#747474">
                  {displayHours(
                    operatingHour.thur,
                    operatingHour.thur_open,
                    operatingHour.thur_close
                  )}
                </Text>
              )}
            </Box>
          </Box>
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
            <Box flex="2">
              <Text fontWeight="500">friday</Text>
            </Box>
            <Box flex="5">
              {operatingHour && (
                <Text color="#747474">
                  {displayHours(
                    operatingHour.fri,
                    operatingHour.fri_open,
                    operatingHour.fri_close
                  )}
                </Text>
              )}
            </Box>
          </Box>
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
            <Box flex="2">
              <Text fontWeight="500">saturday</Text>
            </Box>
            <Box flex="5">
              {operatingHour && (
                <Text color="#747474">
                  {displayHours(
                    operatingHour.sat,
                    operatingHour.sat_open,
                    operatingHour.sat_close
                  )}
                </Text>
              )}
            </Box>
          </Box>
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
            <Box flex="2">
              <Text fontWeight="500">sunday</Text>
            </Box>
            <Box flex="5">
              {operatingHour && (
                <Text color="#747474">
                  {displayHours(
                    operatingHour.sun,
                    operatingHour.sun_open,
                    operatingHour.sun_close
                  )}
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box alignItem="center" justifyContent="center">
        <Entypo name="chevron-small-right" size={20} color="#afb7c5" />
      </Box>
    </Pressable>
  );
}

export default OperatingHourTab;
