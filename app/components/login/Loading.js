import { Box, Image, Progress, Center } from "native-base";
import React, { useState, useEffect } from "react";
import loadinglogo from "../../assets/loadinglogo.png";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import GLOBAL from "../../global";

function Loading({ user, setShow, navigation }) {
  const endpoint = "/shop/user/";
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (progress == 100) {
        goHome();
      }
      setProgress(progress + 1);
    }, 35);
  });

  useEffect(() => {
    if (user) {
      getShop();
    }
  }, [user]);

  const getShop = () => {
    apiClient.get(endpoint + user).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.shop;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        }
        console.log(data[0].shop_id);
        GLOBAL.SHOPID = data[0].shop_id;
        GLOBAL.USERID = user;
      }
    });
  };

  const goHome = () => {
    navigation.navigate("Home");
    setShow(false);
  };

  return (
    <Center w="100%" top="-8%">
      <Image size="150" source={loadinglogo} alt="logo" mb="6"></Image>
      <Box w="50%">
        <Progress
          value={progress}
          mt="0"
          size="xs"
          bg="#404E43"
          _filledTrack={{ bg: "#bec4aa" }}
        />
      </Box>
    </Center>
  );
}

export default Loading;
