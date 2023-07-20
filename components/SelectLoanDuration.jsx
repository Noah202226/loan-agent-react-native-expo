import React, { useState } from "react";
import { View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@rneui/themed";

const SelectLoanDuration = ({ options, selectedOption, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "80%",
          padding: 2,
        }}
      >
        <View>
          <Text>Loan Maturity:</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.selectedOption}>{selectedOption}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text h2>Select Loan Maturity</Text>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.option}
              onPress={() => {
                console.log(option);
                setModalVisible(false);
                onSelect(option);
              }}
            >
              <Text h4>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 5,
    backgroundColor: "#2089dc",
    borderRadius: 5,
    color: "#eee",
  },
  modalContainer: {
    opacity: 0.8,
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    padding: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default SelectLoanDuration;
