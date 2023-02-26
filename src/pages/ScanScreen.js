'use strict';

import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useMyContext } from "../Context";
import axios from 'axios'
import { urlEndpointAPI } from '../utils';
import { FlashOffIcon, FlashOnIcon } from '../assets/icon';

const ScanScreen = (props)=>{
const { showFlash, message, isVisible, state, setState } = useMyContext();
 

  const onSuccess = async (e) => {
    console.log("eds:",e)
    console.log("eds:",e.data)
    await axios.post(`${urlEndpointAPI}/postusersattendance/${state.id}`,{ QRCode: e.data})
          .then(function (response) {
            console.log(response);
            showFlash(response.data.message);
            props.navigation.goBack()
          })
          .catch(function (error) {
            showFlash('you have been fill this absen');
            console.log("error di catch:",error);
            // props.navigation.goBack()
          });

 
  };

  const [isFlashOn, setIsFlashOn] = useState()

  return (
    <>
      {isVisible && (
               <View style={styles.flashContainer}>
                   <Text style={styles.flashMessage}>{message}</Text>
                </View>
            )}
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={
          isFlashOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off
        }
        // topContent={
        //   <Text style={styles.centerText}>
        //     Go to{' '}
        //     <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
        //     your computer and scan the QR code.
        //   </Text>
        // }

        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable} onPress={()=>setIsFlashOn(!isFlashOn)} >
            {isFlashOn?<FlashOffIcon/>:<FlashOnIcon/>}
          </TouchableOpacity>
        }
      />
    </>

    );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },
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

export default ScanScreen;
// AppRegistry.registerComponent('default', () => ScanPage);