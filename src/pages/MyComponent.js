import React, { useContext, createContext } from 'react';

import { View, Text, Button } from 'react-native';

import { MyContext } from '../Context';

function MyComponent() {

    const data = useContext(MyContext);
  
    console.log("data in my component:",data);
  
    const { state, setState } = data
  
  
    return (
      <View>
        <Text>{state.value}</Text>
        <Button title="Update value" onPress={() => setState({ value: 'new value' })} />
      </View>
    );
  }
  
  export default MyComponent