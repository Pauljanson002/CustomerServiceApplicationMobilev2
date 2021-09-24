import React from 'react';
import MainApp from './src/Main';
import {NativeBaseProvider} from "native-base";

export default function App() {
    return(<NativeBaseProvider>
        <MainApp />
    </NativeBaseProvider>)
}