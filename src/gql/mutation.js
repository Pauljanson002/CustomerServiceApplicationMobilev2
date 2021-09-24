import {gql} from "@apollo/client";

const SIGNIN_USER = gql`
    mutation Mutation($signInEmail: String!, $signInPassword: String!) {
        signIn(email: $signInEmail, password: $signInPassword)
    }
`;


export  {SIGNIN_USER}