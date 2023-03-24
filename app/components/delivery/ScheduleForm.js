import {
  Box,
  Button,
  Input,
  Text,
  Pressable,
  ScrollView,
  Switch,
  Center,
  Modal,
  Select,
} from "native-base";
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Keyboard } from "react-native";
import _ from "lodash";
import { FontAwesome, Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import DatePicker from "react-native-datepicker";
import { LogBox } from "react-native";

function ScheduleForm({ navigation, route }) {
  const endpoint = "/orderMode/";
  const { orderMode, schedule } = route.params;
  const [date, setDate] = useState(schedule.date);
  const [day, setDay] = useState(schedule.day);
  const [time, setTime] = useState(schedule.time);
  const [remove, setRemove] = useState(false);
  const [showTP, setShowTP] = useState(false);
  const [error, setError] = useState(false);

  function getToday() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const getDayStr = (dateStr) => {
    let newday = new Date(dateStr);
    let n = newday.getDay();
    if (n == 0) {
      return "sun";
    }
    if (n == 1) {
      return "mon";
    }
    if (n == 2) {
      return "tue";
    }
    if (n == 3) {
      return "wed";
    }
    if (n == 4) {
      return "thu";
    }
    if (n == 5) {
      return "fri";
    }
    if (n == 6) {
      return "sat";
    }
  };

  useEffect(() => {
    setDay(getDayStr(date));
  }, [date]);

  useEffect(() => {
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
  }, []);

  const handleAddTime = (value) => {
    setShowTP(false);
    setTime(sortTime(value));
  };

  const sortTime = (value) => {
    let newdata = [];
    //remove same time
    for (let item of time) {
      if (item !== value) {
        newdata = newdata.concat(item);
      }
    }
    newdata = newdata.concat(value);
    newdata = _.sortBy(newdata);
    return newdata;
  };

  const handleDeleteTime = (value) => {
    let newdata = time.slice();
    newdata = _.remove(newdata, (n) => {
      return n !== value;
    });

    if (newdata.length == 0) {
      setRemove(false);
    }

    setTime(newdata);
  };

  const handleSubmit = () => {
    if (checkData()) {
      let newdata = sortOM();
      sendData(newdata);
    }
  };

  const checkData = () => {
    if (time.length == 0) {
      setError(true);
      return false;
    } else {
      return true;
    }
  };

  const sortOM = () => {
    let newdata = { date: date, day: day, time: time };
    //remove same date
    let newschedule = JSON.parse(orderMode.preorder_option).option;
    newschedule = _.remove(newschedule, (n) => {
      return n.date !== date;
    });
    //push data
    newschedule = newschedule.concat(newdata);
    //sort data
    newschedule = _.sortBy(newschedule, ["date"]);
    return newschedule;
  };

  const removeOM = () => {
    let newdata = JSON.parse(orderMode.preorder_option).option;
    newdata = _.remove(newdata, (n) => {
      return n.date !== date;
    });
    if (newdata.length == 0) {
      newdata = null;
    }
    let uploaddata = {
      orderMode: {
        shop_id: orderMode.shop_id,
        order_now: orderMode.order_now,
        preorder: orderMode.preorder,
        preorder_option: JSON.stringify({ option: newdata }),
      },
    };
    if (newdata == null) {
      uploaddata.orderMode.order_now = 1;
      uploaddata.orderMode.preorder = 0;
      uploaddata.orderMode.preorder_option = null;
    }
    updateOrderMode(uploaddata);
  };

  const sendData = (data) => {
    let newdata = {
      orderMode: {
        shop_id: orderMode.shop_id,
        order_now: orderMode.order_now,
        preorder: orderMode.preorder,
        preorder_option: JSON.stringify({ option: data }),
      },
    };

    updateOrderMode(newdata);
  };

  const updateOrderMode = (newdata) => {
    apiClient.put(endpoint + orderMode.om_id, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.orderMode;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          console.log("updated!");
          Toast.show({
            type: "success",
            text1: "Data Update",
            text2: "order mode updated!",
          });
          navigation.navigate("Home");
        }
      }
    });
  };
  return (
    <ScrollView>
      <Center
        mx="5"
        mt="4"
        p="5"
        bg="#e7f0df"
        borderRadius="3"
        display="flex"
        flexDirection="row"
        shadow="1"
      >
        <Box w="100%">
          <Box>
            <Box flexDirection="row" alignItems="center" p="2">
              <Text fontWeight="bold" fontSize="16" color="#3D4F21" mr="2">
                Day / Date
              </Text>
              <Entypo name="calendar" size={22} color="#3D4F21" />
            </Box>
            <Box
              bg="#fff"
              flexDirection="row"
              p="3"
              borderRadius="5"
              _pressed={{ bg: "#FAFAFA" }}
              alignItems="center"
            >
              <Text
                flex="1"
                textAlign="center"
                fontWeight="500"
                color="#7D9253"
              >
                {day}
              </Text>
              <DatePicker
                date={date}
                mode="date"
                format="YYYY-MM-DD"
                minDate={getToday()}
                maxDate={"2022-12-31"}
                confirmBtnText="Done"
                cancelBtnText="Cancel"
                onDateChange={(value) => setDate(value)}
                iconComponent={<></>}
                customStyles={{
                  dateInput: { borderWidth: "0" },
                  dateText: { fontWeight: "500", color: "#7D9253" },
                  dateTouchBody: { flex: "1" },
                  btnTextConfirm: { color: "#5C5C5C" },
                  datePicker: { backgroundColor: "#2B342D" },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Center>
      <Center
        mx="5"
        mt="4"
        p="5"
        bg="#e7f0df"
        borderRadius="3"
        display="flex"
        flexDirection="row"
        shadow="1"
      >
        <Box w="100%">
          <Box>
            <Box flexDirection="row" alignItems="center" p="2" mb="1">
              <Text fontWeight="bold" fontSize="16" color="#3D4F21" mr="2">
                Time
              </Text>
              <AntDesign name="clockcircle" size={20} color="#3D4F21" />
            </Box>

            {time && (
              <Box>
                {time.map((value) => {
                  return (
                    <Box
                      bg="#fff"
                      flexDirection="row"
                      p="3"
                      borderRadius="5"
                      _pressed={{ bg: "#FAFAFA" }}
                      alignItems="center"
                      justifyContent="center"
                      mb="1"
                      key={_.uniqueId("timebox")}
                    >
                      <Text
                        flex="1"
                        textAlign="center"
                        fontWeight="500"
                        color="#7D9253"
                      >
                        {value}
                      </Text>
                      {remove && (
                        <Button
                          bg="transparent"
                          _pressed={{ bg: "#F7F7F7" }}
                          onPress={() => handleDeleteTime(value)}
                        >
                          <Ionicons name="trash" size={16} color="#EE0000" />
                        </Button>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}

            <Center flexDirection="row">
              <Box flex="1">
                {time && time.length !== 0 && (
                  <Button
                    bg="transparent"
                    w="40%"
                    _pressed={{ bg: "#E0E9D8" }}
                    onPress={() => setRemove(!remove)}
                    justifyContent="flex-start"
                  >
                    {remove && <Text color="#000">cancel</Text>}
                    {!remove && (
                      <Ionicons name="remove" size={24} color="black" />
                    )}
                  </Button>
                )}
              </Box>
              <Box flex="1" alignItems="flex-end">
                {!remove && (
                  <Button
                    bg="transparent"
                    w="30%"
                    _pressed={{ bg: "#E0E9D8" }}
                    onPress={() => setShowTP(true)}
                  >
                    <Ionicons name="add" size={24} color="black" />
                  </Button>
                )}
              </Box>
            </Center>
          </Box>
        </Box>
      </Center>
      <Box
        width="100%"
        flexDirection="row"
        justifyContent="space-between"
        mt="5"
        mb="20"
        px="5"
      >
        <Button
          onPress={() => removeOM()}
          bg="#EA0000"
          mr="5"
          _pressed={{ bg: "#FF0000" }}
        >
          delete
        </Button>
        <Button
          onPress={() => handleSubmit()}
          bg="#2b342d"
          _pressed={{ bg: "#3D4F21" }}
        >
          save
        </Button>
      </Box>

      <Modal isOpen={showTP} onClose={() => setShowTP(false)}>
        <Modal.Content maxWidth="60%" bg="#2B342D">
          <Modal.Body m="3" alignItems="center" justifyContent="center">
            <Text color="#fff" fontWeight="600">
              select time
            </Text>
            <Box mt="8">
              <DatePicker
                mode="time"
                confirmBtnText="Done"
                cancelBtnText="Cancel"
                onDateChange={(value) => handleAddTime(value)}
                iconComponent={<></>}
                customStyles={{
                  dateInput: {
                    borderWidth: "0",
                    backgroundColor: "#fff",
                    borderRadius: "3",
                  },
                  dateText: { fontWeight: "500", color: "#A5A5A5" },
                  dateTouchBody: { height: "30%" },
                  btnTextConfirm: { color: "#5C5C5C" },
                  datePicker: { backgroundColor: "#2B342D" },
                }}
              />
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={error} onClose={() => setError(false)}>
        <Modal.Content maxWidth="50%" bg="#2B342D">
          <Modal.Body m="3" alignItems="center" justifyContent="center">
            <Ionicons name="warning-sharp" size={24} color="#fff" />
            <Text mt="3" textAlign="center" color="#fff" fontWeight="600">
              please select time to proceed
            </Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
}

export default ScheduleForm;
