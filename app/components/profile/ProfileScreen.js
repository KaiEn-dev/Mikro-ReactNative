import { Box, Center, Image, ScrollView } from "native-base";
import React from "react";
import logotitle from "../../assets/logotitle.png";
import AddressTab from "./AddressTab";
import OperatingHourTab from "./OperatingHourTab";
import ProfileTab from "./ProfileTab";
import ShopTab from "./ShopTab";

function ProfileScreen({ navigation }) {
  return (
    <Box h="92%" w="100%" bg="#F3F3F3">
      <Center height="8%" bg="#fff">
        <Image size="40%" source={logotitle} alt="logo" resizeMode="contain" />
      </Center>
      <ScrollView>
        <ProfileTab navigation={navigation} />
        <ShopTab navigation={navigation} />
        <OperatingHourTab navigation={navigation} />
        <AddressTab navigation={navigation} />
      </ScrollView>
    </Box>
  );
}

export default ProfileScreen;
