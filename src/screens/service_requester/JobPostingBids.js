import React from "react";
import {Box, Center, Text, VStack} from "native-base";
import {useMutation, useQuery} from "@apollo/client";
import {useToast} from "react-native-toast-notifications";
import {GET_JOB_POSTING_STATE, GET_ME, GET_MY_JOB_POSTING_BIDS} from "../../gql/query";
import {ACCEPT_JOB_BID} from "../../gql/mutation";
import Loading from "../../components/Loading";
import Container from "native-base/src/components/composites/Container/index";
import MyTile from "../../components/MyTile";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en"
import PayHere from "@payhere/payhere-mobilesdk-reactnative";
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const JobPostingBids = ({navigation})=>{
    const toast = useToast()
    const jobPostingQuery = useQuery(GET_JOB_POSTING_STATE,{
        variables:{
            jobPostingId:navigation.getParam("id")
        }
    })
    const jobBidQuery = useQuery(GET_MY_JOB_POSTING_BIDS,{
        variables:{
            getMyJobPostingBidsId:navigation.getParam("id")
        },
        fetchPolicy:"cache-and-network"

    })
    const meQuery = useQuery(GET_ME)
    const [acceptJobBid,acceptJobBidStatus] = useMutation(ACCEPT_JOB_BID,{
        onCompleted:(data)=>{
            toast.show("Success",{type:"success"})
            history.push("/myJobPostings")
        }
    })
    const handleAcceptJobBid = (jobBidId)=>(event)=>{
        event.preventDefault()
        acceptJobBid({
            variables:{
                acceptJobBidJobPostingId:navigation.getParam("id"),
                acceptJobBidJobBidId:jobBidId
            }
        }).then(data=>console.log(data))
    }
    const get_red_button_fn = ()=>{

    }

    if(jobBidQuery.loading || jobPostingQuery.loading || meQuery.loading) return <Loading/>
    if(jobBidQuery.error || jobPostingQuery.error || meQuery.error) return <Text>{jobBidQuery.error.message || jobPostingQuery.error.message}</Text>
    const get_green_button_fn = (bid_id,bid_heading,bid_amount)=>(event)=>{

    }
    return(
        <Center>
            <VStack>
                <Box>
                    <Box>
                        {jobPostingQuery.data.jobPosting.state==="bid_selected" && (
                            <Box  bg={"green.200"}
                                  p="12"
                                  rounded="xl"
                                  _text={{
                                      fontSize: 'md',
                                      fontWeight: 'medium',
                                      color: 'warmGray.50',
                                      textAlign: 'center',
                                  }}
                                  mt={3}>
                <Text>Selected Bid for the Job </Text>
                <Text>Ref no: {navigation.getParam("id")}</Text>
              </Box>
                        )}
                        {jobPostingQuery.data.jobPosting.state==="open" && (
                            <Box
                                bg={"green.200"}
                                p="12"
                                rounded="xl"
                                _text={{
                                    fontSize: 'md',
                                    fontWeight: 'medium',
                                    color: 'warmGray.50',
                                    textAlign: 'center',
                                }}
                                mt={3}>
              <Text>Bids for the Job Posting</Text>
              <Text>Ref no : {navigation.getParam("id")}</Text>
              </Box>
                        )}
                        {jobPostingQuery.data.jobPosting.state ==="closed" && (
                            <Box>
                                <Box  bg={"red.200"}
                                      p="12"
                                      rounded="xl"
                                      _text={{
                                          fontSize: 'md',
                                          fontWeight: 'medium',
                                          color: 'warmGray.50',
                                          textAlign: 'center',
                                      }}
                                      mt={3}>
                                    <Text>This Job Posting is Closed</Text>
                                    <Text>Ref no: {navigation.getParam("id")}</Text>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
                <Box>
                    {jobPostingQuery.data.jobPosting.state ==="open" && (jobBidQuery.data.getMyJobPostingBids.map((obj,key)=>{
                        return <MyTile key={key}  subheading={obj.proposedAmount+" LKR"} heading={obj.bidBy.fullname}
                                                 center={new Date(obj.proposedDate).toLocaleString()+"\n"+obj.detailedBreakdown}

                                                footer={timeAgo.format(new Date(obj.updatedAt))}
                                                green_button_fn={handleAcceptJobBid(obj.id)} green_button_text={"Select this bid"} red_button_fn={""} red_button_text={"Remove this bid"}
                        />
                    }))}
                    {
                        jobPostingQuery.data.jobPosting.state ==="bid_selected" &&(
                            jobBidQuery.data.getMyJobPostingBids.map((obj,index)=>{
                                if(obj.state==="selected"){
                                    return <MyTile key={index}  subheading={obj.proposedAmount+" LKR"} heading={obj.bidBy.fullname}
                                                   center={new Date(obj.proposedDate).toLocaleString()+"\n"+obj.detailedBreakdown+"\n"+"State of the bid is: "+obj.state}

                                                   footer={timeAgo.format(new Date(obj.updatedAt))}
                                    />
                                }else if(obj.state === "completed"){
                                    return <MyTile key={index} subheading={obj.proposedAmount+" LKR"} heading={obj.bidBy.fullname}
                                                   center={new Date(obj.proposedDate).toLocaleString()+"\n"+obj.detailedBreakdown+"\n"+"State of the bid is: "+obj.state}
                                                            footer={timeAgo.format(new Date(obj.updatedAt))}
                                                            green_button_fn={get_green_button_fn(obj.id,obj.heading,obj.proposedAmount)}
                                                            red_button_fn={get_red_button_fn()}  extra={`State of the bid is  ${obj.state}`} />
                                }
                            })
                        )
                    }
                    {
                        jobPostingQuery.data.jobPosting.state ==="completed" && (
                            jobBidQuery.data.getMyJobPostingBids.map((obj,index)=>{
                                if(obj.state==="paid"){
                                    return (
                                        <MyTile key={index} subheading={obj.proposedAmount+" LKR"} heading={obj.bidBy.fullname}
                                                center={new Date(obj.proposedDate).toLocaleString()+"\n"+obj.detailedBreakdown+"\n"+"State of the bid is: "+obj.state}
                                                         footer={timeAgo.format(new Date(obj.updatedAt))}
                                                         green_button_text={"Add review"}
                                                         green_button_fn={(event)=>{navigation.navigate('Review',{
                                                             id:obj.id
                                                         })}}
                                                         extra={`State of the bid is  ${obj.state}`} />
                                    )
                                }
                            })
                        )
                    }
                </Box>

            </VStack>
        </Center>)
}
export default JobPostingBids