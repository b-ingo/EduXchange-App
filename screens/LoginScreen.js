import { StyleSheet, View, SafeAreaView, Image} from 'react-native'
import {Text, TextInput,Button} from 'react-native-paper'
import React, {useState} from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import {db, auth} from '../firebase'
import {setDoc, doc } from "firebase/firestore"; 

const LogInScreen = ({navigation}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginFailed, setLoginFailed] = useState(false); // State to track login status


    //test login: student6@gmail.com
    const logIn = async () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const userId = userCredential.user;
          // ...
          navigation.navigate('BottomTab')
          setLoginFailed(false);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            setLoginFailed(true);
        });

    }

  return (
    <SafeAreaView style={{flex:1, magin:5, justifyContent:'center'}}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
        {loginFailed && ( // Render the error message when login fails
        <View>
          <Text style={styles.errorText}>Login failed. Please try again.</Text>
        </View>
      )}
      <TextInput style={styles.input} label="Email" autoCapitalize='none' value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} label="Password" autoCapitalize='none' value={password} onChangeText={setPassword} secureTextEntry/>
      <View style={{marginTop:30, marginHorizontal:20}}>
      <Button icon="login-variant" mode="contained" onPress={logIn}>
        Log In
      </Button>  
      <Button style={{marginVertical:10}}icon="login-variant" mode="contained" onPress={()=>navigation.navigate('SignUp')}>
        Sign Up
      </Button>
      </View>
    </SafeAreaView>
  )
}

export default LogInScreen

const styles = StyleSheet.create({
    input:{backgroundColor:'white', marginVertical:3},
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10,
      },
      logo: {
        width: 300,
        height: 300,
        marginBottom: 20,
        alignSelf:'center'
      },
})