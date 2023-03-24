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
} from "native-base";
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Keyboard } from "react-native";
import _ from "lodash";
import { Ionicons } from "@expo/vector-icons";

const pickupSchema = yup.object().shape({
  pickupTime: yup
    .string()
    .nullable()
    .matches(/^[0-9]+$/, "can only have numbers")
    .max(2, "time out of range"),
});

function PickupEdit({ route, navigation }) {
  const endpoint = "/address/shop/";
  const updatePoint = "/deliveryMode/";
  const [address, setAddress] = useState();
  const { deliveryMode } = route.params;
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState();

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
          setAddress(null);
        }
        setAddress(data[0]);
      }
    });
  };

  useEffect(() => {
    getAddress();
  }, []);

  const getInitialTime = () => {
    if (deliveryMode.pickup_time) {
      let pTime = JSON.parse(deliveryMode.pickup_time).estimate.value;
      return JSON.stringify(pTime);
    } else {
      return null;
    }
  };

  const handleUpdateDelivery = (values) => {
    console.log(values);
    checkData(values);
  };

  const checkData = (values) => {
    let newdata = [];
    if (address == null) {
      newdata = newdata.concat(
        "Please set up shop address before activating pickup"
      );
    }
    if (values.pickup == false && deliveryMode.delivery == 0) {
      newdata = newdata.concat(
        "At least one between delivery/pickup modes must be active at all time!"
      );
    }
    // if (
    //   values.pickup == true &&
    //   (values.pickupTime == null || values.pickupTime == "")
    // ) {
    //   newdata = newdata.concat(
    //     "Estimated time must be set before activating pickup!"
    //   );
    // }
    if (newdata.length == 0) {
      setInfo(newdata);
      sendData(values);
    } else {
      setInfo(newdata);
      setShow(true);
    }
  };

  const sendData = (data) => {
    let time;
    if (data.pickupTime == null || data.pickupTime == "") {
      time = null;
    } else {
      time = {
        estimate: { type: "minutes", value: parseInt(data.pickupTime) },
      };
      time = JSON.stringify(time);
    }

    let n;
    if (data.pickup) {
      n = 1;
    } else {
      n = 0;
    }

    let pt = {
      estimate: { type: "minutes", value: parseInt(data.pickupTime) },
    };
    let newdata = {
      deliveryMode: {
        shop_id: deliveryMode.shop_id,
        delivery: deliveryMode.delivery,
        delivery_time: deliveryMode.pickup_time,
        pickup: n,
        pickup_time: time,
      },
    };
    updateArea(newdata);
  };

  const updateArea = (newdata) => {
    apiClient
      .put(updatePoint + deliveryMode.dm_id, newdata)
      .then((response) => {
        if (!response.ok) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "http request failed",
          });
        } else {
          const data = response.data.deliveryMode;
          if (data.length == 0) {
            Toast.show({
              type: "error",
              text1: "Data Update Error",
              text2: "data unavailable",
            });
          }
          console.log("updated!");
          navigation.navigate("Home");
          Toast.show({
            type: "success",
            text1: "Data Update",
            text2: "profile updated!",
          });
        }
      });
  };

  return (
    <ScrollView>
      <Pressable
        onPress={() => Keyboard.dismiss()}
        bg="#F3F3F3"
        flex={1}
        alignItems="center"
      >
        <Formik
          validateOnChange={false}
          validateOnBlur={true}
          validationSchema={pickupSchema}
          initialValues={{
            pickup: deliveryMode.pickup == 1 && true,
            pickupTime: getInitialTime(),
          }}
          onSubmit={(values) => handleUpdateDelivery(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
          }) => (
            <>
              <Box mx="5" mt="4" p="5" bg="#e7f0df" borderRadius="3" shadow="1">
                <Box w="100%">
                  <Box
                    w="100%"
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                  >
                    <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                      Pickup
                    </Text>
                    <Box flex="1" alignItems="flex-end">
                      <Switch
                        offTrackColor="#BEC4AA"
                        onTrackColor="#3D4F21"
                        size="sm"
                        value={values.pickup}
                        onValueChange={(value) =>
                          setFieldValue("pickup", value)
                        }
                      />
                    </Box>
                  </Box>
                  <Center mt="3" w="100%" display="flex" flexDirection="row">
                    <Input
                      flex="3"
                      autoCorrect={false}
                      placeholder="estimated time"
                      value={values.pickupTime}
                      onChangeText={handleChange("pickupTime")}
                      onBlur={handleBlur("pickupTime")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    <Text textAlign="right" flex="1" mr="2">
                      minutes
                    </Text>
                    {errors.pickupTime && touched.pickupTime && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.pickupTime}
                        </Text>
                      </Box>
                    )}
                  </Center>
                </Box>
              </Box>
              <Box width="100%" alignItems="flex-end" mt="5" mb="20">
                <Button
                  onPress={handleSubmit}
                  bg="#2b342d"
                  mr="5"
                  _pressed={{ bg: "#3D4F21" }}
                >
                  save
                </Button>
              </Box>
            </>
          )}
        </Formik>
      </Pressable>
      <Modal isOpen={show} onClose={() => setShow(false)}>
        <Modal.Content maxWidth="60%" bg="#2B342D">
          <Modal.Body m="3" alignItems="center" justifyContent="center">
            <Ionicons name="warning" size={24} color="#fff" />
            <Text textAlign="center" mt="3" color="#fff">
              {info &&
                info.map((i) => {
                  return (
                    <Box key={_.uniqueId(info)} flexDirection="row" mb="1">
                      <Text color="#fff" mr="1">
                        -
                      </Text>
                      <Text color="#fff" textAlign="left">
                        {i}
                      </Text>
                    </Box>
                  );
                })}
            </Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
}

export default PickupEdit;
