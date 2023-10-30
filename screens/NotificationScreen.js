import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import React,{useEffect, useState} from 'react'
import {Divider, Card, IconButton} from 'react-native-paper';
import { db, auth } from '../firebase'
import { doc, getDoc, collection, query, where, getDocs, or, updateDoc, deleteDoc } from "firebase/firestore";

const NotificationScreen = () => {
    const userID = auth.currentUser.uid
    const [messages, setMessages] = useState([])
    const [selectedMessage, setSelectedMessage] = useState(null)
    useEffect(() => {
        // Read all messages
        const fetchMessages = async () => {
            const q = query(collection(db, "messages"), where("userID", "==", userID));
            const querySnapshot = await getDocs(q);
            const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            console.log(docsData)
            setMessages([...docsData.sort((a, b) => b.createdDateTime - a.createdDateTime)])
        };
        fetchMessages();
    }, []);

    const viewMessage = async (message) => { 
      if(!message.isRead)
      {
        console.log("Before update message", message)
        await updateDoc(doc(db, "messages", message.id), {
          isRead:true
        });
        message.isRead = true
      }
      console.log("Set select message")
      setSelectedMessage(message)

     }

     const deleteMessage = async () => {
      if (selectedMessage) {
        try {
          // Delete the selected message from Firestore
          await deleteDoc(doc(db, "messages", selectedMessage.id));
          
          // Clear the selected message to hide the message detail
          setSelectedMessage(null);
          
          // You can also update your messages state to remove the deleted message from the list if needed
          setMessages((prevMessages) =>
            prevMessages.filter((message) => message.id !== selectedMessage.id)
          );
          
          // Log a success message or perform any other desired actions after deletion
          console.log("Message deleted successfully");
        } catch (error) {
          // Handle any errors that may occur during deletion
          console.error("Error deleting message", error);
        }
      }
    }; 

    const renderItem = ({ item }) => (
        <View style={{marginVertical:8}}>
          <TouchableOpacity onPress={()=>viewMessage(item)} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>
              <Text style={{ fontWeight: item.isRead ? 'normal':'bold'   }}>{item.materialTitle}</Text>
              <Text style={{ fontWeight: item.isRead ? 'normal':'bold' }}>{item.message}</Text>
              <Text style={{ fontWeight: item.isRead ? 'normal':'bold' }}>{item.sentDate?.toDate().toDateString()}</Text>
            </View>
          </TouchableOpacity>
            <Divider />
       </View>
      );


  return (
    <SafeAreaView style={{justifyContent:'space-between'}}>
      <FlatList data={messages} renderItem = {renderItem} />
      {/* Message Detail */}
      {selectedMessage &&
        <View>
          <Card>
          <Card.Title
            title={selectedMessage.materialTitle}
            subtitle={selectedMessage.createdDateTime?.toDate().toDateString()}
            right={(props) => <IconButton {...props} icon="delete" iconColor='purple' onPress={deleteMessage} />}
          />
          <Card.Content>
          <Text variant="titleLarge">User ID : {selectedMessage.userID}</Text>
          <Divider />
          <Text variant="bodyMedium">{selectedMessage.message}</Text>
        </Card.Content>
        </Card>
        </View>
      }
    </SafeAreaView>
  )
}

export default NotificationScreen

const styles = StyleSheet.create({})