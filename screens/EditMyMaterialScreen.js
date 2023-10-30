import {View, StyleSheet, SafeAreaView} from 'react-native'
import { Text, TextInput, Button, Switch, List } from 'react-native-paper';
import React , {useState} from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import {db, auth} from "../firebase"
import { collection, addDoc, Timestamp, doc, updateDoc } from "firebase/firestore"; 

const EditMyMaterialScreen = ({navigation, route}) => {
    const {material} = route.params

    const [title, setTitle] = useState(material.title);
    const [description, setDescription] = useState(material.description);
    const [subject, setSubject] = useState(material.subject);
    const [category, setCategory] = useState(material.category);
    const [duration, setDuration] = useState(material.tradeDuration);
    const [points, setPoints] = useState(material.points);
    const [author, setAuthor] = useState(material.author);
    const [notes, setNotes] = useState(material.notes);
    const [open, setOpen] = useState(false);
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
    const userID = auth.currentUser.uid;

    const onToggleSwitch = () => setIsDigitalOn(!isDigital);

    

    const editMaterial = async() => { 
        const materialRef = doc(db, "materials", material.id);
        try {
            const docRef = await updateDoc(materialRef, {
                userID: userID, 
                title: title,
                description: description,
                subject: subject,
                category: category,
                points: points, 
                author: author,
                tradeDuration: duration,
                notes: notes,
                isDigital: isDigital,
                status: 'available',
                addedDate: Timestamp.fromDate(new Date())
                //photo
            });
      
        navigation.navigate("Home")

      } catch (e) {
        console.error("Error adding document: ", e);
      }
     }

    return (
        <SafeAreaView style={{margin:10}}>
            <Text variant="titleLarge" style={{marginVertical:30}}>Edit My Material</Text>
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
                style={{marginVertical:5}}
            />
            <TextInput label="Title" value={title} onChangeText={text => setTitle(text)} mode="outlined"/>
            <TextInput label="Author of material (if applicable)" value={author} onChangeText={text => setAuthor(text)} mode="outlined"/>
            <TextInput label="Description of your material" value={description} onChangeText={text => setDescription(text)} mode="outlined"/>
            <TextInput label="Class Subject" value={subject} onChangeText={text => setSubject(text)} mode="outlined"/>
            <TextInput label="Duration of trade" value={duration} onChangeText={text => setDuration(text)} mode="outlined"/>
            <TextInput label="Points wanted" value={points} onChangeText={text => setPoints(text)} mode="outlined"/>
            <TextInput label="Notes about your material" value={notes} onChangeText={text => setNotes(text)} mode="outlined"/>
            <List.Item
            title="Is your material digital?"
            right={() => (
                <Switch value={isDigital} onValueChange={onToggleSwitch} />
            )}/>
            <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:20}}>
            <Button icon="file-document-edit-outline" mode="contained" onPress={editMaterial} style={{ width: 150 }} >
                Save
            </Button>
            <Button icon="cancel" mode="contained" onPress={()=>navigation.navigate('Home')} style={{ width: 150 }} >
                Cancel
            </Button>
            </View>
        </SafeAreaView>
    )
}

export default EditMyMaterialScreen

const styles = StyleSheet.create({
})