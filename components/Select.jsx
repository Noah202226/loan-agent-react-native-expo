import React, { useEffect, useState } from "react";
import { View, Modal, TouchableHighlight, StyleSheet } from "react-native";
import { Text } from "@rneui/themed";

const Select = ({ status, db, id, fetchDocuments }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  // Options for the select element
  const options = [
    "Inquiry",
    "Follow up",
    "In Process",
    "Credit Investigation",
    "Approved",
  ];

  const updateStatus = () => {
    console.log(selectedValue, id);
    db.transaction((tx) => {
      tx.executeSql(
        `update clients set status = ? where id = ?;`,
        [selectedValue, id],
        () => {
          fetchDocuments();
          console.log("status updated");
        },
        (e) => console.log(e)
      );
    });
  };

  useEffect(() => {
    setSelectedValue(status);
  }, []);

  useEffect(() => {
    updateStatus();
  }, [selectedValue]);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <View>
          <Text>Status:</Text>
        </View>
        <TouchableHighlight
          onPress={() => setModalVisible(true)}
          style={{ padding: 10 }}
        >
          <Text style={styles.selectedOption}>{selectedValue}</Text>
        </TouchableHighlight>
      </View>
      <Modal
        animationType="fade"
        // transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text h2>Select New Status</Text>
          {options.map((option, index) => (
            <TouchableHighlight
              key={index}
              onPress={() => {
                setSelectedValue(option);
                setModalVisible(false);
              }}
              style={styles.option}
            >
              <Text h4>{option}</Text>
            </TouchableHighlight>
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
    fontSize: 14,
    fontWeight: "bold",
    padding: 5,
    // backgroundColor: "#2089dc",
    borderRadius: 5,
    color: "#200000",
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

export default Select;
