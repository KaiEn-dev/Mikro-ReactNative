import { Box, Image, Progress, Center, Text } from "native-base";
import React, { useState, useEffect } from "react";
import loadinglogo from "../../assets/loadinglogo.png";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import GLOBAL from "../../global";
import firebaseUpload from "../../api/firebaseImageUpload";

function RegisterLoading({ navigation, route }) {
  const { profile, shop, image, operatingHour } = route.params;
  const [progress, setProgress] = useState(0);

  //api endpoints
  const profileEndpoint = "/profile";
  const imageEndpoint = "/image";
  const shopEndpoint = "/shop";
  const operatingHourEndpoint = "/operatingHour";
  const deliveryAreaEndpoint = "/deliveryArea";
  const deliveryModeEndpoint = "/deliveryMode";
  const orderModeEndpoint = "/orderMode";

  useEffect(() => {
    setTimeout(() => {
      if (progress == 100) {
      }
      setProgress(progress + 1);
    }, 50);
  });

  useEffect(() => {
    insertProfile();
  }, []);

  const insertProfile = () => {
    let newdata = {
      profile: {
        username: profile.username,
        email: profile.email,
        password: profile.password,
      },
    };
    apiClient.post(profileEndpoint, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.profile;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          console.log("profile created");
          let userid = data[0].user_id;
          GLOBAL.USERID = userid;
          firebaseUpload(image).then((url) => {
            insertImage(url);
          });
        }
      }
    });
  };

  const insertImage = (url) => {
    let newdata = {
      image: {
        image_link: url,
      },
    };
    apiClient.post(imageEndpoint, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.image;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          let imageid = data[0].image_id;
          insertShop(imageid);
        }
      }
    });
  };

  const insertShop = (imageid) => {
    let newdata = {
      shop: {
        user_id: GLOBAL.USERID,
        shop_name: shop.name,
        shop_image: imageid,
        shop_description: shop.description,
        availability: 0,
        p_category: null,
        address: 0,
        shop_link: null,
      },
    };

    apiClient.post(shopEndpoint, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.shop;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          let shopid = data[0].shop_id;
          GLOBAL.SHOPID = shopid;
          insertOperatingHour();
        }
      }
    });
  };

  const insertOperatingHour = () => {
    let newdata = {
      operatingHour: {
        shop_id: GLOBAL.SHOPID,
        mon: operatingHour.mon,
        mon_open: operatingHour.mon_open,
        mon_close: operatingHour.mon_close,
        tues: operatingHour.tues,
        tues_open: operatingHour.tues_open,
        tues_close: operatingHour.tues_close,
        wed: operatingHour.wed,
        wed_open: operatingHour.wed_open,
        wed_close: operatingHour.wed_close,
        thur: operatingHour.thur,
        thur_open: operatingHour.thur_open,
        thur_close: operatingHour.thur_close,
        fri: operatingHour.fri,
        fri_open: operatingHour.fri_open,
        fri_close: operatingHour.fri_close,
        sat: operatingHour.sat,
        sat_open: operatingHour.sat_open,
        sat_close: operatingHour.sat_close,
        sun: operatingHour.sun,
        sun_open: operatingHour.sun_open,
        sun_close: operatingHour.sun_close,
      },
    };
    apiClient.post(operatingHourEndpoint, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.operatingHour;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          insertDeliveryArea();
        }
      }
    });
  };
  const insertDeliveryArea = () => {
    let newdata = {
      deliveryArea: {
        shop_id: GLOBAL.SHOPID,
        whole_malaysia: 1,
        area: null,
      },
    };

    apiClient.post(deliveryAreaEndpoint, newdata).then((response) => {
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
          insertDeliveryMode();
        }
      }
    });
  };
  const insertDeliveryMode = () => {
    let newdata = {
      deliveryMode: {
        shop_id: GLOBAL.SHOPID,
        delivery: 0,
        delivery_time: null,
        pickup: 0,
        pickup_time: null,
      },
    };

    apiClient.post(deliveryModeEndpoint, newdata).then((response) => {
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
        } else {
          insertOrderMode();
        }
      }
    });
  };

  const insertOrderMode = () => {
    let newdata = {
      orderMode: {
        shop_id: GLOBAL.SHOPID,
        order_now: 1,
        preorder: 0,
        preorder_option: null,
      },
    };

    apiClient.post(orderModeEndpoint, newdata).then((response) => {
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
          goHome();
        }
      }
    });
  };

  const goHome = () => {
    navigation.navigate("Home");
  };

  return (
    <Center flex="1" bg="#2B342D">
      <Box top="-50" w="100%" alignItems="center">
        <Image size="100" source={loadinglogo} alt="logo" mb="6"></Image>
        <Text mb="1" color="#BEC4AA" fontSize="11">
          creating shop...
        </Text>
        <Box w="40%">
          <Progress
            value={progress}
            mt="0"
            size="xs"
            bg="#404E43"
            _filledTrack={{ bg: "#bec4aa" }}
          />
        </Box>
      </Box>
    </Center>
  );
}

export default RegisterLoading;
