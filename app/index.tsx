import { View, Text } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
const [data, setData] = useState<any>();
const URLAPI = "https://3000-firebase-listatareas-1762974317595.cluster-ocv3ypmyqfbqysslgd7zlhmxek.cloudworkstations.dev/tareas";

const index = () => {
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index