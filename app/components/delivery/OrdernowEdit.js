import { Box, Button, Text, ScrollView, Switch, Modal } from "native-base";
import React, { useState, useEffect } from "react";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

function OrdernowEdit({ route, navigation }) {
  const endpoint = "/orderMode/";
  const { orderMode } = route.params;

  const [status, setStatus] = useState(false);
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState();

  useEffect(() => {
    if (orderMode.order_now == 1) {
      setStatus(true);
    }
  }, []);

  const checkData = () => {
    let newdata = [];
    if (status == false && orderMode.preorder == 0) {
      newdata = newdata.concat(
        "At least one between ordernow/preorder modes must be active at all time!"
      );
    }

    if (newdata.length == 0) {
      setInfo(newdata);
      sendData();
    } else {
      setInfo(newdata);
      setShow(true);
    }
  };

  const handleSave = (e) => {
    checkData();
  };

  const sendData = () => {
    let n;
    if (status) {
      n = 1;
    } else {
      n = 0;
    }

    let newdata = {
      orderMode: {
        shop_id: orderMode.shop_id,
        order_now: n,
        preorder: orderMode.preorder,
        preorder_option: orderMode.preorder_option,
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
        }
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
      <Box mx="5" mt="4" p="5" bg="#e7f0df" borderRadius="3" shadow="1">
        <Box w="100%">
          <Box
            w="100%"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
              Order now
            </Text>
            <Box flex="1" alignItems="flex-end">
              <Switch
                offTrackColor="#BEC4AA"
                onTrackColor="#3D4F21"
                size="sm"
                value={status}
                onValueChange={(value) => setStatus(value)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width="100%" alignItems="flex-end" mt="5" mb="20">
        <Button
          onPress={() => handleSave()}
          bg="#2b342d"
          mr="5"
          _pressed={{ bg: "#3D4F21" }}
        >
          save
        </Button>
      </Box>
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

export default OrdernowEdit;
