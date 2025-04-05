import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Pressable } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: route.name === "scanner" ? "none" : "flex",
          position: "absolute",
          bottom: 0,
          backgroundColor: "#ffffff",
          height: 60,
        },
        tabBarButton: (props) => {
          if (route.name === "scanner") {
            return (
              <Pressable
                {...props}
                style={[
                  props.style,
                  {
                    top: -20,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              ></Pressable>
            );
          }
          return <Pressable {...props} />;
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabContainer}>
              <Ionicons
                name="home-outline"
                color={focused ? "#000" : "#000"}
                size={37}
                style={styles.tabIcon}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabContainer}>
              <View style={styles.scannerTab}>
                <Ionicons
                  name="scan-sharp"
                  color={focused ? "#000" : "#000"}
                  size={40}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabContainer}>
              <Ionicons
                name="time-outline"
                color={focused ? "#000" : "#000"}
                size={40}
                style={styles.tabIcon}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scannerTab: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderColor: "#ffffff",
    borderWidth: 7,
    backgroundColor: "#ffc268",
    justifyContent: "center",
    alignItems: "center",
  },
  tabIcon: {
    marginTop: 16,
    width: 40,
    height: 40,
  },
});
