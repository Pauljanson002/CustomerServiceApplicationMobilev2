import React from "react";
import {Box, Center, Heading, HStack, Stack, Text, VStack} from "native-base";
import {TouchableOpacity} from "react-native";

const MyTile = ({id,heading,subheading,center,footer}) =>{
   return(
       <Box
           rounded="lg"
           overflow="hidden"
           width="72"
           shadow={1}
           _light={{ backgroundColor: 'gray.50' }}
           _dark={{ backgroundColor: 'gray.700' }}
           mt={"10"}
       >
           <Stack p="4" space={3}>
               <Stack space={2}>
                   <Heading size="md" ml="-1">
                       {heading}
                   </Heading>
                   <Text
                       fontSize="xs"
                       _light={{ color: 'violet.500' }}
                       _dark={{ color: 'violet.300' }}
                       fontWeight="500"
                       ml="-0.5"
                       mt="-1"
                   >
                       {subheading}
                   </Text>
               </Stack>
               <Text fontWeight="400">
                   {center}
               </Text>
               <HStack alignItems="center" space={4} justifyContent="space-between">
                   <HStack alignItems="center">
                       <Text color="gray.500" fontWeight="400">
                           {footer}
                       </Text>
                   </HStack>
               </HStack>
           </Stack>
       </Box>
   )
}
export  default MyTile