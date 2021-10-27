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
  RefreshControl,
} from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { Icon } from 'react-native-elements';
import { TabView, SceneMap } from 'react-native-tab-view';
import { NetworkStatus } from '@apollo/client';
import { Select, VStack, CheckIcon, HStack, Checkbox, Text } from 'native-base';
import Constants from 'expo-constants';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Rating } from 'react-native-ratings';

const GET_SERVICE_REQUESTS_OF_ME = gql`
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


const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const RequestersStatusScreen = ({ navigation}) => {
  const { data, loading, error, refetch, networkStatus } = useQuery(
    GET_SERVICE_REQUESTS_OF_ME,
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  );
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const [cancel, setCancel] = React.useState('Cancel');

  const [start, setStart] = React.useState('Start');
  const [complete, setComplete] = React.useState('Complete');
  const toast = useToast();
  const [cancelServiceRequest, { loading_cancel, error_cancel }] = useMutation(
    CANCEL_SR,
    {
      onCompleted: (data) => {
        toast.show('Successfully canceled request', { type: 'success' ,animationType: "slide-in"});
        setCancel('Canceled');
        refetch();
        
      },
      onError: (error) => {
        console.log(error);
        toast.show('Failed ', { type: 'danger',animationType: "slide-in" });
      },
    }
  );



  const [startServiceRequest, { loading_start, error_start }] = useMutation(
    START_SR,
    {
      onCompleted: (data) => {
        toast.show('Successfully started the request', {
          type: 'success',animationType: "slide-in"
        });

        
      },
      onError: (error) => {
        console.log(error);
        toast.show('Failed ', { type: 'danger' ,animationType: "slide-in"});
      },
    }
  );

  const [completeServiceRequest, { loading_complete, error_complete }] =
    useMutation(COMPLETE_SR, {
      onCompleted: (data) => {
        toast.show('Successfully completed the request', {
          type: 'success',animationType: "slide-in"
        });

       
      },
      onError: (error) => {
        console.log(error);
        toast.show('Failed ', { type: 'danger',animationType: "slide-in" });
      },
    });
  const [view, setView] = React.useState('Pending');
  if (networkStatus === NetworkStatus.refetch) return <Text>Refetching!</Text>;
  if (
    loading ||

    loading_cancel ||
    loading_start ||
    loading_complete
  )
    return <Text>Loading..</Text>;

  const acceptedRequests = data.acceptedServiceRequestsbyMe;
  const pendingRequests = data.pendingServiceRequestsbyMe;
  const startedRequests = data.startedServiceRequestsbyMe;
  const completedRequests = data.completedServiceRequestsbyMe;
  const canceledRequests = data.canceledServiceRequestsbyMe;
  const rejectedRequests = data.rejectedServiceRequestsbyMe;
  const reviewedRequests = data.reviewedServiceRequestsbyMe;

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <Select
          selectedValue={view}
          minWidth="190"
          minHeight="50"
          accessibilityLabel="Sort"
          placeholder="View Requests of.."
          padding={4}
          _selectedItem={{
            bg: '#bae6fd',
            endIcon: <CheckIcon size="5" />,
          }}
          mt={4}
          onValueChange={(itemValue) => {
            setView(itemValue);
            refetch();
          }}
        >
          <Select.Item label="Pending Requests" value="Pending" />
          <Select.Item label="Accepted Requests" value="Accepted" />
          <Select.Item label="Started Requests" value="Started" />
          <Select.Item label="Completed Requests" value="Completed" />
          <Select.Item label="Reviewed Requests" value="Reviewed" />
          <Select.Item label="Canceled Requests" value="Canceled" />
          <Select.Item label="Rejected Requests" value="Rejected" />
        </Select>
      </View>

      {view === 'Pending' ? (
        <>
          <ScrollView
            style={{ backgroundColor: 'white' }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {pendingRequests.length !== 0 ? (
              <ScrollView>
                {pendingRequests.map((request, index) => (
                  <View style={styles.container}>
                    <View style={{ alignItems: 'felx-start', flex: 1 }}>
                      <Text
                        style={{ fontWeight: 'bold', fontSize: 18 }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {request.task}
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="calendar"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.date}
                      </Text>

                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="clock-time-eight"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.time} H
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="google-maps"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.location}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}
                      >
                        <TouchableOpacity
                          key={request.id}
                          style={{
                            height: 40,
                            width: '43%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#06b6d4',
                            borderRadius: 8,
                            margin: 4,
                            padding: 8,
                          }}
                          onPress={() => {
                            navigation.navigate('Request', { id: request.id });
                            console.log(request.id);
                          }}
                        >
                          <Text style={{ color: 'white' }}>View Request</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          key={request.id + 1}
                          style={{
                            height: 40,
                            width: '43%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f43f5e',
                            borderRadius: 8,
                            margin: 4,
                          }}
                        
                          onPress={(event) => {
                            cancelServiceRequest({
                              variables:{
                                cancelServiceRequestId: request.id
                              }
                            });
                          }}
                          
                        >
                          <Text style={{ color: 'white' }}>{cancel}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
                <ScrollView
                  style={{ backgroundColor: 'white' }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 20,

                      margin: 20,
                    }}
                  >
                    No Pending Requests by you. Check if it's Accepted or
                    Rejected!
                  </Text>
                </ScrollView>
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}

      {view === 'Canceled' ? (
        <>
          <ScrollView
            style={{ backgroundColor: 'white' }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {canceledRequests.length !== 0 ? (
              <ScrollView>
                {canceledRequests.map((request, index) => (
                  <View style={styles.container}>
                    <View style={{ alignItems: 'felx-start', flex: 1 }}>
                      <Text
                        style={{ fontWeight: 'bold', fontSize: 18 }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {request.task}
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="calendar"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.date}
                      </Text>

                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="clock-time-eight"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.time} H
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="google-maps"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.location}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}
                      >
                        <TouchableOpacity
                          key={request.id}
                          style={{
                            height: 40,
                            width: '96%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#06b6d4',
                            borderRadius: 8,
                            margin: 4,
                            padding: 8,
                          }}
                          onPress={() => {
                            navigation.navigate('Request', { id: request.id });
                            console.log(request.id);
                          }}
                        >
                          <Text style={{ color: 'white' }}>View Request</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
                <ScrollView
                  style={{ backgroundColor: 'white' }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 20,
                    }}
                  >
                    No Canceled Requests by you -_-
                  </Text>
                </ScrollView>
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}

      {view === 'Accepted' ? (
        <>
          <ScrollView
            style={{ backgroundColor: 'white' }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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
                    <View style={{ alignItems: 'felx-start', flex: 1 }}>
                      <Text
                        style={{ fontWeight: 'bold', fontSize: 18 }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {request.task}
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="calendar"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.date}
                      </Text>

                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="clock-time-eight"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.time} H
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="google-maps"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.location}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}
                      >
                        <TouchableOpacity
                          key={request.id}
                          style={{
                            height: 40,
                            width: '43%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#06b6d4',
                            borderRadius: 8,
                            margin: 4,
                            padding: 8,
                          }}
                          onPress={() => {
                            navigation.navigate('Request', { id: request.id });
                            console.log(request.id);
                          }}
                        >
                          <Text style={{ color: 'white' }}>View Request</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          key={request.id + 1}
                          style={{
                            height: 40,
                            width: '43%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f43f5e',
                            borderRadius: 8,
                            margin: 4,
                          }}
                          onPress={(event) => {
                            cancelServiceRequest({
                              variables:{
                                cancelServiceRequestId: request.id
                              }
                            });
                          }}
                        >
                          <Text style={{ color: 'white' }}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
                <ScrollView
                  style={{ backgroundColor: 'white' }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 20,

                      margin: 20,
                    }}
                  >
                    No Accepted Requests. Check if it's still Pending or
                    Rejected!
                  </Text>
                </ScrollView>
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}

      {view === 'Started' ? (
        <>
          <ScrollView
            style={{ backgroundColor: 'white' }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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
                    <View style={{ alignItems: 'felx-start', flex: 1 }}>
                      <Text
                        style={{ fontWeight: 'bold', fontSize: 18 }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {request.task}
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="calendar"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.date}
                      </Text>

                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="clock-time-eight"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.time} H
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="google-maps"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.location}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}
                      >
                        <TouchableOpacity
                          key={request.id}
                          style={{
                            height: 40,
                            width: '43%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#06b6d4',
                            borderRadius: 8,
                            margin: 4,
                            padding: 8,
                          }}
                          onPress={() => {
                            navigation.navigate('Request', { id: request.id });
                            console.log(request.id);
                          }}
                        >
                          <Text style={{ color: 'white' }}>View Request</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          key={request.id + 1}
                          style={{
                            height: 40,
                            width: '43%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#059669',
                            borderRadius: 8,
                            margin: 4,
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
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
                <ScrollView
                  style={{ backgroundColor: 'white' }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 20,
                    }}
                  >
                    No Ongoing services!
                  </Text>
                </ScrollView>
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}

      {view === 'Completed' ? (
        <>
          <ScrollView
            style={{ backgroundColor: 'white' }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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
                  Completed Services
                </Text>
                {completedRequests.map((request, index) => (
                  <View style={styles.container}>
                    <View style={{ alignItems: 'felx-start', flex: 1 }}>
                      <Text
                        style={{ fontWeight: 'bold', fontSize: 18 }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {request.task}
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="calendar"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.date}
                      </Text>

                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="clock-time-eight"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.time} H
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="google-maps"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.location}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}
                      >
                        <TouchableOpacity
                          key={request.id}
                          style={{
                            height: 40,
                            width: '43%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#06b6d4',
                            borderRadius: 8,
                            margin: 4,
                            padding: 8,
                          }}
                          onPress={() => {
                            navigation.navigate('Request', { id: request.id });
                            console.log(request.id);
                          }}
                        >
                          <Text style={{ color: 'white' }}>View Request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          key={request.id + 1}
                          style={{
                            height: 40,
                            width: '43%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#fcd34d',
                            borderRadius: 8,
                            margin: 4,
                            padding: 8,
                          }}
                          onPress={() => {
                            navigation.navigate('RequesterReview', { id: request.id });
                            console.log(request.id);
                          }}
                        >
                          <Text style={{ color: 'white' }}>Add Review</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
                <ScrollView
                  style={{ backgroundColor: 'white' }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 20,
                    }}
                  >
                    No Completed Requests. If you have a completed request which
                    was reviewd, check in Reviewed Requests!
                  </Text>
                </ScrollView>
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}

      {view === 'Reviewed' ? (
        <>
          <ScrollView
            style={{ backgroundColor: 'white' }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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
                    <View style={{ alignItems: 'felx-start', flex: 1 }}>
                      <Text
                        style={{ fontWeight: 'bold', fontSize: 18 }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {request.task}
                      </Text>

                      <Rating
                        type="star"
                        ratingCount={5}
                        imageSize={20}
                        isDisabled={true}
                        readonly={true}
                        startingValue={request.requestRating}
                      />
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="calendar"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.date}
                      </Text>

                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="rate-review"
                          type="material-icons"
                          color="#517fa4"
                        />
                        {request.requestReview}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}
                      >
                        <TouchableOpacity
                          key={request.id}
                          style={{
                            height: 40,
                            width: '96%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#06b6d4',
                            borderRadius: 8,
                            margin: 4,
                            padding: 8,
                          }}
                          onPress={() => {
                            navigation.navigate('Request', { id: request.id });
                            console.log(request.id);
                          }}
                        >
                          <Text style={{ color: 'white' }}>View Request</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
                <ScrollView
                  style={{ backgroundColor: 'white' }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 20,
                    }}
                  >
                    No Reviewed requests by you!
                  </Text>
                </ScrollView>
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}

      {view === 'Rejected' ? (
        <>
          <ScrollView
            style={{ backgroundColor: 'white' }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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
                {rejectedRequests.map((request, index) => (
                  <View style={styles.container}>
                    <View style={{ alignItems: 'felx-start', flex: 1 }}>
                      <Text
                        style={{ fontWeight: 'bold', fontSize: 18 }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {request.task}
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="calendar"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.date}
                      </Text>

                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="clock-time-eight"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.time} H
                      </Text>
                      <Text
                        style={{ margin: 6, fontSize: 16, color: '#525252' }}
                      >
                        <Icon
                          name="google-maps"
                          type="material-community"
                          color="#517fa4"
                        />
                        {request.location}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}
                      >
                        <TouchableOpacity
                          key={request.id}
                          style={{
                            height: 40,
                            width: '96%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#06b6d4',
                            borderRadius: 8,
                            margin: 4,
                            padding: 8,
                          }}
                          onPress={() => {
                            navigation.navigate('Request', { id: request.id });
                            console.log(request.id);
                          }}
                        >
                          <Text style={{ color: 'white' }}>View Request</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <>
                <ScrollView
                  style={{ backgroundColor: 'white' }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 20,
                    }}
                  >
                    None of your requests were Rejected!
                  </Text>
                </ScrollView>
              </>
            )}
          </ScrollView>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 10,
    shadowColor: '#a5b4fc',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.58,
    shadowRadius: 12.0,

    elevation: 2,
  },
});

RequestersStatusScreen.navigationOptions = {
  title: 'RequesterStatus',
};
export default RequestersStatusScreen;
