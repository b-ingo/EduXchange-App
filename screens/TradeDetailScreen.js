import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native'
import { Avatar, Card } from 'react-native-paper';
import React, { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { db, auth } from '../firebase';
import { Divider, Text, Button, TextInput } from 'react-native-paper';
import StarRating from 'react-native-star-rating';

const TradeDetailScreen = ({ navigation, route }) => {
  let { trade } = route.params
  const [tradeInfo, setTradeInfo] = useState({ ...trade })
  const [material, setMaterial] = useState()
  const [user, setUser] = useState()
  const [buyer, setBuyer] = useState()
  const [note, setNote] = useState()
  const [averageRating, setAverageRating] = useState(0);

  const userID = auth.currentUser.uid

  useEffect(() => {
    // read all materials
    const fetchMaterial = async () => {
      const docRef = doc(db, "materials", trade.materialID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMaterial({ id: docSnap.id, ...docSnap.data() })
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    const fetchUser = async () => {
      const docRef = doc(db, "users", trade.providerID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser({ id: docSnap.id, ...docSnap.data() })
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    const fetchBuyer = async () => {
      const docRef = doc(db, "users", trade.receiverID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBuyer({ id: docSnap.id, ...docSnap.data() })
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    fetchMaterial();
    fetchUser();
    fetchBuyer()
  }, []);

  useEffect(() => {
    console.log(user)
  }, [user]) //only does if material is changed

  const updateTrade = async (status) => {
    try {
      const docRef = doc(db, "trades", trade.id); // Assuming "trades" is the collection name
      await updateDoc(docRef, { tradeStatus: status }); // Make sure to import updateDoc from firebase/firestore
      setTradeInfo({ ...tradeInfo, tradeStatus: status })
      console.log("Trade updated");
      try {
        const docRef = await addDoc(collection(db, "messages"), {
          userID: tradeInfo.providerID == userID ? tradeInfo.senderID : tradeInfo.providerID,
          senderID: userID,
          tradeID: tradeInfo.id,
          sentDate: Timestamp.now(),
          points: material.points ?? 0,
          notes: notes,
          tradeStatus: 'pending',
          tradeDuration: tradeDuration,
          location: location,
          availableDateTime:dateTime
        });
        console.log("Document written with ID: ", docRef.id);
        navigation.navigate('Home')
      } catch (e) {
        console.error("Error adding document: ", e);
      }

    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };


  return (
    <SafeAreaView style={{ margin: 15 }}>

      <View style={{ marginVertical: 10 }}>
        <Text variant="titleMedium">Material: {material?.title} - {material?.category}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("User Info", { user: user })}>
          <Text variant="bodyMedium" style={{ color: 'blue' }}>Name: {user?.firstName} {user?.lastName}</Text>
        </TouchableOpacity>
        <Text variant="bodyMedium">Email: {user?.email}</Text>
        <Text variant="bodyMedium">Phone: {user?.phoneNumber}</Text>
      </View>
      <View style={{ marginVertical: 15 }}>
        <Divider />
        <Text variant="titleLarge">Trade Information</Text>
        <Text variant="bodyMedium">Created Date: {tradeInfo.createdDate?.toDate().toDateString()}</Text>
        <Text variant="bodyMedium">Available Date: {tradeInfo.availableDateTime?.toDate().toDateString()}</Text>
        <Text variant="bodyMedium">Status: {tradeInfo.tradeStatus}</Text>
        <Text variant="bodyMedium">Location: {tradeInfo.location}</Text>
        <Text variant="bodyMedium">Trade Duration: {tradeInfo.tradeDuration}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("User Info", { user: buyer })}>
          <Text variant="bodyMedium" style={{ color: 'blue' }}>Name: {buyer?.firstName} {buyer?.lastName}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 20 }}>
        <Text variant="titleMedium">Notes: {trade.notes}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextInput
            label="Add Note"
            value={note}
            onChangeText={text => setNote(text)}

            style={{ width: 250 }}
          />
          <Button mode="contained" >
            Add
          </Button>
        </View>

        <View style={{ flexDirection: 'row' }}>
          {tradeInfo.tradeStatus === 'pending' && tradeInfo.providerID === userID && (
            <Button mode="contained" style={{ margin: 30 }} onPress={() => updateTrade("accepted")}>
              Accept
            </Button>
          )}
          <Button mode="contained" style={{ margin: 30 }} onPress={() => updateTrade("rejected")}>
            Decline
          </Button>
        </View>
        {tradeInfo.tradeStatus === 'accepted' && tradeInfo.providerID != userID && (
          <View>
            <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={averageRating}
                        selectedStar={setAverageRating}
                        starSize={10} // Customize the size of the stars
                        fullStarColor={'orange'} // Customize the color of the filled stars
                    />
          <Button mode="contained" style={{ margin: 30 }} onPress={() => updateTrade("completed")}>
            Complete Trade
          </Button>
          </View>
        )}

      </View>
    </SafeAreaView>
  )
}

export default TradeDetailScreen

const styles = StyleSheet.create({

})