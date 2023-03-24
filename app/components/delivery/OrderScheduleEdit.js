import { Box, Button, Text, ScrollView, Progress, Center } from "native-base";
import React, { useState, useEffect } from "react";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import _ from "lodash";
import ScheduleCard from "./ScheduleCard";

function OrderScheduleEdit({ navigation }) {
  const endpoint = "/orderMode/shop/";
  const [orderMode, setOrderMode] = useState();
  const [schedule, setSchedule] = useState();
  const [loading, setLoading] = useState(0);

  const getOrderMode = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.orderMode;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        } else {
          setOrderMode(data[0]);
          if (data[0].preorder_option) {
            setSchedule(JSON.parse(data[0].preorder_option));
          }
        }
      }
    });
  };

  useEffect(() => {
    getOrderMode();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (loading !== 100) {
        setLoading(loading + 1);
      }
    }, 0.2);
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getOrderMode();
      setLoading(0);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Box flex="1">
      <Box flex="1">
        {loading !== 100 && (
          <Center h="70%">
            <Box w="25%">
              <Text textAlign="center" mb="1" color="#BABABA">
                Mikro
              </Text>
              <Progress
                value={loading}
                mt="0"
                size="xs"
                bg="#FFFFFF"
                _filledTrack={{ bg: "#DFDFDF" }}
              />
            </Box>
          </Center>
        )}
        {loading == 100 && !schedule && (
          <Center h="70%">
            <MaterialCommunityIcons
              name="calendar-question"
              size={24}
              color="#989898"
            />
            <Text mt="1" color="#989898">
              Schedule is empty
            </Text>
          </Center>
        )}
        {loading == 100 && schedule && (
          <ScrollView>
            {schedule.option.map((day) => {
              return (
                <ScheduleCard
                  key={_.uniqueId("sCard")}
                  schedule={day}
                  orderMode={orderMode}
                  navigation={navigation}
                />
              );
            })}
          </ScrollView>
        )}
      </Box>
      {loading == 100 && (
        <Button
          borderColor="#fff"
          borderWidth="2"
          m="5"
          position="absolute"
          bottom="0"
          right="0"
          borderRadius="full"
          bg="#3D4F21"
          _pressed={{ bg: "#4E652B" }}
          onPress={() =>
            navigation.navigate("AddScheduleForm", {
              orderMode: orderMode,
            })
          }
        >
          <MaterialIcons name="add" size={30} color="#fff" />
        </Button>
      )}
    </Box>
  );
}

export default OrderScheduleEdit;
