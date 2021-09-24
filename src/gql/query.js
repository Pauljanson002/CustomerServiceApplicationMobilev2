import {gql} from "@apollo/client";

const GET_ME = gql`
    query Query {
        me {
            id
            username
            fullname
            email
            nic
            profession
            contactNum
            address
            province
            city
            town
            bio
            service_providing_status
            roles
        }
    }
`;

export {GET_ME}