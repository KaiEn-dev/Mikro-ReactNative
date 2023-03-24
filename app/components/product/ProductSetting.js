import { Box, Button, ScrollView, Text } from "native-base";
import React, { useState, useEffect } from "react";
import AttributeSetting from "./AttributeSetting";
import CategorySetting from "./CategorySetting";

function ProductSetting({ navigation, route }) {
  const { products } = route.params;
  const [tab, setTab] = useState(2);

  const displayTab = (tab) => {
    if (tab == 2) {
      return <AttributeSetting navigation={navigation} products={products} />;
    }
    if (tab == 1) {
      return <CategorySetting navigation={navigation} products={products} />;
    }
  };

  const getFontColor = (x) => {
    if (x == tab) {
      return "#7D9253";
    } else {
      return "#838383";
    }
  };

  const getLineColor = (x) => {
    if (x == tab) {
      return "#7D9253";
    } else {
      return "#F3F3F3";
    }
  };

  return (
    <Box h="100%" w="100%" bg="#F3F3F3">
      <Box w="100%" flexDirection="row" bg="#F3F3F3" shadow="1">
        <Button
          flex="1"
          borderRadius="0"
          bg="#F3F3F3"
          _pressed={{ bg: "#E8E8E8" }}
          borderBottomWidth="2"
          borderBottomColor={getLineColor(1)}
          onPress={() => setTab(1)}
        >
          <Text fontWeight="600" color={getFontColor(1)}>
            Categories
          </Text>
        </Button>
        <Button
          flex="1"
          borderRadius="0"
          bg="#F3F3F3"
          _pressed={{ bg: "#E8E8E8" }}
          borderBottomWidth="2"
          borderBottomColor={getLineColor(2)}
          onPress={() => setTab(2)}
        >
          <Text fontWeight="600" color={getFontColor(2)}>
            Attributes
          </Text>
        </Button>
      </Box>
      {displayTab(tab)}
    </Box>
  );
}

export default ProductSetting;
