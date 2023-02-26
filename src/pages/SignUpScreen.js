import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import React from 'react';
import {VOCSLogoSmall} from '../assets/logo';
import {Button, Gap, Input} from '../components';
import {
  backGroundColor,
  fontFamilyMedium,
  fontFamilyRegular,
  fontSizeBig,
  fontSizeSmall,
  mainBorder,
  secondColor,
} from '../utils';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from 'react-native-paper';
import { HideIcon, ShowIcon } from '../assets/icon';
import axios from 'axios';
 import { urlEndpointAPI } from '../utils';
import {mainColor} from '../utils';
import { useMyContext } from '../Context';

const windowWidth = Dimensions.get('window').width * 0.777;

const SignUpScreen = (props) => {
const { showFlash, message, isVisible, state, setState } = useMyContext();
  

const [data, setData] = React.useState({
  username: '',
  password: '',
  rePassword: '',
  email: '',
  check_textInputChange: false,
  securePasswordEntry: false,
  secureRePasswordEntry: false,
  isValidUser: true,
  isValidPassword: true,
  isValidRePassword: false

});

// const {signIn} = React.useContext(AuthContext)

const textInputUserNameChange = (val) => {

  if(val.trim().length >=4){
      setData({
          ...data, 
          // email:val,
          username:val,
          check_textInputChange:true,
          isValidUser:true
      })
  }
  else{
      setData({
          ...data, 
          // email:val,
          username:val,
          check_textInputChange:false,
          isValidUser:false
      })   
  }
}

const textInputEmailChange = (val) => {

  if(val.trim().length >=4){
      setData({
          ...data, 
          email:val,
          // username:val,
          // check_textInputChange:true,
          // isValidUser:true
      })
  }
  else{
      setData({
          ...data, 
          email:val,
          // username:val,
          // check_textInputChange:false,
          // isValidUser:false
      })   
  }
}



const handlePasswordChange = (val) => {
      setData({
          ...data, 
          password:val,
          isValidPassword: true
      })
}

const handleRePasswordChange = (val) => {
      
        if(val!=data.password){
          setData({
              ...data, 
              rePassword:val,
              isValidRePassword: false
          })
      }
      else{
          setData({
              ...data, 
              rePassword:val,
              isValidRePassword: true
          })
      }
  // setData({
  //         ...data, 
  //         password:val,
  //         isValidPassword: true
  //     })
}


const updateSecurePasswordEntry = () => {
  setData({
      ...data,
      securePasswordEntry: !data.securePasswordEntry
  });
}

const updateSecureRePasswordEntry = () => {
  setData({
      ...data,
      secureRePasswordEntry: !data.secureRePasswordEntry
  });
}


const handleValidUser =(val)=>{
  if(val.trim().length >= 4){
      setData({
          ...data, 
          isValidUser:true
      });
  }else{
      setData({
          ...data,
          isValidUser:false
      });
  }
}

const signUpHandle = async ()=>{

  if(data.isValidRePassword == true){
    let newUser = {userName: data.username, password: data.password,  email : data.email}
    
          await axios.post(`${urlEndpointAPI}/registration`,newUser)
              .then(function (response) {
                 console.log("response sign in:",response)
                 showFlash(response.data.message)
                 if(response.data.message == 'Registration Success'){
                  return props.navigation.replace('LogInScreen')
                 }
                 
              })
              .catch(function (error) {
              console.log(error);
              });
  }
  else{
    showFlash('Please Complete this registration')
  }

// let responseLogin = '' 
//     await axios.post(`${urlEndpointAPI}/login`,userLogin)
//         .then(function (response) {
//             responseLogin = response.data.message
//             userLogin.role = response.data.role
//             userLogin.status = response.data.status
//             userLogin.division = response.data.division
//             userLogin.id = response.data.id
//         })
//         .catch(function (error) {
//         console.log(error);
//         });

//     if(responseLogin == 'user successfuly login'){
//         await storeData('userSession',userLogin)
//         .then((e)=>{
//             props.navigation.replace('MainBottomTab')
//         })
//     }
//     else{
//         Alert.alert('Wrong Input!', `${responseLogin}`,[
//                       {text:'Okay'}
//                   ]); 
//     }

}


  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: backGroundColor.color,
        flex: 1,
        alignItems: 'center',
      }}>
        {isVisible && (
               <View style={styles.flashContainer}>
                   <Text style={styles.flashMessage}>{message}</Text>
                </View>
            )}
      <Gap height={40}/>
      <View style={{alignItems:'center'}}>
        <VOCSLogoSmall />
        <Text style={{fontFamily:'times-new-roman', fontSize: 15}}>Voice Of Computer Science</Text>
      </View>
      <Gap height={30}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
        <Input
                    styleText={styles.styleText}
                    styleView={styles.styleView}
                    text={'User Name'}
                    placeholder ="Enter Your User Name"
                    styleInput={{
                        color: colors.text
                    }}
                    autoCapitalize="none"
                    onChangeText={(val)=>textInputUserNameChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
        </View>
        <Gap height={20} />
        <View style={{justifyContent: 'center'}}>
           <Input
                    styleText={styles.styleText}
                    styleView={styles.styleView}
                    text={'Email'}
                    placeholder ="Enter Your Email"
                    styleInput={{
                        color: colors.text
                    }}
                    autoCapitalize="none"
                    onChangeText={(val)=>textInputEmailChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
        </View>
        <Gap height={20}/>
        <View>
        <Input
            styleText={styles.styleText}
            styleView={styles.styleView}
            text={'Password'}
            placeholder ="Enter Your Password"
            styleInput={{
                color: colors.text
            }}
            autoCapitalize="none"
            secureTextEntry={data.securePasswordEntry?true:false}
            onChangeText={(val)=>handlePasswordChange(val)}
            icon = {data.securePasswordEntry? <HideIcon/>:<ShowIcon/>}
            onPressIcon={updateSecurePasswordEntry}
        />
          
        </View>
        <Gap height={20} />
        <View style={{justifyContent: 'center'}}>
        <Input
            styleText={styles.styleText}
            styleView={styles.styleView}
            text={'Re Password'}
            placeholder ="Re Enter Your Password"
            styleInput={{
                color: colors.text
            }}
            autoCapitalize="none"
            secureTextEntry={data.secureRePasswordEntry?true:false}
            onChangeText={(val)=>handleRePasswordChange(val)}
            icon = {data.secureRePasswordEntry? <HideIcon/>:<ShowIcon/>}
            onPressIcon={updateSecureRePasswordEntry}
        />
        </View>
        <Gap height={10} />
                {   
                    data.rePassword == '' ?null
                    :data.isValidRePassword == true?
                    <Text>Password is matching</Text>
                    :
                    <Text>Password is not matching</Text>
                }
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: windowWidth,
          }}>
        </View>
        <Gap height={25} />
        <LinearGradient
          style={[styles.buttonContainer, {width: windowWidth}]}
          colors={[
            styles.buttonContainer.startGradient,
            styles.buttonContainer.endGradient,
          ]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 1}}>
          <Button
            name="Sign Up"
            size={fontSizeBig.fontSize}
            color={secondColor.color}
            fontFamily={fontFamilyMedium.fontFamily}
            // onPress={() => props.navigation.replace('HomeScreen')}
            onPress={()=>signUpHandle()}
          />
        </LinearGradient>
      </ScrollView>
      <Gap height={20}/>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    startGradient: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.80)`,
    endGradient: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, ${mainColor.a})`,
    width: '100%',
    borderRadius: mainBorder.borderRadius,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: mainBorder.borderRadius,
  },
  styleText:{fontFamily: fontFamilyMedium.fontFamily, fontSize: fontSizeBig.fontSize, color:'#000000'},
  styleView:{width: windowWidth,borderWidth: 1, borderBottomColor: '#173C90', borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, flexDirection:'row', alignItems:'center', justifyContent:'space-between'},
  flashContainer: {
    // padding: 20,
    borderRadius: 0,
    marginBottom: 0,
  },
  flashMessage: {
    fontSize: 18,
    textAlign: 'center',
    // color:'red'
  },
});
