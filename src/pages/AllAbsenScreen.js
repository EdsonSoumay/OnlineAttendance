import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text,Modal, StyleSheet, TouchableWithoutFeedback , RefreshControl} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Gap, Button } from '../components';
import { urlEndpointAPI } from '../utils';
import { fontFamilyRegular,fontSizeSmall,  mainColor} from '../utils'
import SelectDropdown from 'react-native-select-dropdown';

import { useMyContext } from '../Context';
import { getData } from '../localStorage'


const listPresence = ["absen", "late", "ontime", "excuse"]

const MyModal = (props) => {
  const { 
    modalVisible, setModalVisible, selectedItem, setSelectedItem, TableBody,  editAbsen,
    TableHeader
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
            <View>
              <Text>select Member</Text>
              <SelectDropdown
                   buttonStyle={{width:'100%'}}
                  data={TableBody?.map(header => header[0]?.userName? `${header[0]?.userName}` : '-')}
                  onSelect={(select, index) => {
                    // console.log(TableBody[index][0].userId);
                    setSelectedItem({...selectedItem, userId:TableBody[index][0]?.userId})
                  }}
                />
            </View>
            <Gap height={20}/>
            <View>
              <Text>select Date</Text>
                <SelectDropdown
                   buttonStyle={{width:'100%'}}
                    dropdownStyle={{ width: '100%', justifyContent:'center' }}
                      data={TableHeader?.map(header => `${header?.absenDateString} - ${header?.absenTimeString} `)}
                      onSelect={(select, index) => {
                        // console.log(TableHeader[index]._id);
                        setSelectedItem({...selectedItem, dateId:TableHeader[index]?._id})
                      }}
                    />
            </View>

            <Gap height={20}/>
            <View>
              <Text>select Presense</Text>
              <SelectDropdown
                   buttonStyle={{width:'100%'}}
                  data={listPresence}
                  onSelect={(select, index) => {
                    setSelectedItem({...selectedItem, presence:select})
                  }}
                />
            </View>
          </View>
         
          <Gap height={20}/>
          <Button
            styleContainer={styles.buttonContainer}  
            onPress={()=>editAbsen()} 
            name = 'submit' 
            color= '#FCFCFC' 
            size={fontSizeSmall.fontSize} 
            fontFamily={fontFamilyRegular.fontFamily} 
            textAlign ='center'
          />
          </View>

        </View>

    </TouchableWithoutFeedback>

      </Modal>
        
        <View style={styles.buttonContainer}>
             <Text style={{color:'white'}} onPress={() => setModalVisible(true)}>Edit Absen</Text>
        </View>
    </View>
  );
};

