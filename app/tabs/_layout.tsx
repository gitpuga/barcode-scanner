import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          height: 60 + insets.bottom,
          backgroundColor: "#333",
          borderTopWidth: 0,
          elevation: 0,
          display: route.name === "scanner" ? "none" : "flex",
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
              >
                <View style={styles.scannerTab}>
                  <Text style={styles.scannerText}>Сканер</Text>
                </View>
              </Pressable>
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
                color={focused ? "#FFF" : "#CCC"}
                size={30}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabContainer}>
              <Ionicons
                name="time-outline"
                color={focused ? "#FFF" : "#CCC"}
                size={30}
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
    justifyContent: "space-around",
  },
  tabIconContainer: {
    display: "none",
  },
  tabLabel: {
    fontSize: 12,
    color: "#CCC",
  },
  tabLabelFocused: {
    color: "#FFF",
  },
  scannerTab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  scannerText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
});
