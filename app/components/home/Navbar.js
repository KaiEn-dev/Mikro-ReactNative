import { Box, Button, Text } from "native-base";
import React from "react";
import {
  Feather,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

function Navbar({ page, setPage }) {
  const getColor = (page, n) => {
    if (page == n) {
      return "#2b342d";
    } else {
      return "#A5AA94";
    }
  };

  return (
    <Box
      shadow="5"
      bg="#fff"
      position="absolute"
      bottom="0"
      display="flex"
      flexDirection="row"
      h="8%"
      w="100%"
    >
      <Button
        _pressed={{ bg: "#fff" }}
        bg="white"
        borderRadius="0"
        flex="1"
        onPress={(e) => setPage(1)}
      >
        <Box alignItems="center" justifyContent="center">
          <MaterialIcons
            name="storefront"
            size={20}
            color={getColor(page, 1)}
          />
          <Text fontSize="12" color={getColor(page, 1)}>
            Shop
          </Text>
        </Box>
      </Button>
      <Button
        _pressed={{ bg: "#fff" }}
        bg="white"
        borderRadius="0"
        flex="1"
        onPress={(e) => setPage(2)}
      >
        <Box alignItems="center" justifyContent="center">
          <MaterialCommunityIcons
            name="tag-outline"
            size={20}
            color={getColor(page, 2)}
          />
          <Text fontSize="12" color={getColor(page, 2)}>
            Products
          </Text>
        </Box>
      </Button>
      <Button
        _pressed={{ bg: "#fff" }}
        bg="white"
        borderRadius="0"
        flex="1"
        onPress={(e) => setPage(3)}
      >
        <Box alignItems="center" justifyContent="center">
          <AntDesign name="profile" size={20} color={getColor(page, 3)} />
          <Text fontSize="12" color={getColor(page, 3)}>
            Orders
          </Text>
        </Box>
      </Button>
      <Button
        _pressed={{ bg: "#fff" }}
        bg="white"
        borderRadius="0"
        flex="1"
        onPress={(e) => setPage(4)}
      >
        <Box alignItems="center" justifyContent="center">
          <Feather name="shopping-bag" size={20} color={getColor(page, 4)} />
          <Text fontSize="12" color={getColor(page, 4)}>
            Delivery
          </Text>
        </Box>
      </Button>
      <Button
        _pressed={{ bg: "#fff" }}
        bg="white"
        borderRadius="0"
        flex="1"
        onPress={(e) => setPage(5)}
      >
        <Box alignItems="center" justifyContent="center">
          <AntDesign name="user" size={22} color={getColor(page, 5)} />
          <Text fontSize="12" color={getColor(page, 5)}>
            Profile
          </Text>
        </Box>
      </Button>
    </Box>
  );
}

export default Navbar;
