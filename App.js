import { useState, useEffect } from "react";
import { ScrollView, TextInput, View } from "react-native";

import { Text } from "@rneui/base";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import { Button, Image, Input, ListItem } from "@rneui/themed";
import { ActivityIndicator } from "react-native";
import { Avatar } from "native-base";
import Select from "./components/Select";

function openDatabase() {
  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

export default function App() {
  const [clientName, setClientName] = useState("");
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists clients (id integer primary key not null, clientName text, status text);"
      );
    });
  }, []);

  const addClient = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO clients (clientName, status) VALUES (?, ?)",
        [clientName, "inquiry"],
        (txObj, resultSet) => {
          console.log("new client added.");
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
  }, [documents]);

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
          setDocuments(data);
        },
        (_, error) => {
          // Handle error scenario if required
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
    <View style={{ paddingTop: Constants.statusBarHeight, flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          marginVertical: 10,
          marginHorizontal: 5,
        }}
      >
        <Text h4>SALES AGENT NOEMI EAS2411</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 10,
        }}
      >
        <Image
          source={require("./assets/noems.jpg")}
          PlaceholderContent={<ActivityIndicator />}
          style={{ width: 50, height: 50, borderRadius: 50 }}
        />
        <Image
          source={require("./assets/horizontalbanner.webp")}
          PlaceholderContent={<ActivityIndicator />}
          style={{ width: 200, height: 50, borderRadius: 50 }}
        />
      </View>

      <View>
        <Input
          placeholder="INPUT WITH ICON"
          onSubmitEditing={addClient}
          value={clientName}
          onChangeText={(e) => setClientName(e)}
        />
      </View>
      <ScrollView>
        {documents.map((document) => (
          <ListItem key={document.id}>
            <ListItem.Content>
              <ListItem.Title>{document.clientName}</ListItem.Title>
              <Select status={document.status} />
              <Button
                title={"delete"}
                size="sm"
                onPress={() => deleteDocument(document.id)}
              />
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
    </View>
  );
}
