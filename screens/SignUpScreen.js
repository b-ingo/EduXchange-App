import { StyleSheet, View, SafeAreaView} from 'react-native'
import {Text, TextInput,Button} from 'react-native-paper'
import React, {useState} from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import {db, auth} from '../firebase'
import {setDoc, doc } from "firebase/firestore"; 

const SignUpScreen = ({navigation}) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [city, setCity] = useState("")

    const signUp = async () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const userId = userCredential.user.uid;
            // Add user data to Firestore
            addUser(userId)
            navigation.navigate('Login')
            
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
            totalPoints:20
          });

      console.log("Document written with ID: ", userId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }


  return (
    <SafeAreaView style={{flex:1, magin:5,}}>
      <TextInput style={styles.input} label="School Email" value={email} onChangeText={setEmail} autoCapitalize='none'/>
      <TextInput style={styles.input} label="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize='none'/>
      <TextInput style={styles.input} label="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} label="Last Name" value={lastName} onChangeText={setLastName} />      
      <TextInput style={styles.input} label="Phone" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} label="City" value={city} onChangeText={setCity} />
      <View style={{marginTop:30, marginHorizontal:20}}>
      <Button icon="clipboard-account-outline" mode="contained" onPress={signUp}>
                Sign Up
      </Button>  
      </View>
    </SafeAreaView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
    input:{backgroundColor:'white', marginVertical:3}
})