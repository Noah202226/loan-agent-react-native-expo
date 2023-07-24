import {
  Button,
  ButtonGroup,
  Dialog,
  FAB,
  Image,
  Input,
  ListItem,
  Text,
} from "@rneui/themed";
import { ActivityIndicator } from "react-native";
import Select from "../components/Select";
import { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import * as ClipBoard from "expo-clipboard";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

import SelectLoanDuration from "../components/SelectLoanDuration";
import { ToastAndroid } from "react-native";
import { Alert } from "react-native";

const HomeScreen = ({ db }) => {
  const [clientName, setClientName] = useState("");
  const [note, setNote] = useState();

  const getStatusColor = (status) => {
    // "Inquiry",
    // "Follow up",
    // "In Process",
    // "Credit Investigation",
    // "Approved",
    switch (status) {
      case "Approved":
        return "#ff0000"; // Red for high priority
      case "Credit Investigation":
        return "#ff5252"; // Orange for medium priority
      case "In Process":
        return "coral"; // Green for low priority
      case "Follow up":
        return "#ff7b7b"; // Green for low priority
      default:
        return "#ffbaba"; // Black for other cases
    }
  };

  const changeFontColorStatus = (status) => {
    switch (status) {
      case "Approved":
        return "white"; // Red for high priority
      case "Credit Investigation":
        return "white"; // Orange for medium priority
      case "In Process":
        return "black"; // Green for low priority
      case "Follow up":
        return "black"; // Green for low priority
      default:
        return "black"; // Black for other cases
    }
  };

  const [showCalcu, setShowCalcu] = useState(false);
  const [desiredAmount, setDesiredAmount] = useState();
  const [loanDuration, setLoanDuration] = useState();
  const [monthlyPay, setMonthlyPay] = useState();

  const buttons = ["100000", "200000", "500000", "1000000"]; // Replace with your desired button labels
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState("12 Months");
  const options = ["12 Months", "24 Months", "36 Months"];

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setLoanDuration(option);
  };

  const handleButtonPress = (index) => {
    setSelectedIndex(index);
    // You can perform any additional actions here based on the selected button value
    console.log("Selected button value:", buttons[index]);
  };

  const computeMontlyPay = () => {
    console.log(desiredAmount, loanDuration);

    const ans1 = desiredAmount * 0.0139;
    let ans2;

    if (loanDuration == "12 Months") {
      ans2 = desiredAmount / 12;
    } else if (loanDuration == "24 Months") {
      ans2 = desiredAmount / 24;
    } else if (loanDuration == "36 Months") {
      ans2 = desiredAmount / 36;
    }

    const perMonth = ans1 + ans2;
    console.log(perMonth);

    setMonthlyPay(perMonth.toFixed(6));
  };

  const copyToClipboard = async (text) => {
    try {
      await ClipBoard.setStringAsync(text);

      console.log("Copied to clipboard.");
      Alert.alert("Good Copy", "Copied to clipboard", [{ text: "Cool" }]);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists clients (id integer primary key not null, clientName text, note text, status text);",
        () => console.log("good"),
        (tx, error) => console.log(error)
      );
    });
  }, []);

  const dropTable = () => {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE IF EXISTS clients", [], (_, result) => {
        console.log("Table dropped successfully.");
      });
    });
  };

  const addClient = () => {
    console.log("adding data.");
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO clients (clientName, status, note) VALUES (?, ?, ?)",
        [clientName, "inquiry", note],
        (txObj, resultSet) => {
          console.log("new client added.");
          fetchDocuments();
          setClientName("");
          setNote("");
        },
        (txObj, error) => {
          // Error callback
          // Handle error scenario if required
          console.log("error adding client.", error);
        }
      );
    });
  };

  // Listening to data
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Fetch all documents when the component mounts
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM clients",
        [],
        (_, resultSet) => {
          const { rows } = resultSet;
          const data = [];
          for (let i = 0; i < rows.length; i++) {
            const document = rows.item(i);
            data.push(document);
          }
          // Sort the data array in descending order by id before setting it to the state
          data.sort((a, b) => b.id - a.id);
          setDocuments(data);
        },
        (_, error) => {
          console.log(_, error);
        }
      );
    });
  };

  const deleteDocument = (documentId) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM clients WHERE id = ?",
        [documentId],
        () => {
          console.log("Document deleted successfully.");
          fetchDocuments(); // Fetch documents again after deletion
        },
        (_, error) => {
          console.error("Error deleting document:", error);
        }
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          marginVertical: 10,
          marginHorizontal: 5,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Text h4 h4Style={{ fontWeight: "300", fontSize: 26, color: "red" }}>
          AGENT NOEMI `ESA2411`
        </Text>

        <MaterialIcons
          size={30}
          color={"#e00000"}
          name="support-agent"
          onPress={() =>
            Alert.alert(
              "About this app",
              "This app created by Noah, Contact me at noaligpitan@gmail.com"
            )
          }
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 10,
        }}
      >
        <Image
          source={require("../assets/noems.jpg")}
          PlaceholderContent={<ActivityIndicator />}
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "red",
            marginLeft: 10,
          }}
        />
        <Image
          source={require("../assets/1.jpg")}
          PlaceholderContent={<ActivityIndicator />}
          style={{
            width: 200,
            height: 60,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "red",
            marginLeft: 10,
          }}
        />
      </View>

      <View>
        <Input
          placeholder="Add new client"
          value={clientName}
          onChangeText={(e) => setClientName(e)}
          style={{ borderRadius: 10, color: "white" }}
        />
        <Input
          placeholder="Note"
          value={note}
          onChangeText={(e) => setNote(e)}
        />
        <View
          style={{
            alignItems: "flex-end",
            width: "100%",
            borderRadius: 200,
            marginBottom: 10,
          }}
        >
          <Button
            type="solid"
            uppercase
            raised
            title={"Save Client"}
            size="sm"
            onPress={addClient}
            color={"error"}
          />
        </View>
      </View>
      <ScrollView>
        {documents.map((document) => (
          <ListItem key={document.id}>
            <ListItem.Content
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                backgroundColor: getStatusColor(document.status),
                //   document.status == "Approved" ? "lightgreen" : "cyan",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <ListItem.Title
                  style={{ color: changeFontColorStatus(document.status) }}
                >
                  {document.clientName}
                </ListItem.Title>

                <Button
                  title={"delete"}
                  size="sm"
                  onPress={() => deleteDocument(document.id)}
                />
              </View>
              <View>
                <Select
                  status={document.status}
                  db={db}
                  id={document.id}
                  fetchDocuments={fetchDocuments}
                  changeFontColorStatus={changeFontColorStatus}
                />
              </View>
              <View>
                <Text style={{ color: changeFontColorStatus(document.status) }}>
                  NOTE: {document.note}
                </Text>
              </View>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
      <FAB
        visible={true}
        onPress={() => setShowCalcu(!showCalcu)}
        placement="right"
        icon={<Ionicons name="calculator-outline" color="white" size={22} />}
        color="#2089dc"
      />
      <Dialog
        isVisible={showCalcu}
        onBackdropPress={() => setShowCalcu(!showCalcu)}
      >
        <Dialog.Title
          title="Loan Calculator"
          titleStyle={{ color: "#2089dc", textAlign: "right" }}
        />
        <Text>Calculator</Text>
        <ButtonGroup
          buttons={buttons}
          selectedIndex={desiredAmount}
          onPress={(value) => {
            setDesiredAmount(buttons[value]);
            handleButtonPress(value);
          }}
          containerStyle={{ marginBottom: 20 }}
          activeOpacity={10}
          underlayColor="#2089dc"
          selectedButtonStyle={{ backgroundColor: "#2089dc" }}
          selectedTextStyle={{ background: "red" }}
        />
        <Input
          placeholder="Desired Amount"
          value={desiredAmount}
          onChangeText={(e) => setDesiredAmount(e)}
        />

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SelectLoanDuration
            options={options}
            selectedOption={selectedOption}
            onSelect={handleSelectOption}
          />
        </View>

        <Input
          label="Monthly Pay"
          value={monthlyPay}
          onChangeText={(e) => setMonthlyPay(e)}
          disabled
        />
        <Button
          onPress={computeMontlyPay}
          style={{ marginBottom: 20 }}
          radius={50}
          containerStyle={{ marginBottom: 10 }}
        >
          Compute <AntDesign name="calculator" color={"white"} size={22} />
        </Button>
        <Button
          style={{ marginTop: 20 }}
          color={"warning"}
          onPress={() => copyToClipboard(monthlyPay)}
        >
          Copy to clipboard <Ionicons name="copy" color={"white"} size={22} />
        </Button>
      </Dialog>
    </View>
  );
};

export default HomeScreen;
