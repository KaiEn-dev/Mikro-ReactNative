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

const deliverySchema = yup.object().shape({
  deliveryTime: yup
    .string()
    .nullable()
    .matches(/^[0-9]+$/, "can only have numbers")
    .max(2, "time out of range"),
});

function DeliveryEdit({ route, navigation }) {
  const endpoint = "/deliveryArea/shop/";
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
        const data = response.data.deliveryArea;
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
    if (deliveryMode.delivery_time) {
      let dTime = JSON.parse(deliveryMode.delivery_time).estimate.value;
      return JSON.stringify(dTime);
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
        "Please set up delivery area before activating delivery"
      );
    }
    if (values.delivery == false && deliveryMode.pickup == 0) {
      newdata = newdata.concat(
        "At least one between delivery/pickup modes must be active at all time!"
      );
    }
    // if (
    //   values.delivery == true &&
    //   (values.deliveryTime == null || values.deliveryTime == "")
    // ) {
    //   newdata = newdata.concat(
    //     "Estimated time must be set before activating delivery!"
    //   );
    // }
    if (newdata.length == 0) {
      setInfo(newdata);
      console.log("ready to update!");
      sendData(values);
    } else {
      setInfo(newdata);
      setShow(true);
    }
  };

  const sendData = (data) => {
    let time;
    if (data.deliveryTime == null || data.deliveryTime == "") {
      time = null;
    } else {
      time = {
        estimate: { type: "minutes", value: parseInt(data.deliveryTime) },
      };
      time = JSON.stringify(time);
    }

    let n;
    if (data.delivery) {
      n = 1;
    } else {
      n = 0;
    }

    let dt = {
      estimate: { type: "minutes", value: parseInt(data.deliveryTime) },
    };
    let newdata = {
      deliveryMode: {
        shop_id: deliveryMode.shop_id,
        delivery: n,
        delivery_time: time,
        pickup: deliveryMode.pickup,
        pickup_time: deliveryMode.pickup_time,
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
          validationSchema={deliverySchema}
          initialValues={{
            delivery: deliveryMode.delivery == 1 && true,
            deliveryTime: getInitialTime(),
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
                      Delivery
                    </Text>
                    <Box flex="1" alignItems="flex-end">
                      <Switch
                        offTrackColor="#BEC4AA"
                        onTrackColor="#3D4F21"
                        size="sm"
                        value={values.delivery}
                        onValueChange={(value) =>
                          setFieldValue("delivery", value)
                        }
                      />
                    </Box>
                  </Box>
                  <Center mt="3" w="100%" display="flex" flexDirection="row">
                    <Input
                      flex="3"
                      autoCorrect={false}
                      placeholder="estimated time"
                      value={values.deliveryTime}
                      onChangeText={handleChange("deliveryTime")}
                      onBlur={handleBlur("deliveryTime")}
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
                    {errors.deliveryTime && touched.deliveryTime && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.deliveryTime}
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

export default DeliveryEdit;
