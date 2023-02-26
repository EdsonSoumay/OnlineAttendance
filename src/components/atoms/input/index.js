// export default Input
import { TextInput, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'

const Input = ({ 
  styleView, styleText, text, // container,
  icon, onPressIcon, // di icon
  placeholder, styleInput , autoCapitalize, onChangeText, onEndEditing, secureTextEntry,
}) => {
  return (
    <>
      <Text style={styleText}>{text}</Text>
        <View style={styleView}>
          <TextInput
            placeholder={placeholder}
            style={styleInput}
            autoCapitalize={autoCapitalize}
            onChangeText={onChangeText}
            onEndEditing={onEndEditing}
            secureTextEntry={secureTextEntry}
          />
          {
            icon?
            <TouchableOpacity onPress={onPressIcon}>
              {icon}
            </TouchableOpacity>
            :
            null
          }
      </View>
    </>
    )
}

export default Input
