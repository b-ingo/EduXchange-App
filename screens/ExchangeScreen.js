import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card, Avatar, IconButton } from 'react-native-paper';
import { collection, addDoc, Timestamp, doc, query, getDoc, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const ExchangeScreen = ({ navigation, route }) => {
  const [notes, setNotes] = useState('');
  const [tradeLocation, setTradeLocation] = useState([]);
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [rating, setRating] = useState('');
  const [user, setUser] = useState();
  const [trade, setTrade] = useState(null);
  const [tradeDuration, setTradeDuration] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const { material } = route.params

  const categoryToIcon = {
    books: 'book-open-page-variant-outline',
    notes: 'notebook-outline',
    video: 'video-outline',
    examGuides:'palette-swatch',
    maerials:'clipboard-text',
    supplies:'pencil-ruler',
    default: 'palette-swatch', // Provide a default icon for unknown categories
  };

  const icon = categoryToIcon[material.category] || categoryToIcon.default;

  console.log("MATERIAL----------------------------", material)
  const userID = auth.currentUser.uid;
  useEffect(() => {
    // Fetch data from Firebase Firestore
    const fetchUserData = async () => {
      console.log("Fetch user started")
      const docRef = doc(db, "users", material.userID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userFromFirebase = { id: userID, ...docSnap.data() }
        console.log('*****', userFromFirebase)
        fetchSchoolTradeLocation(userFromFirebase.schoolID)
        setUser(userFromFirebase)
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }

    };

    const fetchSchoolTradeLocation = async (schoolID) => {
      const schoolRef = doc(db, 'schools', schoolID);
      const query = collection(schoolRef, 'tradeLocation');
      const querySnapshot = await getDocs(query);

      const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(docsData)
      setTradeLocation([...docsData])
    };
    fetchUserData();
  }, []);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateTime;
    setShowPicker(Platform.OS === 'ios');
    setDateTime(currentDate);
  };

  const handleRequest = async () => {
    try {
      const docRef = await addDoc(collection(db, "trades"), {
        materialID: material.id,
        materialTitle: material.title,
        providerID: material.userID,
        receiverID: userID,
        createdDate: Timestamp.now(),
        points: material.points ?? 0,
        notes: notes,
        tradeStatus: 'pending',
        tradeDuration: tradeDuration,
        location: location,
        availableDateTime: dateTime
      });
      try {
        const docProviderMessageRef = await addDoc(collection(db, "messages"), {
          userID: material.userID,
          senderID: userID,
          tradeID: docRef.id,
          sentDate: Timestamp.now(),
          idRead:false,
          materialTitle:material.title,
          message:"Trade request"
        });
        console.log("Document written with ID: ", docProviderMessageRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      try {
        const docProviderMessageRef = await addDoc(collection(db, "messages"), {
          userID: userID,
          senderID: material.userID,
          tradeID: docRef.id,
          sentDate: Timestamp.now(),
          isRead:false,
          materialTitle:material.title
        });
        console.log("Document written with ID: ", docProviderMessageRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      console.log("Document written with ID: ", docRef.id);
      navigation.navigate('Home')
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    //todo::::: change material status to pending
  };

  const renderRatingTextInput = () => {
    if (trade && trade.status === 'pending') {
      return (
        <TextInput
          label="Add Rating"
          value={rating}
          onChangeText={(text) => setRating(text)}
          keyboardType="numeric"
          style={styles.input}
        />
      );
    } else {
      // Return null or an empty view if you don't want to render anything
      return null;
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Material information */}
      <View>
        
          <Card.Title
            title={material.title}
            subtitle={user?.firstName + ' ' + user?.lastName}
            left={(props) => <Avatar.Icon {...props} icon={icon} />}
            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => setShowUserInfo(!showUserInfo)} />}
          />
          <Card.Content>
		    <TouchableOpacity onPress = {() => navigation.navigate("User Info", {user:user})}><Text variant="titleMedium">View Seller Information</Text></TouchableOpacity>
            <Text variant="titleMedium">{material.description}</Text>
            <Text variant="titleMedium">{material.points}points needed to purchase</Text>
            <Text variant="titleMedium">Trade duration:{material.tradeDuration}</Text>
          </Card.Content>
          {showUserInfo &&
            <Card.Content>
              <Text variant="bodyMedium">{user.email}</Text>
              <Text variant="bodyMedium">{user.school}</Text>
            </Card.Content>
          }
       
      </View>
      <View style={styles.formContainer}>
        <TextInput
          label="Notes"
          value={notes}
          onChangeText={(text) => setNotes(text)}
          style={styles.input}
        />

        {/* <TextInput
          label="Trade Location"
          value={location}
          onChangeText={(text) => setLocation(text)}
          style={styles.input}
        /> */}



        <TextInput
          label="How long are you going to trade for?"
          value={tradeDuration}
          onChangeText={(text) => setTradeDuration(text)}
          style={styles.input}
        />

        <View style={{flexDirection:'row'}}>
        <Text variant="titleMedium">Set trade date time</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={dateTime}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
</View>
        <Picker
          selectedValue={location ? location : ''}
          onValueChange={(itemValue, itemIndex) => {
            setLocation(itemValue);
          }}
        >
          <Picker.Item label="Select a trade location" value="" />
          {tradeLocation.map((location) => (
            <Picker.Item key={location.id} label={location.name} value={location.name} />
          ))}
        </Picker>

        {renderRatingTextInput()}

        <View style={styles.buttonContainer}>
          <Button mode="contained" style={styles.button} onPress={handleRequest}>
            Request
          </Button>
          {trade &&
            <Button mode="contained" style={styles.button} onPress={handleFinishTrade}>
              Finish Trade
            </Button>
          }
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Set your background color here
  },
  formContainer: {
    backgroundColor: '#fff', // Set your form background color here
    padding: 10,
    borderRadius: 8, // Add rounded corners
    elevation: 4, // Add shadow for a card-like effect
  },
  input: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#007AFF', // Customize button color
  },
});

export default ExchangeScreen;