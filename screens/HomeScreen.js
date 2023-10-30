import { StyleSheet, View, SafeAreaView, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import { Text, Button, IconButton, Divider, Badge, Avatar, Card, AnimatedFAB } from 'react-native-paper';
import { useEffect, useState } from 'react'
import React from 'react'
import { db, auth } from '../firebase'
import { doc, getDoc, collection, query, where, getDocs, or, and } from "firebase/firestore";
import CompactCardHeader from '../components/CompactCardHeader';


const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState({});
    const [materials, setMaterials] = useState([])
    const [isExtended, setIsExtended] = useState(true);
    const [trades, setTrades] = useState([])
    const [materialWanted, setMaterialWanted] = useState([])
    const [newMessages, setNewMessages] = useState([])

    const userID = auth.currentUser.uid;

    useEffect(() => {
        // Add a navigation listener to re-fetch data when the screen is focused
        const unsubscribe = navigation.addListener('focus', () => {
            fetchUserData();
            fetchMaterials();
            fetchTrades();
            fetchNeeds();
            fetchNewMessages();
        });

        // Clean up the listener when the component unmounts
        return unsubscribe;
    }, [navigation]);


    // Fetch data from Firebase Firestore
    const fetchUserData = async () => {
        const docRef = doc(db, "users", userID);
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

    const fetchMaterials = async () => {
        const q = query(collection(db, "materials"), where("userID", "==", userID));
        const querySnapshot = await getDocs(q);
        const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(docsData)
        setMaterials([...docsData])
    };

    const fetchTrades = async () => {
        const q = query(collection(db, "trades"), or(where("providerID", "==", userID), where("receiverID", "==", userID)));
        const querySnapshot = await getDocs(q);
        const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(docsData)
        setTrades([...docsData])
    };

    const fetchNeeds = async () => {
        const q = query(collection(db, "materialWanted"), where("userID", "==", userID));
        const querySnapshot = await getDocs(q);
        const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(docsData)
        setMaterialWanted([...docsData])
    };

    const fetchNewMessages = async () => {
        const q = query(collection(db, "messages"), and(where("isRead", "==", false), where("userID", "==", userID)));
        const querySnapshot = await getDocs(q);
        const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(docsData)
        setNewMessages([...docsData])
    };





    useEffect(() => {
        console.log("Materials::::::", materials)
    }, [materials])

    const renderItem = ({ item }) => {
        return (
            <CompactCardHeader
                item={item}
                onEditPress={() => navigation.navigate('EditMyMaterial', { material: item })}
            />
        );
    };


    const renderIwantItem = ({ item }) => {
        return (
            <CompactCardHeader
                item={item}
                onEditPress={() => navigation.navigate('EditMyNeed', { material: item })}
            />
        );
    };


    const renderTradeItem = ({ item }) => (
        <View>
            <Card.Title
                title={item.materialTitle}
                right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => navigation.navigate("Trade Detail", { trade: item })} />}
            />
            <Card.Content>
                <Text variant="bodyMedium">{item.points} points {item.availableDateTime?.toDate().toDateString()} | {item.location}</Text>
            </Card.Content>
        </View>
    )

    return (
        <SafeAreaView style={{ marginHorizontal: 10 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text variant="titleMedium">Hi {user.firstName}!</Text>
                <Button icon="piggy-bank-outline" mode="text" onPress={() => navigation.navigate('Point History')} >{user.totalPoints || 0}
                </Button>
                <View style={{ flexDirection: 'row', }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton
                            icon="bell-outline"
                            size={30}
                            onPress={() => navigation.navigate("Notification")}
                        />
                        <View style={{ position: 'absolute', right: 10, top: -2 }}>
                            {newMessages.length > 0 ? (
                                <Badge style={{ width: 12 }}>
                                    {newMessages.length}
                                </Badge>
                            ) : null}
                        </View>
                    </View>
                </View>
            </View>
            <Divider />
            {/* Current Trade */}
            <View style={{ marginVertical: 5 }}>
                <Text variant="titleMedium" style={{ color: "#708090", fontWeight: 'bold' }}>Current Trade </Text>

                <FlatList data={trades.filter((item) => item.tradeStatus === 'pending' || item.tradeStatus === 'accepted')} renderItem={renderTradeItem} />
                <Divider />
            </View>
            {/* Material I have */}
            <View style={{ marginVertical: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: "#708090", fontWeight: 'bold' }}>Materials I have</Text>
                    <Button
                        icon="plus"
                        mode="contained-tonal"
                        labelStyle={{ marginLeft: 5 }} // Adjust the margin as needed
                        onPress={() => navigation.navigate('AddMyMaterial')}
                    >
                    </Button>
                </View>
                {
                    materials && materials.length > 0 ? (
                        <FlatList
                            data={materials}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            style={{ height: 160 }}
                            showsVerticalScrollIndicator={true}
                        />
                    ) : (
                        <Text>You can add materials to trade</Text>
                    )
                }

                <Divider />
            </View>
            {/* Material I want */}
            <View style={{ marginVertical: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, justifyContent: 'space-between' }}>
                    <Text variant="titleMedium" style={{ color: "#708090", fontWeight: 'bold' }}>Materials I want</Text>
                    <Button
                        icon="plus"
                        mode="contained-tonal"
                        labelStyle={{ marginLeft: 5 }} // Adjust the margin as needed
                        onPress={() => navigation.navigate('AddMyNeed')}
                    >
                    </Button>
                </View>
                {materialWanted && materialWanted.length > 0 ? (
                    <FlatList
                        data={materialWanted}
                        renderItem={renderIwantItem}
                        keyExtractor={(item) => item.id}
                        style={{ height: 100 }}
                        showsVerticalScrollIndicator={true}
                    />
                ) : (
                    // Placeholder content when there's no data
                    <Text>You can add materials you need</Text>
                )}
                <Divider />
            </View>
            <View style={{ marginVertical: 5 }}>
                <Text variant="titleMedium" style={{ color: "#708090", fontWeight: 'bold' }}>Trade History </Text>

                <FlatList data={trades.filter((item) => item.tradeStatus != 'pending')} renderItem={renderTradeItem} />
                <Divider />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        margin: 10,
        backgroundColor: 'white'
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    }, avatar: {
        backgroundColor: '#63529F',
        marginRight: 10,
    },
    title: {
        flex: 1,
        fontSize: 14, // smaller font size
    },
});