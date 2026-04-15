import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { ExerciseRoute } from "../ExerciseRoute";
import { WorkoutsRoute } from "../WorkoutRoute";
import { MuscleGroupRoute } from "../MuscleGroupRoute";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export const HomeScreen = ({ navigation }: Props) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "workouts", title: "Treinos" },
    { key: "exercises", title: "Exercícios" },
    { key: "muscleGroups", title: "Grupos" },
  ]);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case "workouts":
        return <WorkoutsRoute navigation={navigation} />;
      case "exercises":
        return <ExerciseRoute />;
      case "muscleGroups":
        return <MuscleGroupRoute />;
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: "#6200ee" }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};
