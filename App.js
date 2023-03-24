import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./app/components/login/LoginScreen";
import Toast from "react-native-toast-message";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./app/components/home/Home";
import RegisterScreen from "./app/components/register/RegisterScreen";
import EditProfile from "./app/components/profile/EditProfile";
import EditShop from "./app/components/profile/EditShop";
import EditLocation from "./app/components/profile/EditLocation";
import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import EditOperatingHour from "./app/components/profile/EditOperatingHour";
import OrderHistory from "./app/components/order/OrderHistory";
import OrderDetails from "./app/components/order/OrderDetails";
import DeliveryEdit from "./app/components/delivery/DeliveryEdit";
import PickupEdit from "./app/components/delivery/PickupEdit";
import DeliveryAreaEdit from "./app/components/delivery/DeliveryAreaEdit";
import OrdernowEdit from "./app/components/delivery/OrdernowEdit";
import PreorderEdit from "./app/components/delivery/PreorderEdit";
import OrderScheduleEdit from "./app/components/delivery/OrderScheduleEdit";
import ScheduleForm from "./app/components/delivery/ScheduleForm";
import AddScheduleForm from "./app/components/delivery/AddScheduleForm";
import ProductSetting from "./app/components/product/ProductSetting";
import AddProduct from "./app/components/product/AddProduct";
import ProductEdit from "./app/components/product/ProductEdit";
import CategoryEdit from "./app/components/product/CategoryEdit";
import AttributeEdit from "./app/components/product/AttributeEdit";
import AddCategory from "./app/components/product/AddCategory";
import AddAttribute from "./app/components/product/AddAttribute";
import RegisterMenu from "./app/components/register/RegisterMenu";
import RegisterLoading from "./app/components/register/RegisterLoading";

initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ title: "Profile" }}
          />
          <Stack.Screen
            name="EditShop"
            component={EditShop}
            options={{ title: "Shop" }}
          />
          <Stack.Screen
            name="EditLocation"
            component={EditLocation}
            options={{ title: "Location" }}
          />
          <Stack.Screen
            name="EditOperatingHour"
            component={EditOperatingHour}
            options={{ title: "Operating Hour" }}
          />
          <Stack.Screen
            name="OrderHistory"
            component={OrderHistory}
            options={{ title: "History" }}
          />
          <Stack.Screen
            name="OrderDetails"
            component={OrderDetails}
            options={{ title: "Order" }}
          />
          <Stack.Screen
            name="DeliveryEdit"
            component={DeliveryEdit}
            options={{ title: "Delivery" }}
          />
          <Stack.Screen
            name="PickupEdit"
            component={PickupEdit}
            options={{ title: "Pickup" }}
          />
          <Stack.Screen
            name="DeliveryAreaEdit"
            component={DeliveryAreaEdit}
            options={{ title: "Delivery Area" }}
          />
          <Stack.Screen
            name="OrdernowEdit"
            component={OrdernowEdit}
            options={{ title: "Order now" }}
          />
          <Stack.Screen
            name="PreorderEdit"
            component={PreorderEdit}
            options={{ title: "Preorder" }}
          />
          <Stack.Screen
            name="OrderScheduleEdit"
            component={OrderScheduleEdit}
            options={{ title: "Preorder Schedule" }}
          />
          <Stack.Screen
            name="ScheduleForm"
            component={ScheduleForm}
            options={{ title: "Schedule" }}
          />
          <Stack.Screen
            name="AddScheduleForm"
            component={AddScheduleForm}
            options={{ title: "Schedule" }}
          />
          <Stack.Screen
            name="ProductSetting"
            component={ProductSetting}
            options={{ title: "Products" }}
          />
          <Stack.Screen
            name="AddProduct"
            component={AddProduct}
            options={{ title: "Product" }}
          />
          <Stack.Screen
            name="ProductEdit"
            component={ProductEdit}
            options={{ title: "Product" }}
          />
          <Stack.Screen
            name="CategoryEdit"
            component={CategoryEdit}
            options={{ title: "Category" }}
          />
          <Stack.Screen
            name="AddCategory"
            component={AddCategory}
            options={{ title: "Category" }}
          />
          <Stack.Screen
            name="AddAttribute"
            component={AddAttribute}
            options={{ title: "Attribute" }}
          />
          <Stack.Screen
            name="AttributeEdit"
            component={AttributeEdit}
            options={{ title: "Attribute" }}
          />
          <Stack.Screen
            name="RegisterMenu"
            component={RegisterMenu}
            options={{
              title: "Register",
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="RegisterLoading"
            component={RegisterLoading}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </NativeBaseProvider>
  );
}
