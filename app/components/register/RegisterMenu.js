import {
  Box,
  Button,
  Image,
  Input,
  Pressable,
  Text,
  TextArea,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Center,
} from "native-base";
import React, { useState, useEffect } from "react";
import StepIndicator from "react-native-step-indicator";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import logotitle from "../../assets/logotitle.png";
import { Keyboard, Image as rnImg } from "react-native";
import empty from "../../assets/empty.png";
import RegisterProfile from "./RegisterProfile";
import RegisterShop from "./RegisterShop";
import RegisterOperatingHour from "./RegisterOperatingHour";
import RegisterConfirm from "./RegisterConfirm";

function RegisterMenu({ navigation }) {
  const labels = ["Profile", "Shop", "Operating hours"];
  const customStyles = {
    stepIndicatorSize: 40,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: "#3D4F21",
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: "#3D4F21",
    stepStrokeUnFinishedColor: "#BEC4AA",
    separatorFinishedColor: "#3D4F21",
    separatorUnFinishedColor: "#BEC4AA",
    stepIndicatorFinishedColor: "#3D4F21",
    stepIndicatorUnFinishedColor: "#F2F8ED",
    stepIndicatorCurrentColor: "#F2F8ED",
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 14,
    stepIndicatorLabelCurrentColor: "#3D4F21",
    stepIndicatorLabelFinishedColor: "#F2F8ED",
    stepIndicatorLabelUnFinishedColor: "#BEC4AA",
    labelColor: "#BEC4AA",
    labelSize: 13,
    currentStepLabelColor: "#7D9253",
  };

  const initProfile = {
    profile: {
      username: null,
      email: null,
      password: null,
    },
  };
  const initShop = {
    name: null,
    description: null,
  };
  const initImage = rnImg.resolveAssetSource(empty).uri;
  const initOperatingHour = {
    mon: 1,
    mon_open: null,
    mon_close: null,
    tues: 1,
    tues_open: null,
    tues_close: null,
    wed: 1,
    wed_open: null,
    wed_close: null,
    thur: 1,
    thur_open: null,
    thur_close: null,
    fri: 1,
    fri_open: null,
    fri_close: null,
    sat: 1,
    sat_open: null,
    sat_close: null,
    sun: 1,
    sun_open: null,
    sun_close: null,
  };

  const profilesEndpoint = "/profile";
  const [profiles, setProfiles] = useState();
  const [profile, setProfile] = useState(initProfile);
  const [shop, setShop] = useState(initShop);
  const [image, setImage] = useState(initImage);
  const [operatingHour, setOperatingHour] = useState(initOperatingHour);
  const [position, setPosition] = useState(0);
  const [pick, setPick] = useState(false);

  const createShop = () => {
    navigation.navigate("RegisterLoading", {
      profile: profile,
      shop: shop,
      image: image,
      operatingHour: operatingHour,
    });
  };

  useEffect(() => {
    getProfiles();
  }, []);

  const getProfiles = () => {
    apiClient.get(profilesEndpoint).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.profiles;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        }
        setProfiles(data);
      }
    });
  };

  const onPageChange = (position) => {
    setPosition(position);
  };

  const getSection = (position) => {
    if (position == 0) {
      return (
        <RegisterProfile
          navigation={navigation}
          profiles={profiles}
          profile={profile}
          setProfile={setProfile}
          setPosition={setPosition}
        />
      );
    }
    if (position == 1) {
      return (
        <RegisterShop
          shop={shop}
          setShop={setShop}
          image={image}
          setImage={setImage}
          setPosition={setPosition}
          pick={pick}
          setPick={setPick}
        />
      );
    }
    if (position == 2) {
      return (
        <RegisterOperatingHour
          operatingHour={operatingHour}
          setOperatingHour={setOperatingHour}
          setPosition={setPosition}
          navigation={navigation}
        />
      );
    }
    if (position == 3) {
      return (
        <RegisterConfirm setPosition={setPosition} createShop={createShop} />
      );
    }
  };

  return (
    <Box flex="1">
      <Box
        height="22%"
        bg="#FFF"
        justifyContent="center"
        shadow="2"
        borderBottomColor="#E9E9E9"
        borderBottomWidth="1"
      >
        <Center mb="2">
          <Image
            size="35%"
            source={logotitle}
            alt="logo"
            resizeMode="contain"
          />
        </Center>
        <Box>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={position}
            labels={labels}
            stepCount={3}
          />
        </Box>
      </Box>
      <Box height="100%">{getSection(position)}</Box>
    </Box>
  );
}

export default RegisterMenu;
