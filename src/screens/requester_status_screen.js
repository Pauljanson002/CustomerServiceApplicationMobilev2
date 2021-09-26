import React, { useState } from "react";
import {ScrollView, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {useQuery,gql, useMutation} from "@apollo/client";
import Swiper from 'react-native-swiper';

const GET_SERVICE_REQUESTS_OF_ME=gql`
query Query {
  acceptedServiceRequestsbyMe {
    id
    requester_id
    provider_id
    date
    time
    task
    min_price
    max_price
    location
  }
  startedServiceRequestsbyMe {
    id
    requester_id
    provider_id
    time
    date
    min_price
    max_price
    payMethod
    task
    location
  }
  completedServiceRequestsbyMe {
    id
    requester_id
    provider_id
    date
    time
    task
    min_price
    max_price
    location
  }
  pendingServiceRequestsbyMe {
    id
    requester_id
    provider_id
    date
    time
    payMethod
    task
    min_price
    max_price
    location
  }
  canceledServiceRequestsbyMe {
    id
    requester_id
    provider_id
    time
    date
    payMethod
    task
    min_price
    max_price
    location
  }
  rejectedServiceRequestsbyMe {
    id
    requester_id
    provider_id
    date
    time
    payMethod
    task
    min_price
    max_price
    location
  
}
reviewedServiceRequestsbyMe {
    id
    date
    time
    payMethod
    task
    min_price
    max_price
    provider_id
    requester_id
    location
    requestReview
    requestRating
  }
}
`;


const CANCEL_SR = gql`
  mutation CancelServiceRequestMutation($cancelServiceRequestId: ID) {
    cancelServiceRequest(id: $cancelServiceRequestId) {
      date
      time
      task
      state
    }
  }
`;

const REJECT_SR = gql`
  mutation RejectServiceRequestMutation($rejectServiceRequestId: ID) {
    rejectServiceRequest(id: $rejectServiceRequestId) {
      date
      time
      task
      state
    }
  }
`;


const COMPLETE_SR=gql`
mutation CompleteServiceRequestMutation($completeServiceRequestId: ID, $completeServiceRequestFinalAmount: Int) {
  completeServiceRequest(id: $completeServiceRequestId, finalAmount: $completeServiceRequestFinalAmount) {
    requester_id
    provider_id
    id
    task
    state
  }
}
`;



const START_SR = gql`
  mutation StartServiceRequestMutation($startServiceRequestId: ID) {
    startServiceRequest(id: $startServiceRequestId) {
      date
      time
      task
      state
    }

  }
`;

const ACCEPT_SR = gql`
  mutation AcceptServiceRequestMutation(
    $acceptServiceRequestId: ID
    $acceptServiceRequestEstimate: String
  ) {
    acceptServiceRequest(
      id: $acceptServiceRequestId
      estimate: $acceptServiceRequestEstimate
    ) {
      date
      time
      state
      estimate
    }
  }
`;
function Requests({navigation,requests, loading,state,user}){

    const [cancel,setCancel]=useState('Cancel');
    const [reject,setReject]=useState('Reject');
    const [start,setStart]=useState('Start');
    const [complete,setComplete]=useState('Complete');
    const [cancelServiceRequest, { loading_cancel, error_cancel }] = useMutation(
      CANCEL_SR,
      {
        onCompleted: data => {
          addToast('Successfully canceled request', { appearance: 'success' });
          setCancel('Canceled');
          history.push(`/profile/serviceRequestsSent`);
        },
        onError: error => {
            console.log(error)
          addToast('Failed ', { appearance: 'error' });
        }
      }
    );
  
    const [rejectServiceRequest, { loading_reject, error_reject }] = useMutation(
      REJECT_SR,
      {
        onCompleted: data => {
          addToast('Successfully rejected request', { appearance: 'success' });
          setCancel('Rejected');
          history.push(`/profile/serviceRequestsForMe`);
        },
        onError: error => {
          addToast('Failed ', { appearance: 'error' });
        }
      }
    );
  
    const [startServiceRequest, { loading_start, error_start }] = useMutation(
      START_SR,
      {
        onCompleted: data => {
          addToast('Successfully started the request', {
            appearance: 'success'
          });
  
          history.push(`/profile/serviceRequestsForMe`);
        },
        onError: error => {
          console.log(error);
          addToast('Failed ', { appearance: 'error' });
        }
      }
    );
  
    const [completeServiceRequest, { loading_complete, error_complete }] = useMutation(
      COMPLETE_SR,
      {
        onCompleted: data => {
          addToast('Successfully completed the request', {
            appearance: 'success'
          });
  
          history.push(`/profile/serviceRequestsForMe`);
        },
        onError: error => {
          console.log(error);
          addToast('Failed ', { appearance: 'error' });
        }
      }
    );
  
    if (loading || loading_reject || loading_cancel||loading_start||loading_complete) {
        return <Text>Loading</Text>
    }


    return (
        <>
          {requests.length !== 0 ? (
            <ScrollView>
            
              {requests.map((request, index) => (
                <View style={styles.container}>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontWeight: 'bold' , fontSize:18}}>
                  {request.task}
          </Text>
          <Text style={{ fontWeight: 'bold' , fontSize:16}}>
          Date - {request.date}
          </Text>

          <Text>
          Time - {request.time} H
          </Text>
         
          {(state==='Reviewed')?<>
          <Text style={{ fontWeight: 'bold' , fontSize:16}}>
          Customer Review- {request.requestReview}
          </Text>

          <Text>
          Service Rating - {request.requestRating} / 5
          </Text>
          
          {state==='Pending' && user==='Provider'?
                 (
    
                    <>

                        <TouchableOpacity
            key={request.id}
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:request.id}); console.log(request.id)}}
          >
            <Text style={{ color: 'white' }}>View and Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            key={request.id}
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:request.id}); console.log(request.id)}}
          >
            <Text style={{ color: 'white' }}>Reject</Text>
          </TouchableOpacity>
                    
                    
                    </>):(<></>)
         }
          
          </>:<></>}


          {(state==='Pending'|| state==='Accepted') && user==='Requester'?
          (<>
          
          <TouchableOpacity
            key={request.id}
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:request.id}); console.log(request.id)}}
          >
            <Text style={{ color: 'white' }}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            key={request.id}
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:request.id}); console.log(request.id)}}
          >
            <Text style={{ color: 'white' }}>{cancel}</Text>
          </TouchableOpacity>
          
          
          </>):(<></>)
        }


        {state==='Accepted'  && user==='Provider'?(
        <>
          <TouchableOpacity
           
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:request.id}); console.log(request.id)}}
          >
            <Text style={{ color: 'white' }}>view</Text>
          </TouchableOpacity>
          <TouchableOpacity
            key={request.id}
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:request.id}); console.log(request.id)}}
          >
            <Text style={{ color: 'white' }}>{reject}</Text>
          </TouchableOpacity>


          <TouchableOpacity
            key={request.id}
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:request.id}); console.log(request.id)}}
          >
            <Text style={{ color: 'white' }}>{start}</Text>
          </TouchableOpacity>
        
        
        </>
        ):(<></>)}


        {state==='Started' && (user==='Provider'||user==='Requester')?(

            <>
                  <TouchableOpacity
            key={request.id}
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:request.id}); console.log(request.id)}}
          >
            <Text style={{ color: 'white' }}>view</Text>
          </TouchableOpacity>

          <TouchableOpacity
            key={request.id}
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:request.id}); console.log(request.id)}}
          >
            <Text style={{ color: 'white' }}>Mark Complete</Text>
          </TouchableOpacity>
            
            
            
            </>):(<></>)
}

