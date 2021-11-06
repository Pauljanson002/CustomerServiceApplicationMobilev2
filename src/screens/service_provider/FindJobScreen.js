import React, {useState} from "react";
import {useQuery,gql} from "@apollo/client";
import {GET_JOB_POSTING_FEED, GET_ME_AS_SERVICE_PROVIDER} from "../../gql/query";
import Loading from "../../components/Loading";
import {Center, Container, Heading, VStack, FormControl, Input, Button, ScrollView, Text, FlatList,} from "native-base";
import {set} from "react-native-reanimated";
import MyTile from "../../components/MyTile";
import {TouchableOpacity} from "react-native";


const FindJobScreen = ({navigation})=>{
    const [values,setValues] = useState({
        jobPostingFeedProvince:"",
        jobPostingFeedCity:"",
        jobPostingFeedTown:"",
        jobPostingFeedCategory:""
    });
    const handleChange = (name)=>(value)=>{
        setValues({
                ...values,
                [name]:value
        }
        )
    }
    const {data,loading,error,fetchMore} = useQuery(GET_ME_AS_SERVICE_PROVIDER)
    const job_query = useQuery(GET_JOB_POSTING_FEED,{
        variables:{
            jobPostingFeedProvince:"",
            jobPostingFeedCity:"",
            jobPostingFeedTown:"",
            jobPostingFeedCategory:"",
            jobPostingFeedCursor:"",
        },
        fetchPolicy:"cache-and-network",
        nextFetchPolicy:"cache-and-network",
    })
    if(loading || job_query.loading) return <Loading/>
   return(
       <ScrollView>
           <Center mt={"3"}>
               <Heading>Available Jobs in the Area</Heading>
               <VStack width="90%" mx="3" mt={"3"}>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>Province</FormControl.Label>
                       <Input
                           placeholder="Province"
                           onChangeText={handleChange("jobPostingFeedProvince")}
                       />
                   </FormControl>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>City</FormControl.Label>
                       <Input
                           placeholder="City"
                           onChangeText={handleChange("jobPostingFeedCity")}
                       />
                   </FormControl>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>Town</FormControl.Label>
                       <Input
                           placeholder="Town"
                           onChangeText={handleChange("jobPostingFeedTown")}
                       />
                   </FormControl>
                   <FormControl isRequired>
                       <FormControl.Label _text={{bold: true}}>Category</FormControl.Label>
                       <Input
                           placeholder="Category"
                           onChangeText={handleChange("jobPostingFeedCategory")}
                       />
                   </FormControl>
                   <FormControl mt={"3"}>
                       <Button onPress={(event)=>{
                           job_query.refetch({
                               ...values
                           }).then((data)=>console.log(data))
                       }}>Fetch Results</Button>
                   </FormControl>
               </VStack>
                      {job_query.data.jobPostingFeed.jobPostings.length ===0 && (<Text>No jobs found</Text>)}
                      <FlatList
                        data={job_query.data.jobPostingFeed.jobPostings}
                        renderItem={({item})=>{
                            return (
                                <TouchableOpacity onPress={()=>{
                                    console.log(navigation.navigate("JobPosting",{
                                        id:item.id
                                    }))
                                }} activeOpacity={0.8}>
                                <MyTile heading={item.heading} center={item.description} subheading={`@${item.postedBy.username} , ${item.location.town+" , "+item.location.city}`}
                            footer={`LKR ${item.budgetRange.lowerLimit} - LKR ${item.budgetRange.upperLimit}`}/>
                        </TouchableOpacity>)
                        }}
                      />
           </Center>
       </ScrollView>

   )
}
export default FindJobScreen