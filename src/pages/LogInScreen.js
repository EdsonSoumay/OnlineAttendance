import React from 'react'

import { StyleSheet, Text, View, Dimensions, ScrollView,  TouchableOpacity, Platform, StatusBar, Alert, BackHandler } from 'react-native'

import { VOCSLogoSmall } from '../assets/logo'
import { Button, Gap, Input } from '../components'
import { backGroundColor, fontFamilyMedium, fontFamilyRegular, fontSizeBig, fontSizeExtraSmall, fontSizeSmall, mainBorder, secondColor } from '../utils'
import LinearGradient from 'react-native-linear-gradient'
import { mainColor } from '../utils'
import { useTheme } from 'react-native-paper';
import { HideIcon, ShowIcon } from '../assets/icon';
import axios from 'axios'
import { urlEndpointAPI } from '../utils'
import { storeData } from '../localStorage'

import { useMyContext } from '../Context';

const windowHeight = Dimensions.get('window').height;
// const windowWidth = Dimensions.get('window').width * 0.833;
const windowWidth = Dimensions.get('window').width * 0.777;


const AuthContext = React.createContext();

const LogInScreen = (props) => {
const { showFlash, message, isVisible, state, setState } = useMyContext();

  const { colors } = useTheme();

  const [data, setData] = React.useState({
      username: '',
      password: '',
      check_textInputChange: false,
      secureTextEntry: false,
      isValidUser: true,
      isValidPassword: true,
  });

//   console.log("password:", data);
  // const {signIn} = React.useContext(AuthContext)

  const textInputChange = (val) => {

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

  const handlePasswordChange = (val) => {
          setData({
              ...data, 
              password:val,
              isValidPassword: true
          })
     
  }

  const updateSecureTextEntry = () => {
      setData({
          ...data,
          secureTextEntry: !data.secureTextEntry
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

  const loginHandle = async ()=>{
    let userLogin = {userName: data.username, password: data.password, division:''}
    
    let responseLogin = '' 
        await axios.post(`${urlEndpointAPI}/login`,userLogin)
            .then(function (response) {
                responseLogin = response.data.message
                userLogin.role = response.data.role !== undefined ? response.data.role : '-'
                userLogin.status = response.data.status 
                userLogin.division = response.data.division !== undefined ? response.data.division : '-'
                userLogin.id = response.data.id 
                userLogin.email = response.data.email
                userLogin.firstName = response.data.firstName !== undefined ? response.data.firstName : '-'
                userLogin.lastName = response.data.lastName !== undefined ? response.data.lastName : '-'
            })
            .catch(function (error) {
            console.log(error);
            });

        if(responseLogin == 'user successfuly login'){
            await storeData('userSession',userLogin)
            .then((e)=>{
                props.navigation.replace('MainBottomTab')
            })
        }
        else{
            Alert.alert('Wrong Input!', `${responseLogin}`,[
                          {text:'Okay'}
                      ]); 
        }

  }

  
  return (
    <View style={{backgroundColor:backGroundColor.color, flex: 1, alignItems:'center'}}>
       
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
                    placeholder ="Your Username"
                    styleInput={{
                        color: colors.text
                    }}
                    autoCapitalize="none"
                    onChangeText={(val)=>textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
       </View>
       <Gap height={20}/>
       <View style={{justifyContent:'center'}}>
        <Input
            styleText={styles.styleText}
            styleView={styles.styleView}
            text={'Password'}
            placeholder ="Your Password"
            styleInput={{
                color: colors.text
            }}
            autoCapitalize="none"
            secureTextEntry={data.secureTextEntry?true:false}
            onChangeText={(val)=>handlePasswordChange(val)}
            icon = {data.secureTextEntry? <HideIcon/>:<ShowIcon/>}
            onPressIcon={updateSecureTextEntry}
        />
       </View>
       <Gap height={10}/>
       <TouchableOpacity 
        style={{flexDirection:'row', justifyContent:'flex-end',  width: windowWidth}}
        onPress={()=>props.navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={{fontFamily:fontFamilyRegular.fontFamily, fontSize:fontSizeSmall.fontSize, color: '#000000'}}>Forget Pasword</Text>
       </TouchableOpacity>
       <Gap height={25}/>
       <View style={{flexDirection:'row', justifyContent:'center'}}>
        <LinearGradient
                style={[ styles.buttonContainer, {width: windowWidth}]}
                colors={[styles.buttonContainer.startGradient,styles.buttonContainer.endGradient,]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
                <Button
                        styleContainer={{width:'100%'}}  
                        // onPress={()=>props.navigation.navigate('MainBottomTab')}
                        onPress={()=>loginHandle()}
                        name = 'Login' 
                        color={secondColor.color}
                        size = {fontSizeBig.fontSize} 
                        fontFamily={fontFamilyMedium.fontFamily} 
                        textAlign ='center'
                    />
        </LinearGradient>
      </View>
      <Gap height={29}/>
    <View style={{flexDirection:'row', justifyContent:'center'}}>
        <Text style={{fontFamily:fontFamilyRegular.fontFamily, fontSize:fontSizeSmall.fontSize}}>Don’t have an account ?</Text>
        <Gap width={7}/>
        <TouchableOpacity 
         onPress={()=>props.navigation.navigate('SignUpScreen')}
        >
            <Text style={{fontFamily:fontFamilyMedium.fontFamily, fontSize:fontSizeSmall.fontSize, color:'#173C90'}}>Create new account</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>
    </View>
  )
}

export default LogInScreen

const styles = StyleSheet.create({
  buttonContainer:{
    startGradient: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.80)`,
    endGradient: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, ${mainColor.a})`,
    width: '100%',
    borderRadius: mainBorder.borderRadius,
    height:45,justifyContent:'center', alignItems:'center', 
    borderRadius: mainBorder.borderRadius,
  },

  styleText:{fontFamily: fontFamilyMedium.fontFamily, fontSize: fontSizeBig.fontSize, color:'#000000'},
  styleView:{width: windowWidth,borderWidth: 1, borderBottomColor: '#173C90', borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, flexDirection:'row', alignItems:'center', justifyContent:'space-between'},
  flashContainer: {
    // padding: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 0,
    marginBottom: 0,
  },
  flashMessage: {
    fontSize: 18,
    textAlign: 'center',
  },
})