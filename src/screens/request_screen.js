import * as React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { useToast } from 'react-native-toast-notifications';
import { Icon } from 'react-native-elements';
import { TabView, SceneMap } from 'react-native-tab-view';
import { NetworkStatus } from '@apollo/client';
import {
  Button as Button2,
  VStack,
  CheckIcon,
  HStack,
  Button,
  FormControl,
  TextArea,
  Input,
} from 'native-base';
import Constants from 'expo-constants';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Rating } from 'react-native-ratings';
import { Linking } from 'react-native';
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

const RESCHEDULE_SR = gql`
  mutation RescheduleServiceRequestMutation(
    $rescheduleServiceRequestDate: String!
    $rescheduleServiceRequestTime: String!
    $rescheduleServiceRequestId: ID
  ) {
    rescheduleServiceRequest(
      date: $rescheduleServiceRequestDate
      time: $rescheduleServiceRequestTime
      id: $rescheduleServiceRequestId
    ) {
      date
      time
    }
  }
`;

const EDIT_SR = gql`
  mutation EditServiceRequestMutation(
    $editServiceRequestTask: String!
    $editServiceRequestId: ID
    $editServiceRequestImage1: String
    $editServiceRequestImage2: String
    $editServiceRequestImage3: String
  ) {
    editServiceRequest(
      id: $editServiceRequestId
      task: $editServiceRequestTask
      image1: $editServiceRequestImage1
      image2: $editServiceRequestImage2
      image3: $editServiceRequestImage3
    ) {
      task
    }
  }
`;

const FEEDBACK_SR = gql`
  mutation FeedbackServiceRequestMutation(
    $feedbackServiceRequestId: ID
    $feedbackServiceRequestRequestRating: Int
    $feedbackServiceRequestRequestReview: String
  ) {
    feedbackServiceRequest(
      id: $feedbackServiceRequestId
      requestRating: $feedbackServiceRequestRequestRating
      requestReview: $feedbackServiceRequestRequestReview
    ) {
      state
      requestRating
      requestReview
    }
  }
`;