{(state==='Completed'|| state==='Reviewed'|| state==='Canceled'|| state==='Rejected')?<>


<TouchableOpacity
            key={request.id}
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:request.id}); console.log(request.id)}}
          >
            <Text style={{ color: 'white' }}>view</Text>
          </TouchableOpacity>
</>:<></>
}


        </View>
        
</View>
    
              ))}              
                        

                     
                         
    
    
    
    
           </ScrollView>
          ) : (
            
              <Text>No Requests! Check Later</Text>
            
          )}
        </>
      );
    

}

const RequesterStatusScreen = ({navigation})=>{
    const requestsByMe = useQuery(GET_SERVICE_REQUESTS_OF_ME)
    if (requestsByMe.loading) return <Text>Loading</Text>
    const acceptedRequests=requestsByMe.data.acceptedServiceRequestsbyMe;
    const pendingRequests=requestsByMe.data.pendingServiceRequestsbyMe;
    const startedRequests=requestsByMe.data.startedServiceRequestsbyMe;
    const completedRequests=requestsByMe.data.completedServiceRequestsbyMe;
    const canceledRequests=requestsByMe.data.canceledServiceRequestsbyMe;
    const rejectedRequests=requestsByMe.data.rejectedServiceRequestsbyMe;
    const reviewedRequests=requestsByMe.data.reviewedServiceRequestsbyMe;
    
   return(
       <View>
          
           <Text>ProvidersScreen</Text>
           <Requests requests={pendingRequests} navigation={navigation} loading={requestsByMe.loading} state="Pending"
          user="Requester"/>
       </View>
   )
}

RequesterStatusScreen.navigationOptions = {
    title: 'RequesterStatus'
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      margin: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
  
      elevation: 24,
    },
  });
export default RequesterStatusScreen