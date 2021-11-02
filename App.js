import React from 'react';
import MainApp from './src/Main';
import {NativeBaseProvider} from "native-base";
import { ToastProvider } from 'react-native-toast-notifications'

export default function App() {
    return(
        <ToastProvider>
    <NativeBaseProvider>
        <MainApp />
    </NativeBaseProvider>
    </ToastProvider>)
}