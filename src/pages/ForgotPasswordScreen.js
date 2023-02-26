import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import React, {useState} from 'react';
import {VOCSLogoSmall} from '../assets/logo';
import {Button, Gap, Input} from '../components';
import {
  backGroundColor,
  fontFamilyMedium,
  fontSizeBig,
  mainBorder,
  secondColor,
} from '../utils';
import LinearGradient from 'react-native-linear-gradient';
import {mainColor} from '../utils';
import { useTheme } from 'react-native-paper';
import { HideIcon, ShowIcon } from '../assets/icon';
import axios from 'axios';
import { urlEndpointAPI } from '../utils';
import { useMyContext } from '../Context';

const windowWidth = Dimensions.get('window').width * 0.777;

const ForgotPasswordScreen = (props) => {

  const { showFlash, message, isVisible, state, setState } = useMyContext();

  const [Token, setToken] =useState('')

  const { colors } = useTheme();

  const [ButtonStatus, setButtonStatus] = useState('Step 1')

  const [data, setData] = React.useState({
      username: '',
      password: '',
      re_password: '',
      email:'',
      token:'',
      check_textInputChange: false,
      secureTextEntryPassword: false,
      secureTextEntryRePassword: false,
      isValidUser: true,
      isValidPassword: true,
      isValidRePassword: false
  });

  // const {signIn} = React.useContext(AuthContext)


  const handlePasswordChange = (val) => {
      if(val.trim().length >=8){
          setData({
              ...data, 
              password:val,
              isValidPassword: true
          })
       }else{
          setData({
              ...data, 
              password:val,
              isValidPassword: false
          })
       }
  }

  const updateSecureTextEntryPassword = () => {
      setData({
          ...data,
          secureTextEntryPassword: !data.secureTextEntryPassword
      });
  }

  const handleRePasswordChange = (val) => {

    if(val!=data.password){
        setData({
            ...data, 
            re_password:val,
            isValidRePassword: false
        })
    }
    else{
        setData({
            ...data, 
            re_password:val,
            isValidRePassword: true
        })
    }
    
}

const updateSecureTextEntryRePassword = () => {
    setData({
        ...data,
        secureTextEntryRePassword: !data.secureTextEntryRePassword
    });
}



  const submitHandle = async ()=>{
      let userLogin ={userName: data.username, email: data.email, password: data.password}

      let responseLogin = '' 

        await axios.put(`${urlEndpointAPI}/forgotpassword`,userLogin)
            .then(function (response) {
                responseLogin = response.data.message
                showFlash(response.data.message);
            })
            .catch(function (error) {
            console.log(error);
            });


        if(responseLogin == 'Update Password Sucess'){
                props.navigation.replace('LogInScreen')
        }
        else{
            Alert.alert('Wrong Input!', `${responseLogin}`,[
                          {text:'Okay'}
                      ]); 
        }

  }



  // function untuk mengirimkan token ke email
  const handleSendTokenToEmail = async () =>{
    const length = 3;
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    setToken(result)

    const value = {
        userName: data.username,
        userEmail: data.email,
        token: result
    }

    let responseLogin = '' 

    await axios.post(`${urlEndpointAPI}/sendemail`,value)
    .then(function (response) {
    //   console.log(response);
      responseLogin = response.data.message
      showFlash(response.data.message);
    })
    .catch(function (error) {
      console.log(error);
    });

    if(responseLogin == 'you should receive an email'){
      setButtonStatus('Step 2')
    }
  }

  // handle email input
  const emailChange = (val) => {
    if(val.trim().length >=4){
        setData({
            ...data, 
            email:val,
        })
    }
    else{
        setData({
            ...data, 
            email:val,
        })   
    }
}

  // handle email input
  const UserNameChange = (val) => {
    if(val.trim().length >=4){
        setData({
            ...data, 
            // email:val,
            username:val,
            // check_textInputChange:true,
            isValidUser:true
        })
    }
    else{
        setData({
            ...data, 
            // email:val,
            username:val,
            // check_textInputChange:false,
            isValidUser:false
        })   
    }
}


const tokenChange = (val) => {

    if(val.trim().length >=4){
        setData({
            ...data, 
            token:val,
        })
    }
    else{
        setData({
            ...data, 
            token:val,
        })   
    }
}

//function untuk mengcompare token
const compareToken = () =>{
    console.log("token di compare:",Token);
    if(Token == data.token){
        setButtonStatus('Submit')
    }else{
        showFlash("token does'nt matching")
    }
}

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
                    onChangeText={(val)=>UserNameChange(val)}
                />
        </View>
        <Gap height={20} />
        <View>
            <Input
                    styleText={styles.styleText}
                    styleView={styles.styleView}
                    text={'Email'}
                    placeholder ="Enter Your Email"
                    styleInput={{
                        color: colors.text
                    }}
                    autoCapitalize="none"
                    onChangeText={(val)=>emailChange(val)}
                />
        </View>

        {
            ButtonStatus  == 'Step 2' || ButtonStatus  == 'Submit' ?
            <>
             <Gap height={20} />
                <View style={{justifyContent: 'center'}}>
                        <Input
                                styleText={styles.styleText}
                                styleView={styles.styleView}
                                text={'Token'}
                                placeholder ="Enter Your Token"
                                styleInput={{
                                    color: colors.text
                                }}
                                autoCapitalize="none"
                                onChangeText={(val)=>tokenChange(val)}
                            />
                </View>
            </>
            :
            null

        }
        {
            ButtonStatus == 'Submit' ?
            <>
                <Gap height={20}/>
                <View>
                <Input
                    styleText={styles.styleText}
                    styleView={styles.styleView}
                    text={'New Password'}
                    placeholder ="Enter Your New Password"
                    styleInput={{
                        color: colors.text
                    }}
                    autoCapitalize="none"
                    secureTextEntry={data.secureTextEntryPassword?true:false}
                    onChangeText={(val)=>handlePasswordChange(val)}
                    icon = {data.secureTextEntryPassword? <HideIcon/>:<ShowIcon/>}
                    onPressIcon={updateSecureTextEntryPassword}
                />
                
                </View>
                <Gap height={20} />
                <View style={{justifyContent: 'center'}}>
                <Input
                    styleText={styles.styleText}
                    styleView={styles.styleView}
                    text={'Re Enter New Password'}
                    placeholder ="Re Enter Your New Password"
                    styleInput={{
                        color: colors.text
                    }}
                    autoCapitalize="none"
                    secureTextEntry={data.secureTextEntryRePassword?true:false}
                    onChangeText={(val)=>handleRePasswordChange(val)}
                    icon = {data.secureTextEntryRePassword? <HideIcon/>:<ShowIcon/>}
                    onPressIcon={updateSecureTextEntryRePassword}
                />
                <Gap height={4}/>
                {   
                    data.re_password == '' ?null
                    :data.isValidRePassword == true?
                    <Text>Password is matching</Text>
                    :
                    <Text>Password is not matching</Text>
                }
                </View>
            </>
        :
        null
        }

        <Gap height={10} />
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
            // name="Submit"
            name={ButtonStatus}
            size={fontSizeBig.fontSize}
            color={secondColor.color}
            fontFamily={fontFamilyMedium.fontFamily}
            onPress= {
                ButtonStatus == 'Step 1' ?
                () =>{
                    handleSendTokenToEmail();
                  
                }
                :
                ButtonStatus == 'Step 2' ?
                () =>{
                    compareToken()
                }
                :
                () =>{
                   submitHandle()
                }
            }
          />
        </LinearGradient>
      </ScrollView>
      <Gap height={20}/>
    </View>
  );
};

export default ForgotPasswordScreen;



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
    backgroundColor: 'lightgrey',
    borderRadius: 0,
    marginBottom: 0,
  },
  flashMessage: {
    fontSize: 18,
    textAlign: 'center',
  },
});
