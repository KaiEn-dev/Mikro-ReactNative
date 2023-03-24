import {
  Box,
  Button,
  Text,
  ScrollView,
  Switch,
  Modal,
  Center,
  Pressable,
} from "native-base";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Entypo } from "@expo/vector-icons";

function ScheduleCard({ schedule, orderMode, navigation }) {
  return (
    <Pressable
      mx="5"
      mt="4"
      p="5"
      bg="#e7f0df"
      borderRadius="3"
      display="flex"
      flexDirection="row"
      shadow="1"
      _pressed={{ bg: "#E0E9D8" }}
      onPress={() =>
        navigation.navigate("ScheduleForm", {
          orderMode: orderMode,
          schedule: schedule,
        })
      }
    >
      <Box w="100%">
        <Box flexDirection="row">
          <Box flex="1" bg="#fff" p="2" borderRadius="full" mr="7">
            <Text textAlign="center" color="#3D4F21" fontWeight="700">
              {schedule.day}
            </Text>
          </Box>
          <Box flex="1" bg="#fff" p="2" borderRadius="full">
            <Text textAlign="center" color="#3D4F21" fontWeight="700">
              {schedule.date}
            </Text>
          </Box>
        </Box>
        <Center
          flexDirection="row"
          mt="3"
          flexWrap="wrap"
          bg="#fff"
          borderRadius="full"
          p="2"
        >
          {schedule.time.map((slot) => {
            return (
              <Text
                color="#7D9253"
                key={_.uniqueId("timeslot")}
                mx="2"
                my="1"
                fontWeight="500"
              >
                {slot}
              </Text>
            );
          })}
        </Center>
      </Box>
      <Box alignItem="center" justifyContent="center">
        <Entypo name="chevron-small-right" size={20} color="#afb7c5" />
      </Box>
    </Pressable>
  );
}

export default ScheduleCard;
