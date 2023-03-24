import {
  Box,
  Text,
  Pressable,
  ScrollView,
  Button,
  Center,
  Modal,
} from "native-base";
import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import GLOBAL from "../../global";

const data1 = {
  deliveryArea: {
    shop_id: 1,
    whole_malaysia: 0,
    area: '{"area": [{"state": "Selangor", "city": ["Ampang","Batang Berjuntai","Batang Kali","Cheras","Cyberjaya","Dengkil","Hulu Langat","Kerling","Klang","Klia","Kuala Selangor","Pelabuhan Klang","Petaling Jaya","Puchong","Pulau Carey","Pulau Indah","Pulau Ketam","Rasa","Rawang","Sepang","Serdang","Serendah","Seri Kembangan","Shah Alam","Subang Airport","Subang Jaya","Sungai Buloh"]},{"state": "Wp Kuala Lumpur","city": ["Kuala Lumpur","Setapak"]}]}\r\n',
  },
};

const data2 = {
  deliveryArea: {
    shop_id: 1,
    whole_malaysia: 1,
    area: null,
  },
};

function DeliveryAreaEdit({ route, navigation }) {
  const endpoint = "/deliveryArea/shop/";
  const [select, setSelect] = useState(0);
  const [show, setShow] = useState(false);

  const handleUpdateArea = () => {
    if (select == 1) {
      updateArea(data1);
    }
    if (select == 2) {
      updateArea(data2);
    }
  };

  const updateArea = (newdata) => {
    apiClient.put(endpoint + GLOBAL.SHOPID, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.deliveryArea;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          navigation.navigate("Home");
          Toast.show({
            type: "success",
            text1: "Data Update",
            text2: "profile updated!",
          });
        }
      }
    });
  };

  const getBg = (id) => {
    if (select == id) {
      return "#7D9253";
    } else {
      return "#E7F0DF";
    }
  };

  const getCl = (id) => {
    if (select == id) {
      return "#FFF";
    } else {
      return "#7D9253";
    }
  };

  return (
    <ScrollView>
      <Box bg="#F3F3F3" flex={1} alignItems="center">
        <Center flexDirection="row" mt="4" mx="5" mb="2">
          <Text flex="1" fontSize="20" color="#3d4f21" fontWeight="bold">
            Dummy data
          </Text>
          <Button
            borderRadius="full"
            p="0"
            ml="2"
            bg="#F3F3F3"
            _pressed={{ bg: "#fff" }}
            onPress={() => setShow(true)}
          >
            <AntDesign name="questioncircle" size={20} color="#3d4f21" />
          </Button>
        </Center>
        <Pressable
          mx="4"
          py="4"
          my="2"
          bg={getBg(1)}
          borderRadius="3"
          shadow="1"
          display="flex"
          flexDirection="row"
          _pressed={{ bg: "#DFE8D5" }}
          onPress={() => setSelect(1)}
        >
          <Box flex="1">
            <Box mx="4" display="flex" flexDirection="row" alignItems="center">
              <Text fontSize="20" color={getCl(1)} fontWeight="bold" mr="3">
                Selangor / Kuala Lumpur
              </Text>
            </Box>
          </Box>
        </Pressable>
        <Pressable
          mx="4"
          py="4"
          my="2"
          bg={getBg(2)}
          borderRadius="3"
          shadow="1"
          display="flex"
          flexDirection="row"
          _pressed={{ bg: "#DFE8D5" }}
          onPress={() => setSelect(2)}
        >
          <Box flex="1">
            <Box mx="4" display="flex" flexDirection="row" alignItems="center">
              <Text fontSize="20" color={getCl(2)} fontWeight="bold" mr="3">
                Whole Malaysia
              </Text>
            </Box>
          </Box>
        </Pressable>
        <Box width="100%" alignItems="flex-end" mt="5" mb="20">
          <Button
            onPress={() => handleUpdateArea()}
            bg="#2b342d"
            mr="5"
            _pressed={{ bg: "#3D4F21" }}
          >
            save
          </Button>
        </Box>
      </Box>
      <Modal isOpen={show} onClose={() => setShow(false)}>
        <Modal.Content maxWidth="80%" bg="#2B342D">
          <Modal.Body m="3" alignItems="center" justifyContent="center">
            <MaterialCommunityIcons
              name="emoticon-sad-outline"
              size={24}
              color="#fff"
            />
            <Text textAlign="center" mt="3" color="#fff">
              Some problem occured with the "malaysia-postcode" npm package very
              late into development, the only work around was to build the
              postcode module on my own. Unfortunately there was no time left
              for it. These dummy data will be substituted to show case the
              functionalities of this section instead. Sorry!
            </Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
}

export default DeliveryAreaEdit;