const AllAbsenScreen = () => {

  const { showFlash, message, isVisible, state, setState, CurrentSemesterContext, setCurrentSemesterContext } = useMyContext();
  const [TableHeader, setTableHeader] = useState()
  const [TableBody, setTableBody] = useState()

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    userId: '',
    dateId: '',
    presence:'',
  });

  const [refreshing, setRefreshing] = React.useState(false);

  console.log("state:",state);

  useEffect(() => {
    getAPI()
  }, [])
  
  const editAbsen = async ()  =>{
    if(selectedItem?.userId == ''|| selectedItem?.dateId == ''|| selectedItem?.presence == '' ){
      showFlash('ada field yang kosong');
    }else{
      await
      axios.put(`${urlEndpointAPI}/edituserattendance/${selectedItem.userId}`,{ 
        presence:selectedItem.presence, 
        attendanceId: selectedItem.dateId,
        // schoolYear, 
        reg_by: state.userName
      })
      .then((e)=>{
        getAPI()
        setModalVisible(false)
        // setSelectedItem({userId:'',dateId:'', presence:''})
        setSelectedItem({userId:'',dateId:'', presence:''})
        showFlash(e.data.message);
      })
      .catch((e)=>{
        // console.log("error:",e);
      })
    }
  }

  const getAPI = async () =>{
    setRefreshing(false)
    const schoolYear = CurrentSemesterContext? CurrentSemesterContext.schoolYear: '2021-2022'
    const semester = CurrentSemesterContext? CurrentSemesterContext.semester: '1'
    
    await
     axios.get(`${urlEndpointAPI}/getusersallsattendance?schoolYear=${schoolYear}&semester=${semester}`)
     .then((e)=>{
      console.log("e:",e);
      setTableHeader(e.data.data.date)
      setTableBody(e.data.data.member)
     })
     .catch((e)=>{
        // console.log("error:",e);
      })
  }

  return (
    <>
    
    {isVisible && (
               <View style={styles.flashContainer}>
                   <Text style={styles.flashMessage}>{message}</Text>
                </View>
            )}
<Gap height={20}/>

    {
      state.role == ('President' || 'Vice President' || 'Secretary') ?
            <MyModal
            editAbsen={editAbsen}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            TableHeader={TableHeader}
            TableBody={TableBody}
          />
          :
          null
    }


    <Gap height={10}/>
    <ScrollView showsHorizontalScrollIndicator={true}  horizontal={true}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={getAPI} />
   }
    >
    <View style={styles.tableContainer}>
      <View style={styles.tableHead}>
         <View style={styles.tableHeadCell}>
            <Text style={[styles.tableHeadText, {width:20}]}>No</Text>
          </View>
          <View style={[styles.tableHeadCell,{width:150}]}>
            <Text style={styles.tableHeadText}>User Name</Text>
          </View>
          <View style={[styles.tableHeadCell,{width:250}]}>
            <Text style={styles.tableHeadText}>Full Name</Text>
          </View>
        {
        TableHeader?
        TableHeader.map((header, index) =>{ 
          return(
            <View key={index} style={[styles.tableHeadCell, { width:200}]}>
              <Text style={styles.tableHeadText}>{header?.absenDateString}</Text>
              <Text style={styles.tableHeadText}>{header?.absenTimeString}</Text>
            </View>
          )
        }
        )
        :
        null
        }
      </View>
      <View style={styles.tableBody}>
        {
          TableBody?
          TableBody.map((row, index) =>{
            return (
               <View key={index} style={styles.tableRow}>
                  <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', paddingHorizontal:15.5 , borderRightWidth:1,  borderRightColor:'#eee'}} >
                    <Text style={styles.tableCellText}>{index + 1}</Text>
                  </View>
                  <View style={[styles.tableCell,{ maxWidth:150, paddingVertical:10}]}>
                    <Text style={[styles.tableCellText,{fontWeight: row[0]?.userName == state.userName ? 'bold' :'normal'}]}>{row[0] ? row[0].userName  : '-' }</Text>
                  </View>
                  <View style={[styles.tableCell,{ maxWidth:250, paddingVertical:10}]}>
                    <Text style={[styles.tableCellText,{fontWeight: row[0]?.userName == state.userName ? 'bold' :'normal'}]}>
                      {/* { `${row[0].firstName} ${row[0].lastName}`} */}
                       {row[0]?.firstName ? row[0].firstName + ' ' : '-' + ' ' }
                       {row[0]?.lastName ? row[0].lastName : '-' }
                      </Text>
                  </View>
                  {
                    row.map((cell, index) => (
                      <View key={index} style={[styles.tableCell, {maxWidth:200}]}>
                        <Text style={
                          [
                            styles.tableCellText, 
                            {color: cell.presence.includes('late') ? '#F0B743':  cell.presence.includes('absen')? '#cd0025':cell.presence.includes('excuse') ? '#5194E0' : '#3ACBA9'}
                          ]
                          }>{cell.presence.split("_")[0]}</Text>
                      </View>
                    ))
                  }

              </View>
            )
          }
          )
          
          :
          null
        }
      </View>
    </View>
    </ScrollView>
    </>

  );
};

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: '#3f51b5',
    // width:1000
  },
  tableHeadCell: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor:'#eee'
  },
  tableHeadText: {
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  tableCell: {
    flex: 1,
    // padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor:'#eee',
    
  },
  tableCellText: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {width: '35%',  backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`, height: 39, borderRadius: 10, flexDirection:'row',alignItems:'center', justifyContent:'center'},
 flashContainer: {
    // padding: 20,
    backgroundColor: '#lightgrey',
    borderRadius: 0,
    marginBottom: 0,
  },
  flashMessage: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AllAbsenScreen;
