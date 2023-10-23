import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, {useState} from 'react'
import { TextInput, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {db, auth} from '../firebase'
import { addDoc, collection, setDoc, doc } from "firebase/firestore"; 

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  //Create an account
  const signUpUser = async() => { 
    createUserWithEmailAndPassword(auth, email, password)
    .then( (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        addUser(user.uid)
        console.log("User created", user)
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });
  }
  
  //Add an user in users collection
  const addUser = async (id) => { 
    try {
      const userDocRef = doc(db, "users", id);
  
      await setDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
      });
  
      console.log("Document written with ID: ", id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  
  return (
    <SafeAreaView>
        <View style={{margin:10, justifyContent: 'space-around' }}>
        <Text variant="titleLarge">Sign Up</Text> 
        <View style={{marginVertical:40}}>
            <TextInput label="Email" value={email} onChangeText={text => setEmail(text)} />
            <TextInput label="Password" value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} />
            <TextInput label="First Name" value={firstName} onChangeText={text => setFirstName(text)} />
            <TextInput label="Last Name" value={lastName} onChangeText={text => setLastName(text)} />
        </View>
        <Button icon="camera" mode="elevated" onPress={signUpUser}>
            Sign Up
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({})