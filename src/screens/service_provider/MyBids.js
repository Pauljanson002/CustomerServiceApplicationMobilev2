import React, {useState} from "react";
import {Box, Button, Center, FlatList, ScrollView, Text} from "native-base";
import MyTile from "../../components/MyTile";
import {useMutation, useQuery} from "@apollo/client";
import {GET_MY_BIDS} from "../../gql/query";
import Loading from "../../components/Loading";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en"
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')
import {useToast} from "react-native-toast-notifications";
import {CHANGE_JOB_BID_STATE} from "../../gql/mutation";

const MyBidsPage = ()=>{
    const toast = useToast()
    const [refreshPage,setRefreshPage] = useState(0)
    const bidsQuery = useQuery(GET_MY_BIDS,{
        variables:{
            state:"requested"
        },
        fetchPolicy:"cache-and-network"
    })
    const get_green_button_text = (state)=>{
        if(state === "selected"){
            return "Complete Job"
        }
        else if(state === "paid"){
            return "Add review"
        }
        else{
            return null
        }
    }
    const [changeStateJobBid,changeStateJobBidStatus] = useMutation(CHANGE_JOB_BID_STATE,{
        onCompleted:(data => {
            toast.show("Successfully changed",{
                type:"success"
            })
            bidsQuery.refetch().then(r => console.log(r))
        }),
        onError:(error => {
            toast.show("Error "+error.message ,{
                appearance:"error"
            })
        })
    })
    const get_green_button_fn = (state,id)=>{
        if (state === "selected"){
            return (event)=>{
                event.preventDefault()
                changeStateJobBid({
                    variables:{
                        jobBidId:id,
                        jobBidState:"completed"
                    }
                }).then((data)=>console.log(data)).catch((error)=>console.log(error))
            }
        }
        else if(state ==="paid"){
            return (event)=>{
                event.preventDefault()
                console.log("Clicked")
                // history.push("/providerReview/add/"+id)
            }
        }
        else{
            return undefined
        }
    }
    const get_red_button_fn = (state,id)=>{
        if(["requested","selected"].includes(state)){
            return (event)=>{
                event.preventDefault()
                changeStateJobBid({
                    variables:{
                        jobBidId:id,
                        jobBidState:"canceled"
                    }
                }).then((data)=>console.log(data)).catch((error)=>console.log(error))
            }
        }
    }
    const get_red_button_text = (state)=>{
        if(["requested","selected"].includes(state)){
            return "Cancel Bid"
        }else{
            return undefined
        }
    }
    const switchState = (state)=>(event)=>{
        event.preventDefault()
        bidsQuery.refetch({
            state:state
        }).then(data=>console.log(data))
    }
    if(bidsQuery.loading) return <Loading/>
   return(
       <ScrollView>
           <Center>
               <Box mt={3}>
                   <Button.Group direction={"column"}>
                       <Button onPress={switchState("requested")}>Requested Bids</Button>
                       <Button onPress={switchState("selected")}>Selected Bids</Button>
                       <Button onPress={switchState("completed")}>Completed Bids</Button>
                       <Button onPress={switchState("paid")}>Paid Bids</Button>
                       <Button onPress={switchState("canceled")}>Canceled Bids</Button>
                   </Button.Group>
               </Box>
               {
                   (bidsQuery.data.getMyBids.length>0)?(
                       <FlatList
                           data={bidsQuery.data.getMyBids}
                           renderItem={({item})=>{
                               return (<MyTile
                                   heading={`${item.jobPosting.heading} Posted By: @${item.jobPosting.postedBy.username}`}
                                   subheading={item.state.toUpperCase()}
                                   center={
                                       "Proposed Date: "+ new Date(item.proposedDate).toLocaleString().substr(3)+"\n"+
                                       "Proposed Amount: LKR "+ item.proposedAmount+"\n"+
                                       "Detailed Breakdown:\n"+
                                       item.detailedBreakdown
                                   }
                                    footer={timeAgo.format(new Date(item.updatedAt))}
                                   green_button_text={get_green_button_text(item.state)}
                                   green_button_fn={get_green_button_fn(item.state,item.id)}
                                   red_button_text={get_red_button_text(item.state)}
                                   red_button_fn={get_red_button_fn(item.state,item.id)}
                               />)
                           }}
                       />
                   ):(
                       <Box
                           bg={"red.200"}
                           p="12"
                           rounded="xl"
                           _text={{
                               fontSize: 'md',
                               fontWeight: 'medium',
                               color: 'warmGray.50',
                               textAlign: 'center',
                           }}
                           mt={3}
                       >
                           <Text>No bids yet</Text>
                       </Box>
                   )
               }
           </Center>
       </ScrollView>
   )
}

export default MyBidsPage