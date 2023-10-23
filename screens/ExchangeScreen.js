import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Avatar,IconButton } from 'react-native-paper';
import { collection, addDoc, Timestamp, doc, query, getDoc, where, orderBy, limit,getDocs } from "firebase/firestore";
import { db, auth } from '../firebase'
import DateTimePicker from '@react-native-community/datetimepicker';

const ExchangeScreen = ({ navigation, route }) => {
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('');
    const [dateTime, setDateTime] = useState(new Date());
    const [rating, setRating] = useState('');
    const [user, setUser] = useState();
    const [trade, setTrade] = useState(null);
    const [tradeDuration, setTradeDuration] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);

    const {material} = route.params

    const categoryToIcon = {
      books: 'book-open-page-variant-outline',
      notes: 'notebook-outline',
      video: 'video-outline',
      default: 'default-icon', // Provide a default icon for unknown categories
    };

    const icon = categoryToIcon[material.category] || categoryToIcon.default;

    console.log("MATERIAL----------------------------", material)
    const userID = '0B0LVuaHbe4KuLTNv0Xw'
    useEffect(() => {
        // Fetch data from Firebase Firestore
        const fetchUserData = async () => {
            console.log("Fetch user started")
            const docRef = doc(db, "users", material.userID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userFromFirebase = { id: userID, ...docSnap.data() }
                console.log('*****', userFromFirebase)
                setUser(userFromFirebase)
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }

        };
        fetchUserData();
    }, []);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateTime;
        setShowPicker(Platform.OS === 'ios');
        setDateTime(currentDate);
      };

    const handleRequest = async() => {
        try {
            const docRef = await addDoc(collection(db, "trades"), {
              materialID: material.id,
              providerID: material.userID,
              receiverID: userID,
              createdDate: Timestamp.now(),
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

          //todo::::: change material status to pending
    };

    const handleFinishTrade = () => {
        // Handle the "Finish Trade" button press here
        const finishTradeInfo = `Finished Trade: ${notes}, ${location}, ${dateTime}, ${rating}`;
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
            <Card>
          <Card.Title
            title={material.title}
            subtitle={user?.firstName + ' '+ user?.lastName}
            left={(props) => <Avatar.Icon {...props} icon={icon} />}
            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => setShowUserInfo(!showUserInfo)} />}
          />
          <Card.Content>
          <Text variant="titleMedium">{material.description}</Text>
          <Text variant="titleMedium">{material.points}points needed to purchase</Text>
          <Text variant="titleMedium">Trade duration:{material.tradeDuration}</Text>
        </Card.Content>
        {showUserInfo&&
        <Card.Content>
          <Text variant="bodyMedium">{user.email}</Text>
          <Text variant="bodyMedium">{user.school}</Text>
        </Card.Content>
        }
          </Card>
          </View>
            <View style={styles.formContainer}>
                <TextInput
                    label="Notes"
                    value={notes}
                    onChangeText={(text) => setNotes(text)}
                    style={styles.input}
                />

                <TextInput
                    label="Trade Location"
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                    style={styles.input}
                />

            <DateTimePicker
              testID="dateTimePicker"
              value={dateTime}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />

                <TextInput
                    label="How long are you going to trade for?"
                    value={tradeDuration}
                    onChangeText={(text) => setTradeDuration(text)}
                    style={styles.input}
                />

                {renderRatingTextInput()}

                <View style={styles.buttonContainer}>
                    <Button mode="contained" style={styles.button} onPress={handleRequest}>
                        Request
                    </Button>
                    {trade&&
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
        padding: 16,
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