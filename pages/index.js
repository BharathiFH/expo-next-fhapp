import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "solito/router";

export default function TimeScreen({ time: serverTime }) {
  const { push } = useRouter();
  const [time, setTime] = useState(serverTime || new Date().toISOString());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SSR Screen 1</Text>
      <Text style={styles.text}>Current server time: {time}</Text>
      <TouchableOpacity
        onPress={() => {
          push("/posts");
        }}
        style={{ backgroundColor: "#cbf5dd", padding: 10, marginTop: 20 }}
      >
        <Text style={{ color: "#000000", fontSize: 18, fontWeight: "bold" }}>
          Go to Screen 2
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Runs on server each request
export async function getServerSideProps() {
  console.log("getServerSideProps called on /");
  return {
    props: {
      time: new Date().toISOString(),
    },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});
