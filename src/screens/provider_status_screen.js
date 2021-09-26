import * as React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Animated,
  Pressable,
  ScrollView,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { NativeBaseProvider, Box, Text, Center } from 'native-base';
import Constants from 'expo-constants';
import { useMutation, useQuery, gql } from '@apollo/client';

const GET_SERVICE_REQUESTS_FOR_ME = gql`
  query Query {
    acceptedServiceRequestsForMe {
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
    startedServiceRequestsForMe {
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
    completedServiceRequestsForMe {
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
    pendingServiceRequestsForMe {
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
    canceledServiceRequestsForMe {
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
    rejectedServiceRequestsForMe {
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
    reviewedServiceRequestsForMe {
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

const COMPLETE_SR = gql`
  mutation CompleteServiceRequestMutation(
    $completeServiceRequestId: ID
    $completeServiceRequestFinalAmount: Int
  ) {
    completeServiceRequest(
      id: $completeServiceRequestId
      finalAmount: $completeServiceRequestFinalAmount
    ) {
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

const ProvidersStatusScreen = () => {
  const requestsForMe = useQuery(GET_SERVICE_REQUESTS_FOR_ME);
  const [cancel, setCancel] = React.useState('Cancel');
  const [reject, setReject] = React.useState('Reject');
  const [start, setStart] = React.useState('Start');
  const [complete, setComplete] = React.useState('Complete');
  const [cancelServiceRequest, { loading_cancel, error_cancel }] = useMutation(
    CANCEL_SR,
    {
      onCompleted: (data) => {
        addToast('Successfully canceled request', { appearance: 'success' });
        setCancel('Canceled');
        history.push(`/profile/serviceRequestsSent`);
      },
      onError: (error) => {
        console.log(error);
        addToast('Failed ', { appearance: 'error' });
      },
    }
  );

  const [rejectServiceRequest, { loading_reject, error_reject }] = useMutation(
    REJECT_SR,
    {
      onCompleted: (data) => {
        addToast('Successfully rejected request', { appearance: 'success' });
        setCancel('Rejected');
        history.push(`/profile/serviceRequestsForMe`);
      },
      onError: (error) => {
        addToast('Failed ', { appearance: 'error' });
      },
    }
  );

  const [startServiceRequest, { loading_start, error_start }] = useMutation(
    START_SR,
    {
      onCompleted: (data) => {
        addToast('Successfully started the request', {
          appearance: 'success',
        });

        history.push(`/profile/serviceRequestsForMe`);
      },
      onError: (error) => {
        console.log(error);
        addToast('Failed ', { appearance: 'error' });
      },
    }
  );

  const [completeServiceRequest, { loading_complete, error_complete }] =
    useMutation(COMPLETE_SR, {
      onCompleted: (data) => {
        addToast('Successfully completed the request', {
          appearance: 'success',
        });

        history.push(`/profile/serviceRequestsForMe`);
      },
      onError: (error) => {
        console.log(error);
        addToast('Failed ', { appearance: 'error' });
      },
    });
  const [view, setView] = React.useState('Pending');

  if (
    requestsForMe.loading ||
    loading_reject ||
    loading_cancel ||
    loading_start ||
    loading_complete
  )
    return <Text>Loading..</Text>;

  const acceptedRequests = requestsForMe.data.acceptedServiceRequestsForMe;
  const pendingRequests = requestsForMe.data.pendingServiceRequestsForMe;
  const startedRequests = requestsForMe.data.startedServiceRequestsForMe;
  const completedRequests = requestsForMe.data.completedServiceRequestsForMe;
  const canceledRequests = requestsForMe.data.canceledServiceRequestsForMe;
  const rejectedRequests = requestsForMe.data.rejectedServiceRequestsForMe;
  const reviewedRequests = requestsForMe.data.reviewedServiceRequestsForMe;

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignContent: 'center',
        }}
      >
        <TouchableOpacity
          key={1}
          style={{
            height: 40,
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'dodgerblue',
            borderRadius: 8,
            margin: 4,
          }}
          onPress={() => {
            setView('Pending');
          }}
        >
          <Text style={{ color: 'white' }}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={2}
          style={{
            height: 40,
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'dodgerblue',
            borderRadius: 8,
            margin: 4,
          }}
          onPress={() => {
            setView('Accepted');
          }}
        >
          <Text style={{ color: 'white' }}>Accepted</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={3}
          style={{
            height: 40,
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'dodgerblue',
            borderRadius: 8,
            margin: 4,
          }}
          onPress={() => {
            setView('Started');
          }}
        >
          <Text style={{ color: 'white' }}>Started</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={4}
          style={{
            height: 40,
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'dodgerblue',
            borderRadius: 8,
            margin: 4,
          }}
          onPress={() => {
            setView('Completed');
          }}
        >
          <Text style={{ color: 'white' }}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={5}
          style={{
            height: 40,
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'dodgerblue',
            borderRadius: 8,
            margin: 4,
          }}
          onPress={() => {
            setView('Reviewed');
          }}
        >
          <Text style={{ color: 'white' }}>Reviewed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          key={5}
          style={{
            height: 40,
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'dodgerblue',
            borderRadius: 8,
            margin: 4,
          }}
          onPress={() => {
            setView('Rejected');
          }}
        >
          <Text style={{ color: 'white' }}>Rejected</Text>
        </TouchableOpacity>

        <TouchableOpacity
          key={5}
          style={{
            height: 40,
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'dodgerblue',
            borderRadius: 8,
            margin: 4,
          }}
          onPress={() => {
            setView('Canceled');
          }}
        >
          <Text style={{ color: 'white' }}>Canceled</Text>
        </TouchableOpacity>
      </View>

      {view === 'Pending' ? (
        <>
          <ScrollView>
            {pendingRequests.length !== 0 ? (
              <ScrollView>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  Pending Requests for you
                </Text>
                {pendingRequests.map((request, index) => (
                  <View style={styles.container}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {request.task}
                      </Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        Date - {request.date}
                      </Text>

                      <Text>Time - {request.time} H</Text>

                      <TouchableOpacity
                        key={request.id}
                        style={{
                          height: 40,
                          width: '60%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'mediumseagreen',
                          borderRadius: 8,
                          margin: 4,
                          padding: 6,
                        }}
                        onPress={() => {
                          navigation.navigate('HireNow', { id: request.id });
                          console.log(request.id);
                        }}
                      >
                        <Text style={{ color: 'white' }}>View & Accept</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        key={request.id}
                        style={{
                          height: 40,
                          width: 90,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'red',
                          borderRadius: 8,
                          margin: 4,
                        }}
                        onPress={() => {
                          navigation.navigate('HireNow', { id: request.id });
                          console.log(request.id);
                        }}
                      >
                        <Text style={{ color: 'white' }}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
               <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  No Pending Requests for you -_-
                </Text>
              
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}

      {view === 'Canceled' ? (
        <>
          <ScrollView>
            {canceledRequests.length !== 0 ? (
              <ScrollView>
                   <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  Canceled Requests for you
                </Text>
                {canceledRequests.map((request, index) => (
                  <View style={styles.container}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {request.task}
                      </Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        Date - {request.date}
                      </Text>

                      <Text>Time - {request.time} H</Text>

                      <TouchableOpacity
                        key={request.id}
                        style={{
                          height: 40,
                          width: 90,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'mediumturquoise',
                          borderRadius: 8,
                          margin: 4,
                        }}
                        onPress={() => {
                          navigation.navigate('HireNow', { id: request.id });
                          console.log(request.id);
                        }}
                      >
                        <Text style={{ color: 'white' }}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
               <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  No Canceled Requests from you -_-
                </Text>
              
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}

      {view === 'Accepted' ? (
        <>
          <ScrollView>
            {acceptedRequests.length !== 0 ? (
              <ScrollView>
                   <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  Your Accepted Requests
                </Text>
                {acceptedRequests.map((request, index) => (
                  <View style={styles.container}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {request.task}
                      </Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        Date - {request.date}
                      </Text>

                      <Text>Time - {request.time} H</Text>

                      <TouchableOpacity
                        key={request.id}
                        style={{
                          height: 40,
                          width: 90,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'mediumturquoise',
                          borderRadius: 8,
                          margin: 4,
                        }}
                        onPress={() => {
                          navigation.navigate('HireNow', { id: request.id });
                          console.log(request.id);
                        }}
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
                          backgroundColor: 'red',
                          borderRadius: 8,
                          margin: 4,
                        }}
                        onPress={() => {
                          navigation.navigate('HireNow', { id: request.id });
                          console.log(request.id);
                        }}
                      >
                        <Text style={{ color: 'white' }}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
              <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  No Accepted Requests  -_-
                </Text>
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}

      {view === 'Started' ? (
        <>
          <ScrollView>
            {startedRequests.length !== 0 ? (
              <ScrollView>
                   <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  Started Requests
                </Text>
                {startedRequests.map((request, index) => (
                  <View style={styles.container}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {request.task}
                      </Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        Date - {request.date}
                      </Text>

                      <Text>Time - {request.time} H</Text>

                      <TouchableOpacity
                        key={request.id}
                        style={{
                          height: 40,
                          width: 90,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'mediumturquoise',
                          borderRadius: 8,
                          margin: 4,
                        }}
                        onPress={() => {
                          navigation.navigate('HireNow', { id: request.id });
                          console.log(request.id);
                        }}
                      >
                        <Text style={{ color: 'white' }}>View</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        key={request.id}
                        style={{
                          height: 40,
                          width: '60%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'mediumseagreen',
                          borderRadius: 8,
                          margin: 4,
                          padding: 4,
                        }}
                        onPress={() => {
                          navigation.navigate('HireNow', { id: request.id });
                          console.log(request.id);
                        }}
                      >
                        <Text style={{ color: 'white' }}>Mark Completed</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
               <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  No Ongoing services -_-
                </Text>
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}

      {view === 'Completed' ? (
        <>
          <ScrollView>
            {completedRequests.length !== 0 ? (
              <ScrollView>
                   <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  Services you have Completed
                </Text>
                {completedRequests.map((request, index) => (
                  <View style={styles.container}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {request.task}
                      </Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        Date - {request.date}
                      </Text>

                      <Text>Time - {request.time} H</Text>

                      <TouchableOpacity
                        key={request.id}
                        style={{
                          height: 40,
                          width: 90,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'mediumturquoise',
                          borderRadius: 8,
                          margin: 4,
                        }}
                        onPress={() => {
                          navigation.navigate('HireNow', { id: request.id });
                          console.log(request.id);
                        }}
                      >
                        <Text style={{ color: 'white' }}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
                <>
                 <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 20,
                    }}
                  >
                   No Completed Requests  -_-
                  </Text>
                </>
              )}
            </ScrollView>
          </>
        ) : (
          <></>
        )}
        

            {view === 'Reviewed' ? (
              <>
                <ScrollView>
                  {reviewedRequests.length !== 0 ? (
                    <ScrollView>
                         <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  Reviewed Requests
                </Text>
                      {reviewedRequests.map((request, index) => (
                        <View style={styles.container}>
                          <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                              {request.task}
                            </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                              Date - {request.date}
                            </Text>

                            <Text>Time - {request.time} H</Text>

                            <TouchableOpacity
                              key={request.id}
                              style={{
                                height: 40,
                                width: 90,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'mediumturquoise',
                                borderRadius: 8,
                                margin: 4,
                              }}
                              onPress={() => {
                                navigation.navigate('HireNow', {
                                  id: request.id,
                                });
                                console.log(request.id);
                              }}
                            >
                              <Text style={{ color: 'white' }}>View</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <>
                     <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          padding: 20,
                        }}
                      >
                        No Reviewed Requests for you -_-
                      </Text>
                    </>
                  )}
                </ScrollView>
              </>
            ) : (
              <></>
            )}

            {view === 'Rejected' ? (
              <>
                <ScrollView>
                  {rejectedRequests.length !== 0 ? (
                    <ScrollView>
                        <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  Rejected Requests
                </Text>
                      {startedRequests.map((request, index) => (
                        <View style={styles.container}>
                          <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                              {request.task}
                            </Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                              Date - {request.date}
                            </Text>

                            <Text>Time - {request.time} H</Text>

                            <TouchableOpacity
                              key={request.id}
                              style={{
                                height: 40,
                                width: 90,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'mediumturquoise',
                                borderRadius: 8,
                                margin: 4,
                              }}
                              onPress={() => {
                                navigation.navigate('HireNow', {
                                  id: request.id,
                                });
                                console.log(request.id);
                              }}
                            >
                              <Text style={{ color: 'white' }}>View</Text>
                            </TouchableOpacity>

                            
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <>
                     <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          padding: 20,
                        }}
                      >
                        No Results
                      </Text>
                    </>
                  )}
                </ScrollView>
              </>
            ) : (
              <></>
            )}

</>
  );
            }
         

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

ProvidersStatusScreen.navigationOptions = {
  title: 'ProviderStatus',
};
export default ProvidersStatusScreen;
