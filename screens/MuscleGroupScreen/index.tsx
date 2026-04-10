import React from "react";
import { View, FlatList } from "react-native";
import { List } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { mockMuscleGroups } from "../../data/mockMuscleGroups";
import { MuscleGroup } from "../../models/MuscleGroup";

type Props = NativeStackScreenProps<RootStackParamList, "MuscleGroup">;

export const MuscleGroupScreen = ({ navigation, route }: Props) => {
  const { workoutId } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <FlatList<MuscleGroup>
        data={mockMuscleGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: MuscleGroup }) => (
          <List.Item
            title={item.name}
            onPress={() =>
              navigation.navigate("Exercise", {
                workoutId,
                muscleGroupId: item.id,
              })
            }
          />
        )}
      />
    </View>
  );
};
