import React from "react";
import { Text, Image, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import ProfList from "./ProfList";
import Match from "./Match"; 
import Home from "./Home";
import Profil from "./Profil";

import Logout from "./Logout";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useRoute } from "@react-navigation/native";

const DrawerNav = createDrawerNavigator();

// Pour ajouter des éléments dans le tiroir (drawer)
const CustomDrawerContent = (props) => {
  const route = useRoute();
  const { professor } = route.params || { professor: null };

  return (
    <DrawerContentScrollView {...props}>
      {professor && (
        <Text style={styles.margeText}>
          {professor.nom} {professor.prenom}
        </Text>
      )}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default function Drawer() {
  const route = useRoute();
  const { professor } = route.params || { professor: null };

  return (

    <DrawerNav.Navigator drawerContent={CustomDrawerContent}>

      
<DrawerNav.Screen
        name="Accueil"
        component={Home}
        initialParams={{ professor: professor }}
      />
      <DrawerNav.Screen
        name="Profil"
        component={Profil}
        initialParams={{ professor: professor }}
      />
      <DrawerNav.Screen
        name="Recherche"
        component={ProfList}
        initialParams={{ professor: professor }}
      />

<DrawerNav.Screen
        name="Combine"
        component={Match}
        initialParams={{ professor: professor }}
      />

      <DrawerNav.Screen
        name="Logout"
        style={styles.logout}
        component={Logout}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          ),
        }}
      />
    </DrawerNav.Navigator>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    paddingHorizontal: 130,
  },
  marge: {
    paddingHorizontal: 95,
  },
  margeText: {
    paddingHorizontal: 15,
    marginTop: 150,
    marginBottom: 50,
  },
  drawerItemsContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
