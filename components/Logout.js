import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const Logout = () => {
  const navigation = useNavigation();
  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = () => {

    navigation.navigate("Login"); // Remplacez 'Login' par le nom de votre écran de connexion
  };

  return null;
};

export default Logout;
