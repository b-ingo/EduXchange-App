import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View} from 'react-native';
import { TextInput, Button, RadioButton, SegmentedButtons, Card , Text } from 'react-native-paper';
import { db } from '../firebase';
import { collection, getDocs, query, where, or, and } from "firebase/firestore";//FLATLIST FOR RESULTS!! react native paper "card" (card.title)
import { Picker } from '@react-native-picker/picker';

const SearchScreen = ({navigation}) => {
    const [tradeType, setTradeType] = React.useState('toBuy');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [category, setCategory] = useState(''); // Default category to 'books'
    const [matchingMaterials, setMatchingMaterials] = useState([]);


    const handleSearch = async () => {
        console.log("Search started")
        let searchQuery = ''
        if (tradeType == 'toSell') {
            searchQuery = query(collection(db, "materialWanted"), where("category", "==", category), where("status", "==","available"))
        }
        else {
            searchQuery = query(collection(db, "materials"), where("category", "==", category), where("status", "==","available"))
        }
        const querySnapshot = await getDocs(searchQuery);
        const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const filteredDocs = docsData.filter((doc) => ((doc.title?.includes(searchKeyword)) || (doc.subject?.includes(searchKeyword))));
        console.log("All data::::::", docsData)
        console.log("Fitered data:::::::", filteredDocs)
        setMatchingMaterials(filteredDocs);

        //Reference the "users" collection
        // const querySnapshot = await getDocs(collection(db, "users"));
        // querySnapshot.forEach(async (doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log(doc.id, " => ", doc.data());
        //     const querySnapshot = await getDocs(collection(db, "users", doc.id, "materials"));
        //     querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log(doc.id, " => ", doc.data());
        //     });
        //
    }


    return (
        <SafeAreaView style={styles.container}>
            <SegmentedButtons
                value={tradeType}
                onValueChange={setTradeType}
                buttons={[
                    {
                        value: 'toBuy',
                        label: 'To Buy',
                    },
                    {
                        value: 'toSell',
                        label: 'To Sell',
                    }
                ]}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                contentStyle={{ flex: 1 }}
            />


            <TextInput
                label="Search Keyword"
                value={searchKeyword}
                onChangeText={text => setSearchKeyword(text)}
                style={[styles.input, { backgroundColor: 'white' }]}
            />
{!category &&
            <View>
            <Picker style={styles.picker}
                selectedValue={category}
                onValueChange={(itemValue, itemIndex) =>
                    setCategory(itemValue)
                }>
                <Picker.Item label="Select a category" />
                <Picker.Item label="Books" value="books" />
                <Picker.Item label="Notes" value="notes" />
            </Picker>
            </View>
}
{category &&
<View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', marginBottom:10}}>
<Text variant="titleMedium">Category: {category}</Text> 
<Button icon="file-search" mode="elevated" onPress={()=>setCategory('')}>Change category</Button>
</View>
}
            <Button icon="file-search" mode="contained" onPress={handleSearch}>
                Search
            </Button>

            {matchingMaterials.map((material) => (
                <Card key={material.id} style={styles.card}>
                    <Card.Title title={material.title} />
                    <Card.Content>
                        <Text>{material.subject}</Text>
                        {/* Add other content you want to display */}
                    </Card.Content>
                    <Card.Actions>
                        <Button icon="check-circle" mode="elevated" onPress={() => navigation.navigate('Exchange',{material:material})}> Select</Button>
                    </Card.Actions>
                </Card>
            ))}
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 20,
        width: '100%',
    },
    radioGroup: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    radioButton: {
        flex: 1,
    },
    card: {
        marginVertical: 10,
    },
    picker: {
        fontSize: 8, // Adjust the font size as needed
        // height: 30, // Adjust the height as needed
        // width: 200, // Adjust the width as needed
        // Add other styles as needed
    },
});

export default SearchScreen;