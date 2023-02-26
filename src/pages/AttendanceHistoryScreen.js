import { StyleSheet, RefreshControl, Text, View,Dimensions ,ScrollView, BackHandler, Alert} from 'react-native'
import React,{useEffect, useState, useContext} from 'react'
import { Gap, Button } from '../components'
import {urlEndpointAPI, backGroundColor, category, Category, fontSizeSmall, fontFamilyRegular, mainColor, widthComponent, fontFamilyMedium, fontFamilySemiBold, fontSizeBig, secondColor } from '../utils'
import { Excuse, Late, NotPresent, OnTime } from '../assets/ilustration'
import { TouchableOpacity } from 'react-native-gesture-handler'
import axios from 'axios'

import { MyContext } from '../Context'
import { useMyContext } from '../Context'

const windowWidth = Dimensions.get('window').width * 0.833;
const windowHeight = Dimensions.get('window').height;

const AttendanceHistoryScreen = (props) => {

  const { showFlash, message, isVisible, state, setState, CurrentSemesterContext, setCurrentSemesterContext } = useMyContext();


  const [OnTimeData, setOnTimeData] = useState()
  const [ExcuseData, setExcuseData] = useState()
  const [LateData, setLateData] = useState()
  const [NotPresentData, setNotPresentData] = useState()
  const [History, setHistory] = useState()
 
  const [refreshing, setRefreshing] = React.useState(false);


  useEffect( () => {
      getAPI()
  }, [])
  

  const getAPI = async () =>{
    setRefreshing(false)
    const schoolYear = CurrentSemesterContext? CurrentSemesterContext.schoolYear: '2021-2022'
    const semester = CurrentSemesterContext? CurrentSemesterContext.semester: '1'
    await
     axios.get(`${urlEndpointAPI}/getuserfilterattendance/?schoolYear=${schoolYear}&semester=${semester}&userId=${state.id}`)
     .then((e)=>{
      // console.log("history screen:",e.data.data);
      setOnTimeData(e.data.data.onTime)
      setLateData(e.data.data.late)
      setExcuseData(e.data.data.excuse)
      setNotPresentData(e.data.data.notPresent)
      setHistory(e.data.data.history)
     })
     .catch((e)=>{
        console.log("error:",e);
      })
  }



  return (
    // <View style={{backgroundColor:backGroundColor.color, alignItems:'center', flex: 1}}>
    <View style={{backgroundColor:backGroundColor.color, alignItems:'center', flex: 1}}>
    <Gap height={14}/>
    <View style={{width: windowWidth}}>
      <View style={{flexDirection:'column'}}>
        <Gap height={20}/>

          {/* Kotak Card */}
        <ScrollView 
         showsHorizontalScrollIndicator={false} horizontal={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getAPI} />
          }
         >
           <View style={{height: 123, width:115, justifyContent:'space-between', backgroundColor:'#FCFCFC', padding: 14, borderRadius: 10}}>
              <View>
              <OnTime/>
              </View>
              <Text style={{color:'#9FA4AB', fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeSmall.fontSize}}>Arrive On time</Text>
              <Text style={{color:'#000000',  fontFamily:fontFamilySemiBold.fontFamily, fontSize: fontSizeBig.fontSize}}>{OnTimeData}</Text>
           </View>
           <Gap width={20}/>
           <View style={{height: 123, width:115, justifyContent:'space-between' ,backgroundColor:'#FCFCFC', padding: 14, borderRadius: 10}}>
              <View>
                <Late/>
              </View>
              <Text style={{color:'#9FA4AB', fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeSmall.fontSize}}>Arrive In late</Text>
              <Text style={{color:'#000000',  fontFamily:fontFamilySemiBold.fontFamily, fontSize: fontSizeBig.fontSize}}>{LateData}</Text>
           </View>
           <Gap width={20}/>
           <View style={{height: 123, width:115, justifyContent:'space-between' ,backgroundColor:'#FCFCFC', padding: 14, borderRadius: 10}}>
              <View>
                <NotPresent/>
              </View>
              <Text style={{color:'#9FA4AB', fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeSmall.fontSize}}>Not Present</Text>
              <Text style={{color:'#000000',  fontFamily:fontFamilySemiBold.fontFamily, fontSize: fontSizeBig.fontSize}}>{NotPresentData}</Text>
           </View>
           <Gap width={20}/>
           <View style={{height: 123, width:115, justifyContent:'space-between', backgroundColor:'#FCFCFC', padding: 14, borderRadius: 10}}>
              <View>
                <Excuse/>
              </View>
              <Text style={{color:'#9FA4AB', fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeSmall.fontSize}}>Excuse</Text>
              <Text style={{color:'#000000',  fontFamily:fontFamilySemiBold.fontFamily, fontSize: fontSizeBig.fontSize}}>{ExcuseData}</Text>
           </View>
        </ScrollView>
      </View>
      <Gap height={20}/>
      <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
              <Button
                      styleContainer={styles.buttonContainer}  
                      onPress={()=>props.navigation.navigate('AllAbsenScreen')} 
                      name = 'View Full Absen' 
                      color= '#FCFCFC' 
                      size={fontSizeSmall.fontSize} 
                      fontFamily={fontFamilyRegular.fontFamily} 
                      textAlign ='center'
                    />
          </View> 
      <Text style={{fontFamily:fontFamilyMedium.fontFamily, fontSize:fontSizeBig.fontSize, color:'#000000'}}>Attendance History</Text>
          
    </View>

    {/* Attendance History */}
        <ScrollView   showsVerticalScrollIndicator={false}>
            <Gap height={20}/>
            {
              History?
              History.map((e, i) =>{
                return(
                  <View key={i} style={{marginBottom: 20, backgroundColor:secondColor.color,borderWidth: 1, width:windowWidth, borderColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.30)` , flexDirection:'row', padding: 14, borderRadius: 10, alignItems:'center'}}>
                    <View>
                      {
                        e.userAttendance[0] ? 
                        e.userAttendance[0].presence.includes('ontime')?
                        <OnTime/>
                        :
                        e.userAttendance[0].presence.includes('late')?
                        <Late/>
                        :
                        e.userAttendance[0].presence.includes('absen')?
                        <NotPresent/>
                        : 
                        e.userAttendance[0].presence.includes('excuse')?
                        <Excuse/>
                        : 
                        null
                        :
                        !e.userAttendance[0]?
                        <NotPresent/>
                        :
                        null
                      }
                    </View>
                  <Gap width={13}/>
                  <View>
                    <View>
                        <Text style={{fontFamily: fontFamilyMedium.fontFamily, fontSize: fontSizeSmall.fontSize,  color:'#000000'}}>{
                       
                        e.userAttendance[0] ? e.userAttendance[0].presence.split("_")[0]
                        
                        : 'absen'
                        
                        }</Text>
                    </View>
                    <View>
                        <Text style={{fontFamily: fontFamilyRegular.fontFamily, fontSize: fontSizeSmall.fontSize,  color:'#000000'}}>{e.absenDateString}</Text>
                    </View>
                  </View>
                </View>
                )
              })
              :
              null
            }
            <Gap height={20}/>
        </ScrollView>
    </View>
  )
}



export default AttendanceHistoryScreen

const styles = StyleSheet.create({
  buttonContainer: {width: '35%',  backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`, height: 39, borderRadius: 10, justifyContent:'center'},

})


// import React from 'react';
// import {
//   RefreshControl,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
// } from 'react-native';

// const AttendanceHistoryScreen = () => {
//   const [refreshing, setRefreshing] = React.useState(false);
//   const [text, setText] = React.useState('Pull down to see RefreshControl indicator');

//   const onRefresh = () => {
//     setRefreshing(false);
//     setText('update');
//   };

//   return (
//     <SafeAreaView>
//       <CustomScrollView text={text}  refreshing={refreshing} onRefresh={onRefresh}/>
//     </SafeAreaView>
//   );
// };

// const CustomScrollView = (props) => {
  
//   const {refreshing, onRefresh, text} =props

//   return (
//     <ScrollView
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>{text}</Text>
//      <Text>Paling bawah</Text>
     
//     </ScrollView>
//   );
// };

// export default AttendanceHistoryScreen;
