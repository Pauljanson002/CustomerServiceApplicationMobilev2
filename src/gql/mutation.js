import {gql} from "@apollo/client";

const SIGNIN_USER = gql`
    mutation Mutation($signInEmail: String!, $signInPassword: String!) {
        signIn(email: $signInEmail, password: $signInPassword)
    }
`;

const ADD_JOB_BID = gql`
    mutation CreateJobBidMutation(
        $createJobBidProposedAmount: Float!
        $createJobBidProposedDate: String!
        $createJobBidJobPosting: ID!
        $createJobBidDetailedBreakdown: String
    ) {
        createJobBid(
            proposedAmount: $createJobBidProposedAmount
            proposedDate: $createJobBidProposedDate
            jobPosting: $createJobBidJobPosting
            detailedBreakdown: $createJobBidDetailedBreakdown
        ) {
            proposedAmount
        }
    }
`;
export  {SIGNIN_USER,ADD_JOB_BID}