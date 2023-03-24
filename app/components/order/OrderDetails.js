import {
  Box,
  Text,
  Center,
  ScrollView,
  TextArea,
  Modal,
  Button,
} from "native-base";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import GLOBAL from "../../global";
import _ from "lodash";

function OrderDetails({ route }) {
  const endpoint = "/customerOrder/";
  const { order } = route.params;
  const [items, setItems] = useState(JSON.parse(order.items));
  const [moreDetails, setMoreDetails] = useState(false);
  const [show, setShow] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const getShowMore = (m) => {
    if (m == false) {
      return "show more";
    }
    if (m == true) {
      return "show less";
    }
  };

  const handleUpdateOrder = (value) => {
    sendData(value);
  };

  const sendData = (value) => {
    let newdata = {
      customerOrder: {
        customer_info: order.customer_info,
        delivery_method: order.delivery_method,
        order_method: order.order_method,
        schedule: order.schedule,
        date: order.date,
        time: order.time,
        items: order.items,
        payment_method: order.payment_method,
        total_price: order.total_price,
        status: value,
      },
    };

    updateOrder(newdata, value);
  };

  const updateOrder = (newdata, value) => {
    apiClient.put(endpoint + order.order_id, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.customerOrder;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          setCurrentStatus(value);
          setShow(false);
        }
      }
    });
  };

  const getStatusBg = (status) => {
    if (status == "pending") {
      return "#FBBC05";
    }
    if (status == "preparing") {
      return "#4285F4";
    }
    if (status == "cancelled") {
      return "#EA4335";
    }
    if (status == "complete") {
      return "#3DA853";
    }
  };

  const getStatusIcon = (status) => {
    if (status == "pending") {
      return "account-clock";
    }
    if (status == "preparing") {
      return "timer-sand";
    }
    if (status == "cancelled") {
      return "close-circle";
    }
    if (status == "complete") {
      return "check-circle";
    }
  };

  const getPressedBg = (status) => {
    if (status == "pending") {
      return { bg: "#EBB005" };
    }
    if (status == "preparing") {
      return { bg: "#3B7AE3" };
    }
    if (status == "cancelled") {
      return { bg: "#D23C30" };
    }
    if (status == "complete") {
      return { bg: "#369649" };
    }
  };

  const getOrderDate = () => {
    let date = order.date;
    let time = order.time;
    date = date.slice(0, 10);
    time = time.slice(0, 5);
    return (
      <Box flex="1" flexDirection="row">
        <Text fontWeight="500" color="#7D9253">
          {date}
        </Text>
        <Text fontWeight="500" color="#7D9253" ml="2">
          {time}
        </Text>
      </Box>
    );
  };

  const getSchedule = () => {
    let date = JSON.parse(order.schedule).date;
    let time = JSON.parse(order.schedule).time;
    return (
      <Box flex="1" flexDirection="row">
        <Text fontWeight="500" color="#7D9253">
          {date}
        </Text>
        <Text fontWeight="500" color="#7D9253" ml="2">
          {time}
        </Text>
      </Box>
    );
  };

  const displayDetails = (selections) => {
    return (
      <Box>
        {selections.map((selection) => {
          return (
            selection.selection.length > 0 && (
              <Box my="2" ml="1" key={_.uniqueId("details")}>
                <Text color="grey" fontSize="11">
                  {selection.name}
                </Text>
                {selection.selection.map((attribute) => {
                  return (
                    <Text
                      key={_.uniqueId("attname")}
                      color="grey"
                      fontSize="11"
                    >
                      -{attribute.name}
                    </Text>
                  );
                })}
              </Box>
            )
          );
        })}
      </Box>
    );
  };

  return (
    <Box flex="1" bg="#EBEBEB" alignItems="center" p="4">
      <ScrollView flex="1" w="100%">
        <Box flex="1" bg="#fff" borderRadius="3" p="5" shadow="1">
          <Box flexDirection="row" mt="2" mb="5">
            <Box flex="2">
              <Text fontSize="25" fontWeight="bold" color="#000">
                Order #{order.order_id}
              </Text>
            </Box>
            <Box flex="1">
              <Button
                bg={getStatusBg(currentStatus)}
                flexDirection="row"
                borderRadius="full"
                borderWidth="1"
                borderColor="#F2F2F2"
                px="1"
                py="2"
                _pressed={getPressedBg(currentStatus)}
                onPress={() => setShow(true)}
              >
                <Box flexDirection="row">
                  <Text mr="1" color="#fff" fontWeight="bold">
                    {currentStatus}
                  </Text>
                  <MaterialCommunityIcons
                    name={getStatusIcon(currentStatus)}
                    size={20}
                    color="#fff"
                  />
                </Box>
              </Button>
            </Box>
          </Box>
          <Box flexDirection="row" mb="1">
            <Text fontSize="15" mx="2" fontWeight="bold" color="#3D4F21">
              Order details
            </Text>
            <MaterialCommunityIcons
              name="book-information-variant"
              size={20}
              color="#3D4F21"
            />
          </Box>
          <Box bg="#E7F0DF" borderRadius="3" p="3">
            <Box bg="#fff" p="2" borderRadius="3" flexDirection="row" mb="1">
              <Text flex="1">delivery method</Text>
              <Text flex="1" color="#7D9253" fontWeight="500">
                {order.delivery_method}
              </Text>
            </Box>
            <Box bg="#fff" p="2" borderRadius="3" flexDirection="row" mb="1">
              <Text flex="1">order method</Text>
              <Text flex="1" color="#7D9253" fontWeight="500">
                {order.order_method}
              </Text>
            </Box>
            <Box bg="#fff" p="2" borderRadius="3" flexDirection="row" mb="1">
              <Text flex="1">order date</Text>
              {getOrderDate()}
            </Box>
            {order.schedule !== "NULL" && (
              <Box bg="#fff" p="2" borderRadius="3" flexDirection="row" mb="1">
                <Text flex="1">scheduled date</Text>
                {getSchedule()}
              </Box>
            )}
          </Box>
          <Box flexDirection="row" mb="1" mt="5">
            <Text fontSize="15" mx="2" fontWeight="bold" color="#3D4F21">
              Order summary
            </Text>
            <MaterialCommunityIcons
              name="clipboard-text"
              size={20}
              color="#3D4F21"
            />
          </Box>
          <Box bg="#E7F0DF" borderRadius="3" p="3">
            <Box bg="#fff" p="2" borderRadius="3" mb="1">
              {items.map((item) => {
                return (
                  <Box key={_.uniqueId("pd")} my="1">
                    <Box w="100%" flexDirection="row">
                      <Text flex="2">{item.product.product_name}</Text>
                      <Text flex="1">x{item.quantity}</Text>
                      <Text flex="1" textAlign="right">
                        {item.price}
                      </Text>
                    </Box>
                    {moreDetails && displayDetails(item.selections)}
                  </Box>
                );
              })}
            </Box>
            <Box bg="#fff" p="2" borderRadius="3" mb="1" flexDirection="row">
              <Text color="#929292" flex="3" textAlign="right">
                Total:{" "}
              </Text>
              <Text flex="1" textAlign="right" fontWeight="500">
                Rm {order.total_price}
              </Text>
            </Box>
            <Text
              mt="2"
              onPress={() => setMoreDetails(!moreDetails)}
              textAlign="right"
              fontSize="12"
              color="#7D9253"
            >
              {getShowMore(moreDetails)}
            </Text>
          </Box>
          <Box flexDirection="row" mb="1" mt="5">
            <Text fontSize="15" mx="2" fontWeight="bold" color="#3D4F21">
              Customer info
            </Text>
            <AntDesign name="customerservice" size={20} color="#3D4F21" />
          </Box>
          <Box bg="#E7F0DF" borderRadius="3" p="3">
            <Box bg="#fff" p="2" borderRadius="3" mb="1" flexDirection="row">
              <Text flex="1">name</Text>
              <Text flex="2" color="#7D9253" fontWeight="500">
                {JSON.parse(order.customer_info).name}
              </Text>
            </Box>
            <Box bg="#fff" p="2" borderRadius="3" mb="1" flexDirection="row">
              <Text flex="1">email</Text>
              <Text flex="2" color="#7D9253" fontWeight="500">
                {JSON.parse(order.customer_info).email}
              </Text>
            </Box>
            <Box bg="#fff" p="2" borderRadius="3" mb="1" flexDirection="row">
              <Text flex="1">phone</Text>
              <Text flex="2" color="#7D9253" fontWeight="500">
                {JSON.parse(order.customer_info).phone}
              </Text>
            </Box>
            <Box bg="#fff" p="2" borderRadius="3" mb="1" flexDirection="row">
              <Text flex="1">address</Text>
              <Text flex="2" color="#7D9253" fontWeight="500">
                {JSON.parse(order.customer_info).address}
              </Text>
            </Box>
            <Box bg="#fff" p="2" borderRadius="3" mb="1" flexDirection="row">
              <Text flex="1">postcode</Text>
              <Text flex="2" color="#7D9253" fontWeight="500">
                {JSON.parse(order.customer_info).postcode}
              </Text>
            </Box>
          </Box>
        </Box>
      </ScrollView>
      <Modal isOpen={show} onClose={() => setShow(false)}>
        <Modal.Content maxWidth="60%" backgroundColor="transparent">
          <Modal.Body m="3" alignItems="center" justifyContent="center">
            <Button
              my="1"
              w="75%"
              bg={getStatusBg("pending")}
              flexDirection="row"
              borderRadius="full"
              borderWidth="1"
              borderColor="#F2F2F2"
              px="1"
              py="2"
              _pressed={getPressedBg("pending")}
              onPress={() => handleUpdateOrder("pending")}
            >
              <Box flexDirection="row">
                <Text mr="1" color="#fff" fontWeight="bold">
                  pending
                </Text>
                <MaterialCommunityIcons
                  name={getStatusIcon("pending")}
                  size={20}
                  color="#fff"
                />
              </Box>
            </Button>
            <Button
              my="1"
              w="75%"
              bg={getStatusBg("preparing")}
              flexDirection="row"
              borderRadius="full"
              borderWidth="1"
              borderColor="#F2F2F2"
              px="1"
              py="2"
              _pressed={getPressedBg("preparing")}
              onPress={() => handleUpdateOrder("preparing")}
            >
              <Box flexDirection="row">
                <Text mr="1" color="#fff" fontWeight="bold">
                  preparing
                </Text>
                <MaterialCommunityIcons
                  name={getStatusIcon("preparing")}
                  size={20}
                  color="#fff"
                />
              </Box>
            </Button>
            <Button
              my="1"
              w="75%"
              bg={getStatusBg("complete")}
              flexDirection="row"
              borderRadius="full"
              borderWidth="1"
              borderColor="#F2F2F2"
              px="1"
              py="2"
              _pressed={getPressedBg("complete")}
              onPress={() => handleUpdateOrder("complete")}
            >
              <Box flexDirection="row">
                <Text mr="1" color="#fff" fontWeight="bold">
                  complete
                </Text>
                <MaterialCommunityIcons
                  name={getStatusIcon("complete")}
                  size={20}
                  color="#fff"
                />
              </Box>
            </Button>
            <Button
              my="1"
              w="75%"
              bg={getStatusBg("cancelled")}
              flexDirection="row"
              borderRadius="full"
              borderWidth="1"
              borderColor="#F2F2F2"
              px="1"
              py="2"
              _pressed={getPressedBg("cancelled")}
              onPress={() => handleUpdateOrder("cancelled")}
            >
              <Box flexDirection="row">
                <Text mr="1" color="#fff" fontWeight="bold">
                  cancelled
                </Text>
                <MaterialCommunityIcons
                  name={getStatusIcon("cancelled")}
                  size={20}
                  color="#fff"
                />
              </Box>
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
}

export default OrderDetails;
