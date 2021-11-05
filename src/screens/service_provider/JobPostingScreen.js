import React, {useState} from "react";
import {Button, Center, FormControl, Heading, Input, ScrollView, Text, VStack} from "native-base";
import TextArea from "native-base/src/components/primitives/TextArea/index";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useMutation, useQuery} from "@apollo/client";
import {GET_JOB_POSTING} from "../../gql/query";
import Loading from "../../components/Loading";
import {ADD_JOB_BID} from "../../gql/mutation";
import {useToast} from "react-native-toast-notifications";

const JobPostingScreen = ({navigation})=>{
    const [values,setValues] = useState({
        createJobBidProposedAmount:"",
        date:"",
        time:"",
        createJobBidJobPosting:navigation.getParam("id"),
        createJobBidProposedDate:"",
        createJobBidDetailedBreakdown:""
    });
    const toast = useToast()
    const jobPostingQuery = useQuery(GET_JOB_POSTING,{
        variables:{
            jobPostingId:navigation.getParam("id")
        }
    })
    const [jobBid,jobBidState] = useMutation(ADD_JOB_BID,{
        onCompleted:(data)=>{
            toast.show("Successfully added",{
                type:"success"
            })
            navigation.navigate("FindJob")
        },
        onError:(error)=>{
            toast.show("Failed",{
                type:"danger"
            })
            console.log(error.message)
        }
    })

    const [datepicker,setDatePicker] = useState(false)
    const handleChange = (name)=>(value)=>{
        setValues({
                ...values,
                [name]:value
            }
        )
    }
    const handleConfirm = (date)=>{
        console.log(date)
        setDatePicker(false)
        const dateNow = new Date(date)
        setValues({
            ...values,
            createJobBidProposedDate:date,
            date: dateNow.toLocaleDateString(),
            time:dateNow.toLocaleTimeString()
        })

    }
    const handleSubmit = (event)=>{
        event.preventDefault()
        jobBid({
            variables:{
                createJobBidProposedAmount:parseFloat(values.createJobBidProposedAmount),
                createJobBidProposedDate:values.createJobBidProposedDate,
                createJobBidJobPosting:values.createJobBidJobPosting,
                createJobBidDetailedBreakdown:values.createJobBidDetailedBreakdown
            }
        })
    }
    if(jobPostingQuery.loading) return <Loading/>
   return(
       <Center mt={"3"}>
           <Heading>Add bid for the job</Heading>
           <VStack width={"90%"} mx={"3"} mt={"3"}>
                <Text bold>Posted By :</Text>
                <Text>{jobPostingQuery.data.jobPosting.postedBy.username}</Text>
               <Text bold>Job heading: </Text>
               <Text>{jobPostingQuery.data.jobPosting.heading}</Text>
               <Text bold>Job description: </Text>
               <Text>{jobPostingQuery.data.jobPosting.description}</Text>
               <Text bold>Budget Range:</Text>
               <Text>LKR{jobPostingQuery.data.jobPosting.budgetRange.lowerLimit} - LKR{jobPostingQuery.data.jobPosting.budgetRange.upperLimit}</Text>
           </VStack>
           <VStack width="90%" mx="3" mt={"3"}>
               <FormControl isRequired>
                   <FormControl.Label _text={{bold: true}}>Proposed amount(LKR)</FormControl.Label>
                   <Input
                       placeholder="eg: 1000"
                       onChangeText={handleChange("createJobBidProposedAmount")}
                       value={values.createJobBidProposedAmount}
                   />
               </FormControl>

               <FormControl isRequired>
                   <FormControl.Label _text={{bold: true}}>Date proposed</FormControl.Label>

                   <Input
                       isDisabled={true}
                       placeholder="dd/mm/yyyy"
                       value={values.date}
                   />
                   <DateTimePickerModal onConfirm={handleConfirm} onCancel={(date)=>setDatePicker(false)} mode={"datetime"} isVisible={datepicker}/>
               </FormControl>
               <FormControl isRequired>
                   <FormControl.Label _text={{bold: true}}>Time proposed</FormControl.Label>
                   <Input
                        isDisabled={true}
                       placeholder="hh:mm:ss"
                       value={values.time}
                   />
               </FormControl>
               <Button onPress={(event) => setDatePicker(true)}>Open Date time picker</Button>
               <FormControl isRequired>
                   <FormControl.Label _text={{bold: true}}>Estimated cost breakdown</FormControl.Label>
                   <TextArea
                       value={values.createJobBidDetailedBreakdown}
                       onChangeText={handleChange("createJobBidDetailedBreakdown")}
                   />
               </FormControl>
               <FormControl mt={"3"}>
                   <Button onPress={handleSubmit}>Add Bid</Button>
               </FormControl>
           </VStack>
       </Center>

   )
}
export default JobPostingScreen