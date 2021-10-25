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
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const RequestersStatusScreen = () => {
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
  if (networkStatus === NetworkStatus.refetch) return <Text>Refetching!</Text>;
  if (
    loading ||
    loading_reject ||
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
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
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
                            navigation.navigate('HireNow', { id: request.id });
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
                          onPress={() => {
                            navigation.navigate('HireNow', { id: request.id });
                            console.log(request.id);
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
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
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
                            navigation.navigate('HireNow', { id: request.id });
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
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
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
                            navigation.navigate('HireNow', { id: request.id });
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
                          onPress={() => {
                            navigation.navigate('HireNow', { id: request.id });
                            console.log(request.id);
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
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,

                    margin: 20,
                  }}
                >
                  No Accepted Requests. Check if it's still Pending or Rejected!
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
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
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
                            navigation.navigate('HireNow', { id: request.id });
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
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
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
                            navigation.navigate('HireNow', { id: request.id });
                            console.log(request.id);
                          }}
                        >
                          <Text style={{ color: 'white' }}>View Request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          key={request.id}
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
                            navigation.navigate('HireNow', { id: request.id });
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
                        style={{ fontWeight: 'bold', fontSize: 18, margin: 4 }}
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
                            navigation.navigate('HireNow', { id: request.id });
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
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  No Reviewed Requests by you -_-
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
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
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
                            navigation.navigate('HireNow', { id: request.id });
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

    justifyContent: 'center',
    padding: 15,

    borderWidth: 1,
    borderColor: '#a3a3a3',

    elevation: 24,
  },
});

RequestersStatusScreen.navigationOptions = {
  title: 'RequesterStatus',
};
export default RequestersStatusScreen;
