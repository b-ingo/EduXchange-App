import {View, StyleSheet, SafeAreaView} from 'react-native'
import { Text, TextInput, Button, Switch, List } from 'react-native-paper';
import React , {useState} from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import {db, auth} from "../firebase"
import { collection, addDoc, Timestamp, updateDoc, doc } from "firebase/firestore"; 
import HomeScreen from './HomeScreen';

const EditMyNeedScreen = ({navigation, route}) => {
    const {material} = route.params

    const [title, setTitle] = useState(material.title);
    const [author, setAuthor] = useState(material.author);
    const [subject, setSubject] = useState(material.subject);
    const [points, setPoints] = useState(material.points);
    const [notes, setNotes] = useState(material.notes);
    const [duration, setDuration] = useState(material.duration);
    const [category, setCategory] = useState(material.category);
    const [open, setOpen] = useState(material.open);
    const [items, setItems] = useState([
      {label: 'Books', value: 'books'},
      {label: 'Class Notes', value: 'notes'},
      {label: 'Exam Study Guides', value: 'examGuides'},
      {label: 'Class Materials', value: 'materials'},
      {label: 'Supplies', value: 'supplies'},
      {label: 'Educational Videos', value: 'videos'},
      {label: 'Tutoring', value: 'tutoring'},
    ]);

    const [isDigital, setIsDigitalOn] = React.useState(false);
    const onToggleSwitch = () => setIsDigitalOn(!isDigital);

    const userID = auth.currentUser.uid;

    const editRequest = async() => { 
        const materialRef = doc(db, "materialWanted", material.id);
        try {
            const docRef = await updateDoc(materialRef, {
                userID: userID, 
                title: title,
                author: author,
                subject: subject,
                category: category,
                points: points, 
                duration: duration, 
                notes: notes,
                wantDigital: isDigital,
                status: 'requested',
                addedDate: Timestamp.fromDate(new Date())
            });
      
        navigation.navigate("Home");

      } catch (e) {
        console.error("Error adding document: ", e);
      }
     }

    return (
        <SafeAreaView style={{margin:7}}>
            <Text variant="titleLarge" style={{marginVertical:30}}>Edit My Needs</Text>
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
            <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:20}}>
            <Button icon="file-document-edit-outline" mode="contained" onPress={editRequest}>
                Save
            </Button>
            <Button icon="cancel" mode="contained" onPress={()=>navigation.navigate('Home')}>
                Cancel
            </Button>
            </View>
        </SafeAreaView>
    )
}

export default EditMyNeedScreen

const styles = StyleSheet.create({
    
})