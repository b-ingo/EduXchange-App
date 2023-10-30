import { StyleSheet, View, SafeAreaView} from 'react-native'
import {Text, TextInput,Button} from 'react-native-paper'
import React, {useState, useEffect} from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import {db, auth} from '../firebase'
import {collection, setDoc, doc, getDocs } from "firebase/firestore"; 
import { Picker } from '@react-native-picker/picker'; // Import Picker from the new package


const SignUpScreen = ({navigation}) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [city, setCity] = useState("")
    const [schoolList, setSchoolList] = useState([])
    const [selectedSchool, setSelectedSchool] = useState()

    useEffect(() => {
      const fetchSchools = async () => {
        console.log("Fetch data")
        const querySnapshot = await getDocs(collection(db, "schools"));
        const schoolList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        //console.log("List", communityList)
        setSchoolList(schoolList);
      };
  
      fetchSchools();
    }, []);

    const signUp = async () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const userId = userCredential.user.uid;
            // Add user data to Firestore
            addUser(userId)
            navigation.navigate('Login',{isFromSignUp:true})
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });
    }

    const addUser = async (userId) => { 
        try{
        await setDoc(doc(db, "users", userId), {
            firstName,
            lastName,
            email,
            phone,
            city,
            totalPoints:20,
            schoolID: selectedSchool.id,
            schoolName: selectedSchool.name
          });

          const docRefPointsHistory = await addDoc(collection(db, "users", userId, 'pointHistory'), {
            points: 20,
            date: Timestamp.now(),
            type: 'Signup points'
          });

      console.log("Document written with ID: ", userId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }


  return (
    <SafeAreaView style={{flex:1, magin:5,}}>
      <Text variant="titleLarge" style={{alignSelf:'center', marginBottom:15}}>Sign Up</Text>
      <TextInput style={styles.input} label="School Email" value={email} onChangeText={setEmail} autoCapitalize='none'/>
      <TextInput style={styles.input} label="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize='none'/>
      <TextInput style={styles.input} label="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} label="Last Name" value={lastName} onChangeText={setLastName} />      
      <TextInput style={styles.input} label="Phone" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} label="City" value={city} onChangeText={setCity} />
      <Picker
          selectedValue={selectedSchool ? selectedSchool.id : ''}
          onValueChange={(itemValue, itemIndex) => {
            const selection = schoolList.find((school) => school.id === itemValue);
            setSelectedSchool(selection);
          }}
        >
          <Picker.Item label="Select a school" value="" />
          {schoolList.map((school) => (
            <Picker.Item key={school.id} label={school.name} value={school.id} />
          ))}
        </Picker>
      <View style={{marginTop:30, marginHorizontal:20}}>
      <Button icon="clipboard-account-outline" mode="contained" onPress={signUp}>
                Sign Up
      </Button>  
      <Button icon="login" style={{marginTop:5}}mode="contained" onPress={() => { navigation.navigate('Login') }}>
          Go to Login
      </Button>
      </View>
    </SafeAreaView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
    input:{backgroundColor:'white', marginVertical:3}
})