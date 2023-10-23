import { StyleSheet, View, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider, Card, IconButton, Text } from 'react-native-paper';
import { db, auth } from '../firebase'
import StarRating from 'react-native-star-rating';
import { doc, getDoc, collection, query, where, getDocs, or, updateDoc, deleteDoc } from "firebase/firestore";

const UserInfoScreen = ({ navigation, route }) => {
    const userID = auth.currentUser.uid
    const { user } = route.params
    const [ratings, setRatings] = useState([])
    const [averageRating, setAverageRating] = useState(0)
    useEffect(() => {
        // Read all messages
        const fetchRatings = async () => {
            console.log(user.id)
            const userRef = doc(db, 'users', user.id); // Create a reference to the user document
            const query = collection(userRef, 'ratings'); // Create a reference to the "pointHistory" subcollection         
            const querySnapshot = await getDocs(query);
            const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            console.log(docsData)
            setRatings([...docsData.sort((a, b) => b.date - a.date)])

            // Calculate average rating
            if (docsData.length > 0) {
                const totalRating = docsData.reduce((accumulator, currentValue) => accumulator + currentValue.rating, 0);
                const averageRating = totalRating / docsData.length;
                console.log('Average rating:', averageRating);
                setAverageRating(averageRating); // Set the average rating in state
            }
        };
        fetchRatings();
    }, []);


    const renderItem = ({ item }) => (

        <Card.Title
            title={item.materialTitle}
            subtitle={item.date.toDate().toDateString()}
            left={(props) => <StarRating
                disabled={false}
                maxStars={5}
                rating={item.rating}
                //selectedStar={onStarRatingPress}
                starSize={10} // Customize the size of the stars
                fullStarColor={'orange'} // Customize the color of the filled stars
            />}
            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => { }} />}
        />

    );


    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', padding: 10 }}>
                <Text variant="titleMedium">{user?.firstName} {user?.lastName}</Text>

                <Text variant="bodyMedium">Email: {user?.email}</Text>
                <Text variant="bodyMedium">Phone: {user?.phoneNumber}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Text>Overall Rating: </Text>
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={averageRating}
                        //selectedStar={onStarRatingPress}
                        starSize={10} // Customize the size of the stars
                        fullStarColor={'orange'} // Customize the color of the filled stars
                    />
                </View>
            </View>
            <Text variant="headlineSmall">Trade history</Text>
            <FlatList data={ratings} renderItem={renderItem} />
        </SafeAreaView>
    )
}

export default UserInfoScreen

const styles = StyleSheet.create({})