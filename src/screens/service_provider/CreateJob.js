import React, {useState} from "react";
import {Center, ScrollView, Text, Box, Heading, VStack, FormControl, Input, Button, TextArea} from "native-base";
import {useMutation, useQuery} from "@apollo/client";
import {GET_ME_AS_SERVICE_REQUESTER} from "../../gql/query";
import {useToast} from "react-native-toast-notifications";
import {ADD_JOB_POSTING} from "../../gql/mutation";
import Loading from "../../components/Loading";

const CreateJobScreen = ({navigation})=>{
    const [values,setValues] = useState({});
    const { loading, error, data } = useQuery(GET_ME_AS_SERVICE_REQUESTER);
    const toasts = useToast()
    const [
        createJobPosting,state
    ] = useMutation(ADD_JOB_POSTING, {
        onCompleted: data => {
            toasts.show("Done",{type:"success"})
            navigation.navigate('MyProfile')
        },
        onError: error1 => {
            toasts.show("Error ",{type:"error"})
        }
    });
    const handleChange = (name)=>(value)=>{
        setValues({
                ...values,
                [name]:value
            }
        )
    }
    const handleSubmit = (event)=>{
        event.preventDefault()
        createJobPosting({
            variables: {
                ...values,
                createJobPostingLowerLimit: parseFloat(values.createJobPostingLowerLimit),
                createJobPostingUpperLimit: parseFloat(values.createJobPostingUpperLimit)
            }
        }).then(r  =>console.log(r))

    }
    if(loading) return <Loading/>
   return(

       <ScrollView>
           <Center mt={"3"}>
               <Heading>Create a Job Posting</Heading>
               <VStack width="90%" mx="3" mt={"3"}>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>Job Title</FormControl.Label>
                       <Input
                           placeholder="Job title"
                           onChangeText={handleChange("createJobPostingHeading")}
                       />
                   </FormControl>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>Province</FormControl.Label>
                       <Input
                           placeholder="Province"
                           onChangeText={handleChange("createJobPostingProvince")}
                       />
                   </FormControl>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>City</FormControl.Label>
                       <Input
                           placeholder="City"
                           onChangeText={handleChange("createJobPostingCity")}
                       />
                   </FormControl>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>Town</FormControl.Label>
                       <Input
                           placeholder="Town"
                           onChangeText={handleChange("createJobPostingTown")}
                       />
                   </FormControl>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>Category</FormControl.Label>
                       <Input
                           placeholder="Category"
                           onChangeText={handleChange("createJobPostingCategory")}
                       />
                   </FormControl>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>Price min value</FormControl.Label>
                       <Input
                           placeholder="Min value"
                           onChangeText={handleChange('createJobPostingLowerLimit')}
                       />
                   </FormControl>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>Price max value</FormControl.Label>
                       <Input
                           placeholder="Max value"
                           onChangeText={handleChange('createJobPostingUpperLimit')}
                       />
                   </FormControl>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>Job Description</FormControl.Label>
                       <TextArea
                           placeholder="Eg: Details about the job"
                           onChangeText={handleChange('createJobPostingDescription')}
                       />
                   </FormControl>
                   <FormControl mt={"3"}>
                       <Button onPress={handleSubmit}>Submit</Button>
                   </FormControl>
               </VStack>
           </Center>
       </ScrollView>
   )
}

export default CreateJobScreen