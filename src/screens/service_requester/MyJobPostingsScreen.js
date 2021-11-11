import React from "react";
import {Box, Button, Center, Container, FlatList, ScrollView, Text} from "native-base";
import {useQuery} from "@apollo/client";
import {GET_MY_JOB_POSTINGS} from "../../gql/query";
import MyTile from "../../components/MyTile";
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import {useToast} from "react-native-toast-notifications";
import Loading from "../../components/Loading";
import {TouchableOpacity} from "react-native";
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')
const MyJobPostingsScreen = ({navigation})=> {
    const myJobPostingQuery = useQuery(GET_MY_JOB_POSTINGS, {
        variables: {
            getMyJobPostingsState: "open"
        }
    })
    const switchState = (state) => (event) => {
        event.preventDefault()
        myJobPostingQuery.refetch({
            getMyJobPostingsState: state
        }).then(data => {
            console.log(data)
        })
    }
    if (myJobPostingQuery.loading) return <Loading/>
    else {
        return (
            <ScrollView>
                <Center>
                    <Container mt={3}>
                        <Button.Group direction={"column"}>
                            <Button onPress={switchState("open")}>Open Jobs</Button>
                            <Button onPress={switchState("bid_selected")}>Bid selected Jobs</Button>
                            <Button onPress={switchState("closed")}>Closed Jobs</Button>
                            <Button onPress={switchState("completed")}>Completed</Button>
                        </Button.Group>
                    </Container>

                    {( myJobPostingQuery.data.getMyJobPostings.length > 0) ? (
                        <FlatList data={myJobPostingQuery.data.getMyJobPostings} renderItem={({item}) => {
                            return (
                                <TouchableOpacity onPress={(event) => {
                                    navigation.navigate("JobPostingBids", {
                                        id: item.id
                                    })
                                }} activeOpacity={0.2}>
                                    <MyTile
                                        heading={item.heading} subheading={item.category}
                                        center={"Budget : LKR " + item.budgetRange.lowerLimit + " - LKR " + item.budgetRange.upperLimit}
                                        footer={timeAgo.format(new Date(item.updatedAt))}
                                    />
                                </TouchableOpacity>)
                        }}/>
                    ) : (
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
                            <Text>Not available</Text>
                        </Box>
                    )}

                </Center>
            </ScrollView>
        )
    }

}
export default MyJobPostingsScreen