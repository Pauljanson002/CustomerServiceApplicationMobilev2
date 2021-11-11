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
const ADD_JOB_POSTING = gql`
    mutation Mutation(
        $createJobPostingHeading: String!
        $createJobPostingProvince: String!
        $createJobPostingCity: String!
        $createJobPostingTown: String!
        $createJobPostingCategory: String!
        $createJobPostingDescription: String!
        $createJobPostingLowerLimit: Float!
        $createJobPostingUpperLimit: Float!
    ) {
        createJobPosting(
            heading: $createJobPostingHeading
            province: $createJobPostingProvince
            city: $createJobPostingCity
            town: $createJobPostingTown
            category: $createJobPostingCategory
            description: $createJobPostingDescription
            lowerLimit: $createJobPostingLowerLimit
            upperLimit: $createJobPostingUpperLimit
        ) {
            id
            heading
            description
        }
    }
`;
const CHANGE_JOB_BID_STATE = gql`
    mutation ChangeStateJobBidMutation($jobBidId: ID!, $jobBidState: String!) {
        changeStateJobBid(jobBidId: $jobBidId, jobBidState: $jobBidState) {
            id
            state
        }
    }
`;
const ACCEPT_JOB_BID = gql`
    mutation Mutation(
        $acceptJobBidJobPostingId: ID!
        $acceptJobBidJobBidId: ID!
    ) {
        acceptJobBid(
            jobPostingId: $acceptJobBidJobPostingId
            jobBidId: $acceptJobBidJobBidId
        ) {
            id
        }
    }
`;
export  {SIGNIN_USER,ADD_JOB_BID,CHANGE_JOB_BID_STATE,ADD_JOB_POSTING,ACCEPT_JOB_BID}