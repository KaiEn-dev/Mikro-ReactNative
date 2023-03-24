import {
  Box,
  Center,
  Image,
  ScrollView,
  Switch,
  Text,
  Pressable,
  Button,
} from "native-base";
import React, { useState, useEffect } from "react";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import logotitle from "../../assets/logotitle.png";
import { Feather, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Clipboard from "expo-clipboard";

function ShopScreen(props) {
  const shopEndpoint = "/shop/";
  const imgEndpoint = "/image/";
  const dmEndpoint = "/deliveryMode/shop/";
  const shopUpdateEndpoint = "/shop/availability/";
  const [shop, setShop] = useState();
  const [shopImg, setShopImg] = useState();
  const [status, setStatus] = useState();
  const [deliveryMode, setDeliveryMode] = useState();

  const getShop = () => {
    apiClient.get(shopEndpoint + GLOBAL.SHOPID).then((response) => {
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
        setShop(data[0]);
        getImage(data[0].shop_image);
        if (data[0].availability) {
          setStatus(true);
        } else {
          setStatus(false);
        }
      }
    });
  };

  const getImage = (id) => {
    apiClient.get(imgEndpoint + id).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.image;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        }
        setShopImg(data[0]);
      }
    });
  };

  const getDeliveryMode = () => {
    apiClient.get(dmEndpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.deliveryMode;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        } else {
          setDeliveryMode(data[0]);
        }
      }
    });
  };

  useEffect(() => {
    getShop();
    getDeliveryMode();
  }, []);

  const getDisabled = () => {
    if (deliveryMode) {
      if (deliveryMode.delivery == 0 && deliveryMode.pickup == 0) {
        Toast.show({
          type: "error",
          text1: "Shop not ready!",
          text2: "Delivery and pickup modes are both deactivated",
        });
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const handleOpenClose = (value) => {
    let av;
    if (value) {
      av = 1;
    } else {
      av = 0;
    }
    let newdata = {
      shop: {
        availability: av,
      },
    };
    updateShop(newdata, value);
  };

  const updateShop = (newdata, value) => {
    apiClient
      .put(shopUpdateEndpoint + shop.shop_id, newdata)
      .then((response) => {
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
            if (value) {
              Toast.show({
                type: "success",
                text1: "shop opened!",
              });
            } else {
              Toast.show({
                type: "success",
                text1: "shop closed!",
              });
            }
          }
        }
      });
  };

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(GLOBAL.LINK + GLOBAL.SHOPID);
  };

  const copyToClipboard = () => {
    Clipboard.setString(GLOBAL.LINK + GLOBAL.SHOPID);
    Toast.show({
      type: "success",
      text1: "Shop link copied!",
    });
  };

  return (
    <Box h="92%" w="100%" bg="#F3F3F3">
      <Center height="8%" bg="#fff">
        <Image size="40%" source={logotitle} alt="logo" resizeMode="contain" />
      </Center>

      {shop && shopImg && (
        <Box flex="1">
          <Center height="60%">
            <Box>
              <Image
                borderRadius="full"
                size="200"
                resizeMode="contain"
                src={shopImg.image_link}
                alt="Shop image"
              />
            </Box>
            <Center>
              <Text fontSize="25" fontWeight="500" color="#2B342D">
                {shop.shop_name}
              </Text>
              <Text fontSize="12" fontWeight="500">
                {shop.shop_description}
              </Text>
            </Center>
          </Center>
          <Box height="40%" alignItems="center">
            <Box width="80%" flexDirection="row">
              <Box
                mr="4"
                flex="3"
                shadow="1"
                p="4"
                bg="#FFF"
                borderRadius="5"
                alignItems="center"
                justifyContent="center"
                flexDirection="row"
              >
                <Box mr="5">
                  {!status && (
                    <MaterialCommunityIcons
                      name="storefront"
                      size={40}
                      color="#3D4F21"
                    />
                  )}
                  {status && (
                    <MaterialCommunityIcons
                      name="storefront-outline"
                      size={40}
                      color="#3D4F21"
                    />
                  )}
                </Box>
                <Center ml="4">
                  {status && (
                    <Text fontSize="12" fontWeight="600" color="#3d4f21">
                      Open
                    </Text>
                  )}
                  {!status && (
                    <Text fontSize="12" fontWeight="600" color="#3d4f21">
                      Close
                    </Text>
                  )}
                  <Switch
                    disabled={getDisabled()}
                    offTrackColor="#BEC4AA"
                    onTrackColor="#3D4F21"
                    size="sm"
                    value={status}
                    onValueChange={(value) => {
                      setStatus(value);
                      handleOpenClose(value);
                    }}
                  />
                </Center>
              </Box>
              <Pressable
                flex="1"
                alignItems="center"
                justifyContent="center"
                py="2"
                bg="#fff"
                borderRadius="4"
                shadow="1"
                onPress={_handlePressButtonAsync}
                _pressed={{ bg: "#EDEDED" }}
              >
                <Center>
                  <Text fontWeight="500" color="#3D4F21">
                    Preview
                  </Text>
                  <Entypo
                    name="chevron-small-right"
                    size={15}
                    color="#afb7c5"
                  />
                </Center>
              </Pressable>
            </Box>
            <Box
              h="25%"
              w="80%"
              alignItems="center"
              justifyContent="center"
              mt="4"
              bg="#fff"
              borderRadius="4"
              shadow="1"
              flexDirection="row"
              onPress={_handlePressButtonAsync}
              _pressed={{ bg: "#EDEDED" }}
            >
              <Box flex="5" pl="4">
                <Text fontSize="12" fontWeight="500" color="#3D4F21">
                  {GLOBAL.LINK + GLOBAL.SHOPID}
                </Text>
              </Box>
              <Box flex="1" pr="2">
                <Button
                  bg="#fff"
                  onPress={() => copyToClipboard()}
                  _pressed={{ bg: "#E7E7E7" }}
                >
                  <Feather name="copy" size={20} color="grey" />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ShopScreen;