const CUSTOMER_FEEDBACK_SR = gql`
  mutation CustomerfeedbackServiceRequestMutation(
    $customerfeedbackServiceRequestId: ID
    $customerfeedbackServiceRequestCustomerRating: Int
    $customerfeedbackServiceRequestCustomerReview: String
  ) {
    customerfeedbackServiceRequest(
      id: $customerfeedbackServiceRequestId
      customerRating: $customerfeedbackServiceRequestCustomerRating
      customerReview: $customerfeedbackServiceRequestCustomerReview
    ) {
      state
    }
  }
`;
const GET_ME_USER_BY_ID_SR_DETAILS = gql`
  query GetServiceRequestDetails($getServiceRequestByIdId: ID!) {
    getServiceRequestByID(id: $getServiceRequestByIdId) {
      requester_id
      provider_id
      date
      time
      payMethod
      task
      min_price
      max_price
      state
      estimate
      location
      requestReview
      requestRating
      toDatePayment
      customerReview
      customerRating
    }
    me {
      id
      username
      email
      city
    }
  }
`;
const GET_USER_BY_ID = gql`
  query Query($getUserbyIdId: ID!) {
    getUserbyId(id: $getUserbyIdId) {
      username
      contactNum
      address
    }
  }
`;
const RequestScreen = ({ navigation, route }) => {
  const toast = useToast();

  const [formData, setData] = React.useState({});

  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = React.useState(false);
  const [datepick, setDatepick] = React.useState(new Date());
  const [time, setTime] = React.useState('');

  let [payment, setPayment] = React.useState('');
  const id = navigation.getParam('id');
  const [values, setValues] = React.useState();
  const [status, setStatus] = React.useState();
  const [rating, setRating] = React.useState();
  const [task, setTask] = React.useState();
  const [view, setView] = React.useState({ renderView: 0 });

  const now = new Date();
  now.setMinutes(now.getMinutes() + 25);
  console.log(now);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const { data, loading, error, refetch, networkStatus } = useQuery(
    GET_ME_USER_BY_ID_SR_DETAILS,
    {
      variables: {
        getServiceRequestByIdId: `${id}`,
      },
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    }
  );

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [cancelServiceRequest, { loading_cancel, error_cancel }] = useMutation(
    CANCEL_SR,
    {
      onCompleted: (data) => {
        toast.show('Successfully canceled request', {
          type: 'success',
          animationType: 'slide-in',
        });
        setCancel('Canceled');
        refetch();
      },
      onError: (error) => {
        console.log(error);
        toast.show('Failed ', { type: 'danger', animationType: 'slide-in' });
      },
    }
  );

  const [startServiceRequest, { loading_start, error_start }] = useMutation(
    START_SR,
    {
      onCompleted: (data) => {
        toast.show('Successfully started the request', {
          type: 'success',
          animationType: 'slide-in',
        });
      },
      onError: (error) => {
        console.log(error);
        toast.show('Failed ', { type: 'danger', animationType: 'slide-in' });
      },
    }
  );

  const [rescheduleServiceRequest, { loading_reschedule, error_reschedule }] =
    useMutation(RESCHEDULE_SR, {
      onCompleted: (data) => {
        toast.show('Successfully rescheduled the request', {
          type: 'success',
          animationType: 'slide-in',
        });
      },
      onError: (error) => {
        console.log(error);
        toast.show('Failed ', { type: 'success', animationType: 'slide-in' });
      },
    });

  const [editServiceRequest, { loading_edit, error_edit }] = useMutation(
    EDIT_SR,
    {
      onCompleted: (data) => {
        toast.show('Successfully edited the request', {
          type: 'success',
          animationType: 'slide-in',
        });
      },
      onError: (error) => {
        console.log(error);
        toast.show('Failed ', { type: 'success', animationType: 'slide-in' });
      },
    }
  );

  const [completeServiceRequest, { loading_complete, error_complete }] =
    useMutation(COMPLETE_SR, {
      onCompleted: (data) => {
        toast.show('Successfully completed the request', {
          type: 'success',
          animationType: 'slide-in',
        });
      },
      onError: (error) => {
        console.log(error);
        toast.show('Failed ', { type: 'danger', animationType: 'slide-in' });
      },
    });

  if (networkStatus === NetworkStatus.refetch) return <Text>Refetching!</Text>;
  if (
    loading ||
    loading_cancel ||
    loading_start ||
    loading_complete ||
    loading_edit ||
    loading_reschedule
  )
    return <Text>Loading..</Text>;

  const data_serviceRequest = data;
  console.log(data_serviceRequest);
  const serviceReqDetails = data_serviceRequest.getServiceRequestByID;

  const provider_id = serviceReqDetails.provider_id;
  const requester_id = serviceReqDetails.requester_id;

  const date = new Date(serviceReqDetails.date + 'T' + serviceReqDetails.time);
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayName = days[date.getDay()];
  console.log(date.getDay());
  showDay = `${serviceReqDetails.date}, ${dayName}`;
  const myDetails = data_serviceRequest.me;

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const cancelRequest = (event) => {
    setValues({});
    cancelServiceRequest({
      variables: {
        cancelServiceRequestId: id,
      },
    });
    refetch();
  };

  const rejectRequest = (event) => {
    setValues({});
    rejectServiceRequest({
      variables: {
        rejectServiceRequestId: id,
      },
    });
    refetch();
  };

  const startRequest = (event) => {
    setValues({});
    startServiceRequest({
      variables: {
        startServiceRequestId: id,
      },
    });
    refetch();
  };

  const completeRequest = (event) => {
    setValues({});
    completeServiceRequest({
      variables: {
        completeServiceRequestId: id,
      },
    });
    refetch();
  };

  const acceptRequest = (event) => {
    setValues({});
    acceptServiceRequest({
      variables: {
        acceptServiceRequestId: id,
        acceptServiceRequestEstimate: values.acceptServiceRequestEstimate,
      },
    });
    refetch();
  };

  const ratingChanged = (newRating) => {
    setRating(newRating);
    console.log(newRating);
  };

  ///////////////////////////////////////////////////////////////
  const clickDetails = (event) => {
    setView({
      renderView: 0,
    });
  };
  const clickReschedule = (event) => {
    setView({
      renderView: 1,
    });
  };
  const clickEdit = (event) => {
    console.log('edit');
    setView({
      renderView: 2,
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (datepick) => {
    console.warn('A date has been picked: ', datepick);
    setDatepick(datepick);
    hideDatePicker();
  };

  const handleTimeConfirm = (time) => {
    console.warn('A time has been picked: ', time);
    setTime(time);
    hideTimePicker();
  };

  const onSubmit = () => {
    rescheduleServiceRequest({
      variables: {
        ...values,
        rescheduleServiceRequestId: id,
        rescheduleServiceRequestDate:
          datepick.getFullYear() +
          '-' +
          (datepick.getMonth() + 1 < 10 ? '0' : '') +
          parseInt(datepick.getMonth() + 1) +
          '-' +
          (datepick.getDate() < 10 ? '0' : '') +
          datepick.getDate(),
        rescheduleServiceRequestTime:
          (time.getHours() < 10 ? '0' : '') +
          time.getHours() +
          ':' +
          (time.getMinutes() < 10 ? '0' : '') +
          time.getMinutes(),
      },
    });
    console.log('done');
    refetch();
  };
  const onEditSubmit = () => {
    editServiceRequest({
      variables: {
        ...values,
        editServiceRequestId: id,
        editServiceRequestTask: task,
      },
    });
    console.log('done');
    refetch();
  };

  {
    switch (view.renderView) {
      case 0:
        return (
          <>
            <ScrollView
              contentContainerStyle={styles.stage}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {myDetails.id === requester_id ? (
                <>
                  <HStack>
                    <ScrollView
                      contentContainerStyle={styles.stage}
                      horizontal={true}
                    >
                      <Button onPress={clickDetails} style={styles.buttons}>
                        View Details
                      </Button>
                      <Button
                        onPress={clickReschedule}
                        style={styles.buttons}
                        isDisabled={
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            now.toISOString().substr(0, 16) ||
                          serviceReqDetails.state === 'Canceled' ||
                          serviceReqDetails.state === 'Rejected' ||
                          serviceReqDetails.state === 'Completed' ||
                          serviceReqDetails.state === 'Reviewed' ||
                          serviceReqDetails.state === 'Started'
                        }
                      >
                        Reschedule
                      </Button>
                      <Button
                        onPress={clickEdit}
                        style={styles.buttons}
                        isDisabled={
                          serviceReqDetails.state !== 'Pending' ||
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            new Date().toISOString().substr(0, 16)
                        }
                      >
                        Edit Task
                      </Button>

                      <Button
                        onPress={cancelRequest}
                        style={{
                          backgroundColor: '#f43f5e',
                          height: 40,
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                        isDisabled={
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            now.toISOString().substr(0, 16) ||
                          (serviceReqDetails.state !== 'Pending' &&
                            serviceReqDetails.state !== 'Accepted')
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        isDisabled={
                          serviceReqDetails.state === 'Pending' ||
                          serviceReqDetails.state === 'Canceled' ||
                          serviceReqDetails.state === 'Rejected'
                        }
                        style={{
                          backgroundColor: '#059669',
                          height: 40,
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                      >
                        Make Payment
                      </Button>
                    </ScrollView>
                  </HStack>
                </>
              ) : (
                <>
                  <HStack>
                    <ScrollView
                      contentContainerStyle={styles.stage}
                      horizontal={true}
                    >
                      <Button onPress={clickDetails} style={styles.buttons}>
                        View Details
                      </Button>
                      <Button
                        onPress={() => {
                          navigation.navigate('Accept', { id: id });
                        }}
                        style={styles.buttons}
                        isDisabled={serviceReqDetails.state !== 'Pending'}
                      >
                        Accept
                      </Button>

                      <Button
                        onPress={startRequest}
                        style={styles.buttons}
                        isDisabled={serviceReqDetails.state !== 'Accepted'}
                      >
                        Start
                      </Button>

                      <Button
                        onPress={rejectRequest}
                        style={{
                          backgroundColor: '#f43f5e',
                          height: 40,
                          width: '30%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                        isDisabled={
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            now.toISOString().substr(0, 16) ||
                          serviceReqDetails.state === 'Completed' ||
                          serviceReqDetails.state === 'Started' ||
                          serviceReqDetails.state === 'Reviewed'
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        onPress={completeRequest}
                        isDisabled={serviceReqDetails.state !== 'Started'}
                        style={{
                          backgroundColor: '#059669',
                          height: 40,
                          width: '30%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                      >
                        Mark Completed
                      </Button>
                    </ScrollView>
                  </HStack>
                </>
              )}

              {serviceReqDetails.state === 'Reviewed' ? (
                <>
                  <Rating
                    type="heart"
                    ratingCount={5}
                    imageSize={40}
                    showRating
                    readonly={true}
                    startingValue={serviceReqDetails.requestRating}
                    ratingBackgroundColor="#c8c7c8"
                  />
                  <Text
                    style={{
                      margin: 6,
                      fontSize: 20,
                      color: '#525252',
                      alignContent: 'center',
                      alignSelf: 'center',
                    }}
                  >
                    "{serviceReqDetails.requestReview}"
                  </Text>
                </>
              ) : (
                <></>
              )}

              <TableView
                appearance="light"
                style={{ backgroundColor: '#faf5ff' }}
              >
                <Section
                  style={{ backgroundColor: '#faf5ff' }}
                  header="REQUEST DETAILS"
                  footer="Rescheduling, canceling and rejecting a service request is allowed only 20 minuites before the scheduled time. After the aceptance of a request it cannot be edited"
                >
                  <Cell
                    cellStyle="RightDetail"
                    title="Selected Provider Profile"
                    detail=""
                    accessory="DisclosureIndicator"
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="Service Requester"
                    detail=""
                    accessory="DisclosureIndicator"
                  ></Cell>

                  <Cell
                    cellStyle="RightDetail"
                    title="Service Date"
                    detail={showDay}
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="Service Time"
                    detail={`${serviceReqDetails.time} H`}
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="Service Location"
                    detail={serviceReqDetails.location}
                  />

                  <Cell cellStyle="Subtitle" title="Description of Task">
                    <Text
                      style={{
                        marginLeft: 10,
                        marginBottom: 10,
                        fontSize: 16,
                        color: '#525252',
                      }}
                    >
                      {serviceReqDetails.task}
                    </Text>
                  </Cell>
                  <Cell
                    cellStyle="RightDetail"
                    title="Agreed Price Range"
                    detail={`${serviceReqDetails.min_price}- ${serviceReqDetails.max_price} LKR`}
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="Service Provider Estimate"
                    detail={
                      serviceReqDetails.estimate
                        ? `${serviceReqDetails.estimate} LKR`
                        : 'Not Available Yet'
                    }
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="Total Amount Paid to date"
                    detail={
                      serviceReqDetails.toDatePayment
                        ? `${serviceReqDetails.toDatePayment} LKR`
                        : 'No Payments Yet'
                    }
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="Status of Request"
                    detail={serviceReqDetails.state}
                  />
                </Section>
              </TableView>

              {serviceReqDetails.state === 'Completed' &&
              myDetails.id === requester_id &&
              status !== 'Reviewed' ? (
                <>
                  <TouchableOpacity
                    key={id}
                    style={{
                      height: 40,
                      width: '43%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#fcd34d',
                      borderRadius: 8,
                      margin: 4,
                      padding: 8,
                      alignSelf: 'center',
                    }}
                    onPress={() => {
                      navigation.navigate('RequesterReview', { id: id });
                      console.log(id);
                    }}
                  >
                    <Text style={{ color: 'white' }}>Add Review</Text>
                  </TouchableOpacity>
               
                </>
              ) : (
                <></>
              )}

              {myDetails.id === provider_id &&
              !serviceReqDetails.customerReview ? (
                <>
                  <TouchableOpacity
                    key={id}
                    style={{
                      height: 40,
                      width: '49%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#fcd34d',
                      borderRadius: 8,
                      margin: 4,
                      padding: 8,
                      alignSelf: 'center',
                    }}
                    onPress={() => {
                      navigation.navigate('ProviderReview', { id: id });
                      console.log(id);
                    }}
                  >
                    <Text style={{ color: 'white' }}>
                      Add Review to customer
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {serviceReqDetails.customerReview ? (
                    <>
                      <Text
                        style={{
                          margin: 6,
                          fontSize: 16,
                          color: '#525252',
                          alignContent: 'center',
                          alignSelf: 'center',
                        }}
                      >
                        Review of the customer
                      </Text>
                      <Rating
                        type="heart"
                        ratingCount={5}
                        imageSize={20}
                        showRating
                        readonly={true}
                        startingValue={serviceReqDetails.customerRating}
                        ratingBackgroundColor="#c8c7c8"
                      />
                      <Text
                        style={{
                          margin: 6,
                          fontSize: 20,
                          color: '#525252',
                          alignContent: 'center',
                          alignSelf: 'center',
                        }}
                      >
                        "{serviceReqDetails.customerReview}"
                      </Text>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </ScrollView>
          </>
        );

      case 1:
        return (
          <>
            <ScrollView contentContainerStyle={styles.stage}>
              {myDetails.id === requester_id ? (
                <>
                  <HStack>
                    <ScrollView
                      contentContainerStyle={styles.stage}
                      horizontal={true}
                    >
                      <Button onPress={clickDetails} style={styles.buttons}>
                        View Details
                      </Button>
                      <Button
                        onPress={clickReschedule}
                        style={styles.buttons}
                        isDisabled={
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            now.toISOString().substr(0, 16) ||
                          serviceReqDetails.state === 'Canceled' ||
                          serviceReqDetails.state === 'Rejected' ||
                          serviceReqDetails.state === 'Completed' ||
                          serviceReqDetails.state === 'Reviewed' ||
                          serviceReqDetails.state === 'Started'
                        }
                      >
                        Reschedule
                      </Button>
                      <Button
                        onPress={clickEdit}
                        style={styles.buttons}
                        isDisabled={
                          serviceReqDetails.state !== 'Pending' ||
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            new Date().toISOString().substr(0, 16)
                        }
                      >
                        Edit Task
                      </Button>

                      <Button
                        onPress={cancelRequest}
                        style={{
                          backgroundColor: '#f43f5e',
                          height: 40,
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                        isDisabled={
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            now.toISOString().substr(0, 16) ||
                          (serviceReqDetails.state !== 'Pending' &&
                            serviceReqDetails.state !== 'Accepted')
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        isDisabled={
                          serviceReqDetails.state === 'Pending' ||
                          serviceReqDetails.state === 'Canceled' ||
                          serviceReqDetails.state === 'Rejected'
                        }
                        style={{
                          backgroundColor: '#059669',
                          height: 40,
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                      >
                        Make Payment
                      </Button>
                    </ScrollView>
                  </HStack>
                </>
              ) : (
                <>
                  <HStack>
                    <ScrollView
                      contentContainerStyle={styles.stage}
                      horizontal={true}
                    >
                      <Button onPress={clickDetails} style={styles.buttons}>
                        View Details
                      </Button>

                      <Button
                        onPress={startRequest}
                        style={styles.buttons}
                        isDisabled={serviceReqDetails.state !== 'Accepted'}
                      >
                        Start
                      </Button>

                      <Button
                        onPress={rejectRequest}
                        style={{
                          backgroundColor: '#f43f5e',
                          height: 40,
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                        isDisabled={
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            now.toISOString().substr(0, 16) ||
                          serviceReqDetails.state === 'Completed' ||
                          serviceReqDetails.state === 'Started' ||
                          serviceReqDetails.state === 'Reviewed'
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        onPress={completeRequest}
                        isDisabled={serviceReqDetails.state !== 'Started'}
                        style={{
                          backgroundColor: '#059669',
                          height: 40,
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                      >
                        Mark Completed
                      </Button>
                    </ScrollView>
                  </HStack>
                </>
              )}
              <ScrollView
                style={{
                  backgroundColor: 'white',
                  width: '98%',
                  borderWidth: 1,
                  borderColor: '#0369a1',
                }}
              ></ScrollView>

              <Text
                style={{
                  color: '#525252',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginTop: 10,
                  marginBottom: 14,
                  marginLeft: 12,
                }}
              >
                Reschedule Request
              </Text>
              <VStack width="90%" mx="3">
                <FormControl isRequired>
                  <FormControl.Label _text={{ bold: true }}>
                    New Date to reschedule
                  </FormControl.Label>
                  <Input
                    disabled
                    value={
                      datepick
                        ? datepick.getDate() +
                          '-' +
                          months[datepick.getMonth()] +
                          '-' +
                          datepick.getFullYear()
                        : ''
                    }
                  />
                  <Button
                    title={'Select a Date'}
                    onPress={showDatePicker}
                    style={styles.pickers}
                  >
                    Select a Date
                  </Button>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    name={'rescheduleServiceRequestDate'}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormControl.Label _text={{ bold: true }}>
                    New Time to Reschedule
                  </FormControl.Label>

                  <Input
                    disabled
                    value={
                      time !== ''
                        ? (time.getHours() < 10 ? '0' : '') +
                          time.getHours() +
                          ':' +
                          (time.getMinutes() < 10 ? '0' : '') +
                          time.getMinutes()
                        : ''
                    }
                  />

                  <Button
                    title="Select a Time"
                    onPress={showTimePicker}
                    style={styles.pickers}
                  />
                  <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    name={'rescheduleServiceRequestTime'}
                    onConfirm={handleTimeConfirm}
                    onCancel={hideTimePicker}
                  />
                </FormControl>

                <Button2 onPress={onSubmit} mt="5" colorScheme="cyan">
                  Submit
                </Button2>
              </VStack>
            </ScrollView>
          </>
        );

      case 2:
        return (
          <>
            <ScrollView contentContainerStyle={styles.stage}>
              {myDetails.id === requester_id ? (
                <>
                  <HStack>
                    <ScrollView
                      contentContainerStyle={styles.stage}
                      horizontal={true}
                    >
                      <Button onPress={clickDetails} style={styles.buttons}>
                        View Details
                      </Button>
                      <Button
                        onPress={clickReschedule}
                        style={styles.buttons}
                        isDisabled={
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            now.toISOString().substr(0, 16) ||
                          serviceReqDetails.state === 'Canceled' ||
                          serviceReqDetails.state === 'Rejected' ||
                          serviceReqDetails.state === 'Completed' ||
                          serviceReqDetails.state === 'Reviewed' ||
                          serviceReqDetails.state === 'Started'
                        }
                      >
                        Reschedule
                      </Button>
                      <Button
                        onPress={clickEdit}
                        style={styles.buttons}
                        isDisabled={
                          serviceReqDetails.state !== 'Pending' ||
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            new Date().toISOString().substr(0, 16)
                        }
                      >
                        Edit Task
                      </Button>

                      <Button
                        onPress={cancelRequest}
                        style={{
                          backgroundColor: '#f43f5e',
                          height: 40,
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                        isDisabled={
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            now.toISOString().substr(0, 16) ||
                          (serviceReqDetails.state !== 'Pending' &&
                            serviceReqDetails.state !== 'Accepted')
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        isDisabled={
                          serviceReqDetails.state === 'Pending' ||
                          serviceReqDetails.state === 'Canceled' ||
                          serviceReqDetails.state === 'Rejected'
                        }
                        style={{
                          backgroundColor: '#059669',
                          height: 40,
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                      >
                        Make Payment
                      </Button>
                    </ScrollView>
                  </HStack>
                </>
              ) : (
                <>
                  <HStack>
                    <ScrollView
                      contentContainerStyle={styles.stage}
                      horizontal={true}
                    >
                      <Button onPress={clickDetails} style={styles.buttons}>
                        View Details
                      </Button>

                      <Button
                        onPress={startRequest}
                        style={styles.buttons}
                        isDisabled={serviceReqDetails.state !== 'Accepted'}
                      >
                        Start
                      </Button>

                      <Button
                        onPress={rejectRequest}
                        style={{
                          backgroundColor: '#f43f5e',
                          height: 40,
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                        isDisabled={
                          serviceReqDetails.date +
                            'T' +
                            serviceReqDetails.time <
                            now.toISOString().substr(0, 16) ||
                          serviceReqDetails.state === 'Completed' ||
                          serviceReqDetails.state === 'Started' ||
                          serviceReqDetails.state === 'Reviewed'
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        onPress={completeRequest}
                        isDisabled={serviceReqDetails.state !== 'Started'}
                        style={{
                          backgroundColor: '#059669',
                          height: 40,
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',

                          borderRadius: 8,
                          margin: 4,
                          padding: 8,
                        }}
                      >
                        Mark Completed
                      </Button>
                    </ScrollView>
                  </HStack>
                </>
              )}
              <ScrollView
                style={{
                  backgroundColor: 'white',
                  width: '98%',
                  borderWidth: 1,
                  borderColor: '#0369a1',
                }}
              ></ScrollView>

              <Text
                style={{
                  color: '#525252',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginTop: 10,
                  marginBottom: 14,
                  marginLeft: 12,
                }}
              >
                Edit Request
              </Text>
              <VStack width="90%" mx="3">
                <FormControl isRequired>
                  <FormControl.Label
                    _text={{ bold: true }}
                    style={{ marginTop: 10 }}
                  >
                    Job Description
                  </FormControl.Label>
                  <TextArea
                    placeholder="Explain what you need to get done"
                    name={'editServiceRequestTask'}
                    onChangeText={(value) => {
                      setData({ ...formData, max: value });
                      setTask(value);
                    }}
                  />
                </FormControl>

                <Button2 onPress={onEditSubmit} mt="5" colorScheme="cyan">
                  Submit
                </Button2>
              </VStack>
            </ScrollView>
          </>
        );
    }
  }
};
const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#faf5ff',
    paddingTop: 20,
    paddingBottom: 20,
  },
  buttons: {
    height: 40,
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06b6d4',
    borderRadius: 8,
    margin: 4,
    padding: 8,
  },
  pickers: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 1,
    height: '20%',
    color: 'blue',
  },
});

RequestScreen.navigationOptions = {
  title: 'Request',
};
export default RequestScreen;
