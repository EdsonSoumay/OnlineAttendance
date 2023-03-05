import { StyleSheet, Modal, Button as ButtonNative,TouchableWithoutFeedback, Text, View, Image, ScrollView, Dimensions, TouchableOpacity,BackHandler, Alert } from 'react-native'
import React, {useEffect, useState, useContext,createContext } from 'react'
import { backGroundColor, firstPageBorder, fontFamilyMedium, fontFamilyRegular , fontRegular, fontSizeBig, fontSizeMedium, fontSizeSmall, fontSubTitle, fontTitle, mainColor, secondColor, widthComponent } from '../utils'
import LinearGradient from 'react-native-linear-gradient'
import { SettingIcon } from '../assets/icon'
// import { DummyPhoto } from '../assets/image'
import { Button, Gap } from '../components'
import { getData, storeData } from '../localStorage'
import SelectDropdown from 'react-native-select-dropdown';
import { urlEndpointAPI } from '../utils';
import axios from 'axios';

// import { MyContext } from '../Context'
import { useMyContext } from '../Context'

const listSchoolYear = ["2021-2022","2022-2023", "2023-2024", "2024-2025","2025-2026", "2026-2027","2027-2028", "2028-2029", "2029-2030"]
const listSemester = ["2", "1", "summer"]

const MyModal = (props) => {
  const { 
    modalVisible, setModalVisible, selectedItem, setSelectedItem, updateCurrentSemester,
    CurrentSemester
  }= props

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>


        <View style={{ 
          flex: 1, 
          backgroundColor: "rgba(0, 0, 0, 0.5)", 
         justifyContent: "center",
        //  alignItems: "center"
         }}>
          <View style={{ 
                backgroundColor: "white",
                //  padding: 20,
                  borderRadius: 10 }}>
            <View 
            >
            <Gap height={20}/>
            <View>
              <Text>select School Year</Text>
              <SelectDropdown
                   buttonStyle={{width:'100%'}}
                  data={listSchoolYear}
                  onSelect={(select, index) => {
                    setSelectedItem({...selectedItem, schoolYear:select})
                  }}
                />
            </View>
            <Gap height={20}/>
            <View>
              <Text>Select Semester</Text>
              <SelectDropdown
                   buttonStyle={{width:'100%'}}
                  data={listSemester}
                  onSelect={(select, index) => {
                    setSelectedItem({...selectedItem, semester:select})
                  }}
                />
            </View>
          </View>
         
          <Gap height={20}/>
          <View style={{justifyContent:'center', width:'30%'}}>
            <Button
              styleContainer={styles.buttonContainer}  
              onPress={()=>updateCurrentSemester()} 
              name = 'submit' 
              color= '#FCFCFC' 
              size={fontSizeSmall.fontSize} 
              fontFamily={fontFamilyRegular.fontFamily} 
              textAlign ='center'
            />
          </View>
          </View>
        </View>

    </TouchableWithoutFeedback>

      </Modal>
             <Text style={{color:'white'}} onPress={() => setModalVisible(true)}>
              {
              CurrentSemester?
              `School Year: ${CurrentSemester.schoolYear} 
               semester : ${CurrentSemester.semester} `
                :
                '-'
              }
              </Text>
    </View>
  );
};


const HomeScreen = (props) => {

  const { showFlash, message, isVisible, state, setState, CurrentSemesterContext, setCurrentSemesterContext } = useMyContext();

  const windowWidth = Dimensions.get('window').width * 0.833;
  const windowHeight = Dimensions.get('window').height;
  const [ UserSession, setUserSession] = useState()

  console.log("user session:",UserSession)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    semester: '-',
    schoolYear:'-',
  });

useEffect( () => {
  const handleUserSession = async () =>{
    setUserSession( await getData('userSession'))
    setState( await getData('userSession'))
  }
  handleUserSession()
  getCurrentSemester()
}, [])

const getCurrentSemester = async () =>{
  const _idSchema = '63aa8e7961f2f36c83d03190'

  await axios.get(`${urlEndpointAPI}/currentsemester/${_idSchema}`)
  .then(async(e)=>{
   
    setCurrentSemesterContext({
        schoolYear: e.data.data.schoolYear, 
        semester :e.data.data.semester,
    })
  })
  .catch((e)=>{
    console.log("error:",e);
  })
}

const updateCurrentSemester = async () =>{
  const _idSchema = '63aa8e7961f2f36c83d03190'
  if(selectedItem.semester == ('-' ||''|| null || undefined) ||selectedItem.schoolYear == ('-'|| '' || null || undefined) ){
    showFlash('ada field yg kosong')
  }
 else{
   await axios.put(`${urlEndpointAPI}/currentsemester/${_idSchema}`,selectedItem)
   .then(async(e)=>{
     console.log(e)
     setCurrentSemesterContext({
       schoolYear: e.data.data.schoolYear, 
       semester :e.data.data.semester,
   })
   setModalVisible(false)
   showFlash(e.data.message)
   })
   .catch((e)=>{
     console.log("error:",e);
   })
 }
}

