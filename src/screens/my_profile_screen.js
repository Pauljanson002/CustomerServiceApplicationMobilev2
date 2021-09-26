import React from "react";
import {View} from "react-native";
import * as SecureStore from "expo-secure-store";
import {useQuery} from "@apollo/client";
import {GET_ME} from "../gql/query";
import {Center, Container, Heading, Text, Avatar, VStack, HStack, Spacer,Button} from "native-base";
import Box from "native-base/src/components/primitives/Box/index";
import Stack from "native-base/src/components/primitives/Stack/Stack";


const MyProfileScreen = (props)=>{
    const signOut = () => {
        SecureStore.deleteItemAsync('token').then(
            props.navigation.navigate('Auth')
        );
    };
    const meQuery = useQuery(GET_ME)
    if(meQuery.loading) return <Text>Loading</Text>
    if(meQuery.error) return <Text>Error</Text>
    return(
        <Box>
            <Center>
                <Stack mt={5} space={3}>
                    <Center>
                        <VStack space={3}>
                            <Heading textAlign={"center"}>{meQuery.data.me.fullname}</Heading>
                            <Heading>@{meQuery.data.me.username}</Heading>
                            <Center>
                                <Avatar>{meQuery.data.me.fullname[0]}</Avatar>
                            </Center>
                        </VStack>
                    </Center>
                    <HStack alignItems={"center"} space={5} mt={5}>
                        <Text fontWeight={"bold"}>Address</Text>
                        <Spacer/>
                        <Text>{meQuery.data.me.address}</Text>
                    </HStack>
                    <HStack alignItems={"center"} space={5} mt={5}>
                        <Text fontWeight={"bold"}>Email</Text>
                        <Spacer/>
                        <Text>{meQuery.data.me.email}</Text>
                    </HStack>
                    <HStack alignItems={"center"} space={5} mt={5}>
                        <Text fontWeight={"bold"} >City</Text>
                        <Spacer/>
                        <Text>{meQuery.data.me.city}</Text>
                    </HStack>
                    <HStack alignItems={"center"} space={5} mt={5}>
                        <Text fontWeight={"bold"}>Town</Text>
                        <Spacer/>
                        <Text>{meQuery.data.me.town}</Text>
                    </HStack>
                    <HStack alignItems={"center"} space={5} mt={5}>
                        <Text fontWeight={"bold"}>Province</Text>
                        <Spacer/>
                        <Text>{meQuery.data.me.province}</Text>
                    </HStack>
                    <HStack alignItems={"center"} space={5} mt={5}>
                        <Text fontWeight={"bold"}>Bio</Text>
                        <Spacer/>
                        <Text>{meQuery.data.me.bio}</Text>
                    </HStack>
                    <Button onPress={signOut}>Sign Out</Button>
                </Stack>
            </Center>
            <Container>

            </Container>
        </Box>


    )
}

export default MyProfileScreen