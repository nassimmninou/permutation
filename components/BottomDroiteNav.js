import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BottomDroiteNav() {
  return (
    <View style={styles.container}>
      <Text>BottomDroiteNav TEXT Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
