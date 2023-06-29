import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableHighlight } from "react-native";

const Select = ({ status, setStatus }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  // Options for the select element
  const options = ["Inquiry", "Follow up", "Approve"];

  useEffect(() => {
    setSelectedValue(status);
  }, []);
  return (
    <View>
      <TouchableHighlight
        onPress={() => setModalVisible(true)}
        style={{ padding: 10 }}
      >
        <Text>Status : {selectedValue}</Text>
      </TouchableHighlight>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ backgroundColor: "#fff", padding: 20 }}>
            {options.map((option, index) => (
              <TouchableHighlight
                key={index}
                onPress={() => {
                  setSelectedValue(option);
                  setModalVisible(false);
                }}
                style={{ padding: 10 }}
              >
                <Text>{option}</Text>
              </TouchableHighlight>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Select;
