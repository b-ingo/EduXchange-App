import {View, StyleSheet, SafeAreaView} from 'react-native'
import { Text, TextInput, Button, Switch, List } from 'react-native-paper';
import React , {useState} from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import {db, auth} from "../firebase"
import { collection, addDoc } from "firebase/firestore"; 
import HomeScreen from './HomeScreen';

const AddMyNeedScreen = ({navigation}) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [subject, setSubject] = useState("");
    const [points, setPoints] = useState("");
    const [notes, setNotes] = useState("");
    const [duration, setDuration] = useState("");
    const [category, setCategory] = useState("");
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
      {label: 'Books', value: 'books'},
      {label: 'Class Notes', value: 'notes'},
      {label: 'Exam Study Guides', value: 'exam guides'},
      {label: 'Class Materials', value: 'materials'},
      {label: 'Supplies', value: 'supplies'},
      {label: 'Educational Videos', value: 'videos'},
      {label: 'Tutoring', value: 'tutoring'},
    ]);

    const [isDigital, setIsDigitalOn] = React.useState(false);
    const onToggleSwitch = () => setIsDigitalOn(!isDigital);

    const userID = auth.currentUser.uid;

    const addRequest = async() => { 
        try {
            const docRef = await addDoc(collection(db, "materialWanted"), {
                userID: userID, 
                title: title,
                author: author,
                subject: subject,
                category: category,
                points: points, 
                duration: duration, 
                notes: notes,
                wantDigital: isDigital,
                status: 'available',
                addedDate: Timestamp.fromDate(new Date())
                //status
                //addedDate
            });
      
        console.log("Document written with ID: ", docRef.id);

        navigation.navigate("Home");

      } catch (e) {
        console.error("Error adding document: ", e);
      }
     }

    return (
        <SafeAreaView style={{margin:7}}>
            <Text variant="titleLarge">Add My Needs</Text>
            <DropDownPicker
                open={open}
                value={category}
                items={items}
                setOpen={setOpen}
                setValue={setCategory}
                setItems={setItems}

                theme="LIGHT"
                mode="BADGE"
                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                placeholder="Select a category"
                style={{marginVertical:7}}
            />
            <TextInput label="Title" value={title} onChangeText={text => setTitle(text)} mode="outlined"/>
            <TextInput label="Author of material (if applicable)" value={author} onChangeText={text => setAuthor(text)} mode="outlined"/>
            <TextInput label="Class Subject" value={subject} onChangeText={text => setSubject(text)} mode="outlined"/>
            <TextInput label="Points you can pay" value={points} onChangeText={text => setPoints(text)} mode="outlined"/>
            <TextInput label="How long would you like the material?" value={duration} onChangeText={text => setDuration(text)} mode="outlined"/>
            <TextInput label="Notes about your request" value={notes} onChangeText={text => setNotes(text)} mode="outlined"/>
            <List.Item
            title="Would you like digital materials?"
            right={() => (
                <Switch value={isDigital} onValueChange={onToggleSwitch} />
            )}/>
            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
            <Button icon="plus-circle" mode="contained" onPress={addRequest}>
                Add Request
            </Button>
            <Button icon="cancel" mode="contained" onPress={()=>navigation.navigate('Home')}>
                Cancel
            </Button>
            </View>
        </SafeAreaView>
    )
}

export default AddMyNeedScreen

const styles = StyleSheet.create({
    
})