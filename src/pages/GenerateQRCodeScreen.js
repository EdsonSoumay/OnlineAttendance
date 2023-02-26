import React, { useState, useEffect } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import {Gap } from "../components";
import QRCode from 'react-native-qrcode-svg';
import axios from "axios";
import { fontSizeSmall, fontFamilyRegular, mainColor,  fontFamilyMedium, fontSizeBig, urlEndpointAPI  } from "../utils";
import { TimeIcon } from "../assets/icon";
import { Edit, Late, OnTime, Trash } from "../assets/ilustration";
// import {ConfirmModal} from "../components/molecules";
import ConfirmModal from "../components/molecules/confirmModal/index";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useMyContext } from "../Context";

const Header = (props) =>{

  const {
        OpenListAbsen, setOpenListAbsen, ListAbsenQRGenerate, OpenMenuAbsen, 
        setOpenMenuAbsen, setModalShowQRCode, ModalShowQRCode, setValueModalShowQRCode, 
        deleteAbsen, editAbsen, setDateTime, setIdAbsen, setModalConfirm, ModalConfirm,
        setActiveAction, setActionType, getAPI, refreshing, state
  } = props

  // console.log("State.role di header:",state)
 return(    
    <View style={{flex: 1, paddingHorizontal:10, paddingTop: 10}}>
    <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
      <TouchableOpacity onPress={()=>setOpenListAbsen(!OpenListAbsen)}>
          <View style={{paddingLeft: 7, paddingBottom: 7}}>
              <TimeIcon/>
          </View>
      </TouchableOpacity>
    </View>

    <View >
      <View>
        <ScrollView 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getAPI} />
         }
        >
          {
          OpenListAbsen?
          ListAbsenQRGenerate.data.length != 0?
          ListAbsenQRGenerate.data.map((e, i)=>{

            const dates = e.absenDate
            const date = new Date(dates);

            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
             //set up date
            //  let day =date.toLocaleDateString('en-US', {weekday: 'long'});
             let dateNumber =date.toLocaleDateString('en-US', {day: '2-digit'});
             let month =date.toLocaleDateString('en-US', {month: '2-digit'});
             let year =date.toLocaleDateString('en-US', {year: 'numeric'});
             let formattedDate = weekdays[date.getDay()] + ', ' + dateNumber + ' - ' + month + ' - ' + year;
             //end set up date

            //set up time GMT 8 (WITA)
            let utc_hours = date.getUTCHours();
            utc_hours += 8;
            date.setUTCHours(utc_hours);
            let dateString = date.toISOString();
            let timeString = dateString.slice(11, 23) + dateString.slice(26, 29);
            //end set up time
               
          return(
            <View key={i}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', height: 50}} >
                <View style={{flexDirection:'row', alignItems:'center', width:'47%'}}>
              {
                    OpenMenuAbsen == i ?
                    <>
                      <ConfirmModal
                          text ='show ontime qr' 
                          action ={setModalShowQRCode}
                          status ={true}
                          action2 ={setValueModalShowQRCode}
                          
                          data ={{
                            value: e.QRCodeOnTime,
                            // date: e.absenDate,
                            date: `${formattedDate}-#${timeString}`,
                            type: 'On Time'
                           }}
                          caption = {<OnTime/>}
                      />
                        <Gap width={6}/>
                        <ConfirmModal
                          text ='show late qr' 
                          action ={setModalShowQRCode}
                          status ={true}
                          action2 ={setValueModalShowQRCode}
                          data ={{
                            value: e.QRCodeLate,
                            // date: e.absenDate,
                            date: `${formattedDate}-#${timeString}`,
                            type: 'Late'
                           }}
                          caption = {<Late/>}
                      />
                     {
                        state?.role === ('President'|| 'Secretary') ?
                      <> 
                     <Gap width={6}/>
                      <ConfirmModal
                          text ='hapus absen' 
                          data ={e._id}
                          action ={deleteAbsen}
                          caption = {<Trash/>}
                      />
                      <Gap width={6}/>
                      <ConfirmModal
                          text ='edit absen' 
                          action ={setDateTime}
                          action3={setActionType}
                          action2 ={setIdAbsen}
                          type={false}
                          data ={e._id}
                          status ={true} // so lupa ini status for apa. intinya jadi
                          caption = {<Edit/>}
                      />
                      <Gap width={6}/>
                      </>
                      :
                      null
                    }
                    </>
                   : 
                   null
                  }
                  </View>
                <View style={{width: '53%', height:'100%'}}>
                  <TouchableOpacity onPress={OpenMenuAbsen == i ? ()=>setOpenMenuAbsen(null): ()=>setOpenMenuAbsen(i)} 
                   style={{ justifyContent:'center', alignItems:'center', height: '100%', width:'100%', backgroundColor:'white', borderRadius: 10, borderColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.30)`, borderRadius:10, borderWidth:1}}>
                      <Text style={{fontFamily:fontFamilyRegular.fontFamily, fontSize:fontSizeSmall.fontSize, color:'#000000'}}>{formattedDate}</Text>
                      <Text style={{fontFamily:fontFamilyRegular.fontFamily, fontSize:fontSizeSmall.fontSize, color:'#000000'}}>{timeString}</Text>
                  </TouchableOpacity>
                </View>
             </View>
              <Gap height={10}/>
            </View>
             )
          })
          :
            <Text>tidak ada history absen</Text>
          : 
          null
          }
        </ScrollView>
      </View>

    </View >
  </View>

 )
}

const  DateTimeModal = (props) => {
    const{
    setDateTime, DateTime, action 
  } = props

  const hideDatePicker = () => {
    setDateTime(false);
  };

  const handleConfirm = (date) => {
    action(date)
    setDateTime(false);
  };

  return (
    <>
      <DateTimePickerModal
        isVisible={DateTime}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
  
}

const ViewModalQRCode = (props) =>{

  const{
    setModalShowQRCode, ModalShowQRCode, ValueModalShowQRCode
  } = props

  return(
    <Modal
    animationType="fade"
    transparent={true}
    visible={ModalShowQRCode}
    onRequestClose={() => {
      setModalShowQRCode(!ModalShowQRCode);
    }}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={{ flexDirection:'row', justifyContent:'flex-end'}}>
        <Pressable
          onPress={() => setModalShowQRCode(!ModalShowQRCode)}
          style={{ height: 30, width: 30, alignItems:'center'}}
        >
          <Text style={{fontSize: 20}}>x</Text>
        </Pressable>
        </View>

        <View style={{alignItems:'center'}}>
          <Text style={{fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeBig.fontSize, color:'#000000'}}>Date: {ValueModalShowQRCode.date}</Text>
          <Gap height={10}/>
          <Text style={{fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeBig.fontSize, color:'#000000'}}>Status: {ValueModalShowQRCode.type}</Text>
        </View>

        <Gap height={50}/>

        <View style={{flexDirection:'row', justifyContent:'center'}}>
           <QRCode
             value={ValueModalShowQRCode.value}
             size={300}
            />
        </View>
      </View>
    </View>
  </Modal>
  )
}

const GenerateQRCodeScreen = (props) => {

  const { showFlash, message, isVisible, state, setState, CurrentSemesterContext, setCurrentSemesterContext } = useMyContext();

  // console.log("state di qr cscren:",state)

    const [ListAbsenQRGenerate, setListAbsenQRGenerate] = useState()
    const [OpenMenuAbsen, setOpenMenuAbsen] = useState(null)
    const [ModalShowQRCode, setModalShowQRCode] = useState(false);
    const [ValueModalShowQRCode, setValueModalShowQRCode] = useState({})
    const [OpenListAbsen, setOpenListAbsen] = useState(false)
    const [DateTime, setDateTime] = useState(false);
    const [ModalConfirm, setModalConfirm] = useState(false);
    const [ IdAbsen, setIdAbsen ] = useState()
    const [ActionType, setActionType] = useState(false) // false == edit absen, true == bikin absen baru. ini untuk reusable modal date time
    const [CurrentSemester, ] = useState() // false == edit absen, true == bikin absen baru. ini untuk reusable modal date time
    const [refreshing, setRefreshing] = useState(false);

      useEffect(() => {
          getAPI()
      }, [])
  
      const getAPI = async() =>{
      setRefreshing(false);
      const schoolYear = CurrentSemesterContext? CurrentSemesterContext.schoolYear: '2021-2022'
      const semester = CurrentSemesterContext? CurrentSemesterContext.semester: '1'
        await axios.get(`${urlEndpointAPI}/latestqrcodes?schoolYear=${schoolYear}&semester=${semester}`)
        .then(function (response) {
          // console.log(response)
          setListAbsenQRGenerate(response.data)
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    const postAPI = (date) =>{

      function generateString() {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdfghijklmnopqrstuvwxyz0123456789';
        return Array(5).join().split(',').map(function() {
            return characters.charAt(Math.floor(Math.random() * characters.length));
        }).join('');
      }
      
      const values = {
        regBy : 4,
        QRCodeOnTime :`ontime_${generateString()}`,
        QRCodeLate :`late_${generateString()}`,
        description : 'desc from hp',
        schoolYear : CurrentSemesterContext? CurrentSemesterContext.schoolYear: '2021-2022',
        semester : CurrentSemesterContext? CurrentSemesterContext.semester: '1',
        absenDate: date
      }

    const findPreviousAbsen = ListAbsenQRGenerate.data.find(e => 
      new Date(e.absenDate).getDate() == date.getDate() && 
      new Date(e.absenDate).getMonth()+1 == date.getMonth()+1 && 
      new Date(e.absenDate).getFullYear() == date.getFullYear() 
      )

      const axiosPOST = async () =>{
        // console.log("post axios")
        await axios.post(`${urlEndpointAPI}/qrcode`,values)
          .then(function (response) {
            // console.log(response);
            showFlash(response.data.message);
            getAPI()
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      // check apakah absen di tanggal tersebut sudah ada sebelumnya
      if(findPreviousAbsen == undefined){
        axiosPOST()
        }else{
          Alert.alert(
            'Warning',
            'absence on that date already exist. still create?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: () => axiosPOST()},
            ],
            {cancelable: false},
          );
        }
      }
    
    const deleteAbsen = async (id) =>{
      // await axios.put(`${urlEndpointAPI}/qrcode/status/${IdAbsen}`, {status: false})
      await axios.put(`${urlEndpointAPI}/qrcode/status/${id}`, {status: false})
      .then(function (response) {
        showFlash(response.data.message);
        // console.log(response);
        getAPI()
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    const editAbsen = async (date) =>{
      console.log("edit absen");
      // let absenDate = ("0" + date.getDate()).slice(-2) + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" + date.getFullYear();

      // console.log("id absen:",IdAbsen);
      await axios.put(`${urlEndpointAPI}/qrcode/${IdAbsen}`,{
        absenDate: date,
        regBy: 'default',
        // description: 'description',
      })
      .then(function (response) {
        // console.log(response);
         showFlash(response.data.message);
        getAPI()
      })
      .catch(function (error) {
        console.log(error);
      });
    }

  return (
    <>
      {isVisible && (
               <View style={styles.flashContainer}>
                   <Text style={styles.flashMessage}>{message}</Text>
                </View>
            )}

    <ViewModalQRCode
        setModalShowQRCode={setModalShowQRCode} 
        ModalShowQRCode={ModalShowQRCode} 
        ValueModalShowQRCode={ValueModalShowQRCode}
     />
   
    <DateTimeModal
        setDateTime={setDateTime}
        DateTime={DateTime}
        action={ActionType? postAPI: editAbsen}
        setIdAbsen={setIdAbsen}
     />

    {/* <View style={styles.mainContainer}> */}

      <View style={{height:'70%'}}>
        {/* Header */}
      <Header 
        state={state} // role
        OpenListAbsen={OpenListAbsen} 
        setOpenListAbsen={setOpenListAbsen} 
        ListAbsenQRGenerate={ListAbsenQRGenerate}
        OpenMenuAbsen={OpenMenuAbsen}
        setOpenMenuAbsen={setOpenMenuAbsen}
        setModalShowQRCode={setModalShowQRCode}
        ModalShowQRCode={ModalShowQRCode}
        setValueModalShowQRCode={setValueModalShowQRCode}
        setDateTime={setDateTime}
        deleteAbsen={deleteAbsen}
        editAbsen={editAbsen}
        setIdAbsen={setIdAbsen}
        setModalConfirm={setModalConfirm}
        ModalConfirm={ModalConfirm}
        setActionType={setActionType}
        getAPI={getAPI}
        refreshing={refreshing}
      />
      </View>
      
     
      {/* Footer */}
      {

      state?.role == ('President' || 'Vice President' || 'Secretary') ?
          <View style={{ 
            flexDirection:'column', 
            justifyContent:"center", 
            height:'30%', 
            // backgroundColor:'salmon'
            }}>
          <View>
              <ConfirmModal
                text ='Create absen' 
                action ={setDateTime}
                action3={setActionType}
                type={true}
                status ={true}
                data ={{
                  type: 'On Time'
                }}
                caption = 'Create Absen'
                />
            </View>
        </View>
        :
        null
      }


    {/* </View> */}
   
    </>


  );
};

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    flexDirection:'column',
    marginTop: 22,
    justifyContent:'space-between',
    marginHorizontal:'7%'
  },
  centeredView: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'flex-end',
    alignItems: "center",
    // marginTop: 22,
  },
  modalView: {
    flexDirection:'column',
    // justifyContent:'space-between',
    margin: 20,
    height:'95%',
    width: '95%',
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 10,
    paddingRight: 10,
    // padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalConfirmView: {
    flexDirection:'column',
    // justifyContent:'space-between',
    margin: 20,
    height:'45%',
    width: '95%',
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 10,
    paddingRight: 10,
    // padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalViewEditAbsen: {
    flexDirection:'column',
    // justifyContent:'space-between',
    margin: 20,
    height:'50%',
    width: '100%',
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 10,
    paddingRight: 10,
    // padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  buttonContainer:{backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`, height: 39, borderRadius: 10, justifyContent:'center', marginHorizontal:'30%'},
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

export default GenerateQRCodeScreen;