console.log("State:",state)

  return (
    <View style={styles.container}>
          <View style={styles.container}>
            {isVisible && (
              <View style={styles.flashContainer}>
                <Text style={styles.flashMessage}>{message}</Text>
              </View>
            )}
        </View>
      {/* Header */}
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={[styles.containerHeader.startGradient,styles.containerHeader.endGradient]} style={styles.containerHeader}>
            
            {isVisible && (
               <View style={styles.flashContainer}>
                   <Text style={styles.flashMessage}>{message}</Text>
                </View>
            )}

            <View style={styles.childContainerHeader1}>
                    <View>
                         {/* ini view bayangan */}
                    </View>
                    <View>
              {
                state?.role == ('President' || 'Vice President' || 'Secretary') ?
                <MyModal
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  CurrentSemester={CurrentSemesterContext}
                  updateCurrentSemester={updateCurrentSemester}
                />
                :
                <Text style={{color:'white'}} >
                {
                CurrentSemesterContext?
                `School Year: ${CurrentSemesterContext.schoolYear} 
                 semester : ${CurrentSemesterContext.semester} `
                  :
                  '-'
                }
                </Text>
              }

                    </View>
                   <TouchableOpacity onPress={()=>props.navigation.navigate('SettingScreen')}>
                         <SettingIcon/>
                   </TouchableOpacity>
            </View>
            <View style={ styles.childContainerHeader2}>
                <View style={styles.containerProfile}>
                    <View style={{flex: 1}}>
                      <View style={styles.nameUserContainer}>
                        <View>
                          <Text style={styles.textUserContainer}>
                            {state?.firstName? state.firstName + ' ' : '-' + ' '}
                            {state?.lastName ? state.lastName : '-' }
                            </Text>  
                        </View>
                      <Text>
                        {/* view bayangan */}
                      </Text>
                      <Text>
                        {/* view bayangan */}
                      </Text>
                      </View>
                      <View  style={{flexDirection:'row', flex: 1, alignItems:'center', justifyContent:'space-around'}}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Text >{state?.userName}</Text>
                              <Gap width={10}/>
                              <View style={{height: 7, width: 7, borderRadius:3.4, backgroundColor: state?.status ? '#3ACBA9' : '#D49FB9'}}></View>
                          </View>

                          <Text>{/* text bayangan */}</Text>
                          <Text>{/* text bayangan */}</Text>
                        </View>  
                      <Gap height={10}/>
                      <View style={styles.infoUserContainer}>
                        <View style={[styles.activeUserContainer, { flexDirection:'row', justifyContent:'center'}]}> 
                          <Text style={styles.textDivisionUser}>{state?.role }</Text>
                        </View>
                        <View style={styles.divisionUserContaier}> 
                          <Text style={styles.textDivisionUser}>{state?.division == "undefined" ? '-': state?.division}</Text>
                        </View>
                      </View>
                    </View>
                </View>
            </View>
      </LinearGradient>

      {/* Body */}
      <Gap height={22}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{alignItems:'center'}}>
          <View style={{width: windowWidth}}>
            <View>
                <Text style={styles.textYourAttendance}>Your Attendance</Text>
            </View>
            <Gap height={20}/>
            {/* [ styles.dateText, {fontFamily: fontFamilyRegular.fontFamily}] */}
            <View style={styles.Container2}>
                <View>
                  <Text style={styles.textScanQRCode}>Scan the QR Code  to get your attendance</Text>
                </View>
                <Gap height={22}/>
                <View>
                <Button
                    styleContainer={styles.buttonContainer}  
                    onPress={()=>props.navigation.navigate('ScanScreen')} 
                    name = 'Scan QR Code' 
                    color= '#FCFCFC' 
                    size={fontSizeSmall.fontSize} 
                    fontFamily={fontFamilyRegular.fontFamily} 
                    textAlign ='center'
                  />
                </View>
                <View>
                </View>
            </View>
          </View>
        </View>
        {
          state?.role == ('President' || 'Vice President' || 'Treasure' || 'Secretary')?
            <>
              <Gap height={52}/>
              <View style={{alignItems:'center'}}>
          <View style={{width: windowWidth}}>
            <View>
                <Text style={styles.textYourAttendance}>Generate QR Code</Text>
            </View>
            <Gap height={20}/>
            {/* [ styles.dateText, {fontFamily: fontFamilyRegular.fontFamily}] */}
            
            <View style={styles.Container2}>
                <View>
                  <Text style={styles.textScanQRCode}>Generate QR Code for Attendance</Text>
                </View>
                <Gap height={22}/>
                <Button 
                    styleContainer={styles.buttonContainer} 
                    onPress={()=>props.navigation.navigate('GenerateQRCodeScreen')} 
                    name = 'View and Create Absen' 
                    color= '#FCFCFC' 
                    size={fontSizeSmall.fontSize} 
                    fontFamily={fontFamilyRegular.fontFamily} 
                    textAlign ='center'
                />
            </View>

          </View>
             </View>
            </>          
      :null  
      }
        <Gap height={52}/>
        <View style={{alignItems:'center'}}>
        <View style={{width: windowWidth}}>
            <View>
                <Text style={styles.textLeadInWorship}>Lead In Worship Today</Text>
            </View>
            <Gap height={20}/>
            <View style={styles.Container2}>
                <View style={styles.containerLeadInWorship2}>
                    <Text style={styles.textLeadInWorship2}>Devotion</Text>
                    <Text style={styles.textLeadInWorship3}>-</Text>
                </View>
                <Gap height={22}/>
                <View style={styles.containerLeadInWorship2}>
                    <Text style={styles.textLeadInWorship2}>Event Director</Text>
                    <Text style={styles.textLeadInWorship3}>-</Text>
                </View>
            </View>
          </View>
        </View>
        <Gap height={30}/>

      </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: backGroundColor.color,
    flex: 1
  },

  //header
  containerHeader:{
    startGradient: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.80)`,
    endGradient: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, ${mainColor.a})`,
    width: '100%',
    height: 200,
    borderBottomRightRadius: firstPageBorder.borderRadius,
    borderBottomLeftRadius: firstPageBorder.borderRadius,
    flexDirection:'column',
    // justifyContent:'space-between',

  },
  childContainerHeader1:{
      flexDirection:'row', 
      justifyContent:'space-between',
      marginTop: 14,
      // backgroundColor:'red',
      alignItems:'center',
      marginHorizontal: '7%'
  },
  childContainerHeader2:{
      // backgroundColor:'red',
      alignItems:'center', 
      flex: 1, 
      justifyContent:'center',
    },
  containerProfile:{
    width: widthComponent.width,
    height: 110,
    backgroundColor: secondColor.color,
    borderRadius: firstPageBorder.borderRadius,
    padding: 19,
    flexDirection:'row',
  },
  dateText:{
    color:secondColor.color,
    fontSize: fontSizeMedium.fontSize,
    fontFamily: fontFamilyRegular.fontFamily
  },
  dummyImage:{width: 60, height: 60, borderRadius: 60},
  nameUserContainer:{flexDirection:'row', flex: 1,  alignItems:'center', justifyContent:'space-around', marginBottom:-2},
  textUserContainer:{fontSize:fontSizeBig.fontSize, fontFamily:fontFamilyMedium.fontFamily, color:'#000000'},
  infoUserContainer: {flexDirection:'row', flex: 1, alignItems:'center', justifyContent:'space-around'},
  activeUserContainer:{height: 26, maxWidth: '50%', paddingVertical:4, backgroundColor: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.05)`, borderRadius: 5 },
  textActiveUser:{fontFamily:fontFamilyMedium.fontFamily, color:'#3ACBA9', fontSize:fontSizeSmall.fontSize},
  divisionUserContaier:{height: 26, width: '35%', paddingVertical:4, alignItems:'center', backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.05)`, borderRadius: 5 },
  textDivisionUser:{fontFamily:fontFamilyMedium.fontFamily, color:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.7)`, paddingHorizontal: 4},
  buttonContainer:{backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`, height: 39, borderRadius: 10, justifyContent:'center'},
  //body
  //part 1
  textYourAttendance:{fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeMedium.fontSize, color:'#000000'},
  Container2:{paddingHorizontal: 45, paddingVertical: 23, backgroundColor:secondColor.color, borderWidth: 1, borderColor: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.30)`, borderRadius:10},
  textScanQRCode:{fontFamily:fontFamilyRegular.fontFamily, fontSize: fontSizeSmall.fontSize, color:'#000000'},
  //part2
  textLeadInWorship:{fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeMedium.fontSize, color:'#000000'},
  containerLeadInWorship:{paddingHorizontal: 45, paddingVertical: 23,  backgroundColor:secondColor.color, borderWidth: 1, borderColor: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.30)`, borderRadius:10},
  containerLeadInWorship2:{borderWidth: 1, borderColor:'#F0F1F3', height:53, borderRadius: 10, paddingHorizontal: 19, paddingVertical:8},
  textLeadInWorship2:{fontFamily:fontFamilyRegular.fontFamily, fontSize: fontSizeSmall.fontSize, color:'#000000'},
  textLeadInWorship3:{fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeSmall.fontSize, color:'#000000'},
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