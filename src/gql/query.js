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
const GET_SERVICE_PROVIDER_BY_PROFESSION = gql`
  query SearchServiceProviderByProfession(
    $searchServiceProviderbyProfessionProfession: String!
  ) {
    searchServiceProviderbyProfession(
      profession: $searchServiceProviderbyProfessionProfession
    ) {
      id
      username
      fullname
      profession
      city
      bio
      service_providing_status
      roles
      postalCode
      provider_rating
      provider_review_count
    }
  
  }
`;

const GET_PROVIDERS_BY_PROFESSION_IN_PROVINCE=gql`
query Query($searchServiceProviderbyProfessioninProvinceProfession: String!, $searchServiceProviderbyProfessioninProvinceProvince: String!) {
  searchServiceProviderbyProfessioninProvince(profession: $searchServiceProviderbyProfessioninProvinceProfession, province: $searchServiceProviderbyProfessioninProvinceProvince) {
    id
    username
    fullname
    postalCode
    city
    province
    bio
    service_providing_status
    roles
    profession
    provider_rating
    provider_review_count
  
  }
}
`;

const GET_ALL_SERVICE_PROVIDERS = gql`
  query ViewAllServiceProviders{
  viewAllServiceProviders {
    id
    username
    profession
    email
    contactNum
    city
    bio
    service_providing_status
    roles
    postalCode
  }
}
`;

const GET_ACCEPTED_SERVICE_REQUESTS_OF_ME=gql`
query AcceptedServiceRequestsbyMe{
  acceptedServiceRequestsbyMe {
    id
    date
    time
    payMethod
    task
    min_price
    max_price
    id
    provider_id
    requester_id
  }
}
`;

const GET_PENDING_SERVICE_REQUESTS_OF_ME=gql`
query PendingServiceRequests{
  
  pendingServiceRequestsbyMe {
    id
    date
    time
    payMethod
    task
    min_price
    max_price
    provider_id
    requester_id
  }
}

`;

const GET_PENDING_SERVICE_REQUESTS_FOR_ME=gql`
query MyPendingServiceRequests{
  pendingServiceRequestsForMe {
    id
    date
    time
    payMethod
    task
    min_price
    max_price
    provider_id
    requester_id
  }
}
`;

const GET_ACCEPTED_SERVICE_REQUESTS_FOR_ME=gql`
query MyPendingServiceRequests{
  acceptedServiceRequestsForMe {
    id
    date
    time
    payMethod
    task
    min_price
    max_price
    provider_id
    requester_id
  }
}
`;

const GET_STARTED_SERVICE_REQUESTS_OF_ME=gql`
query StartedServiceRequests{
  
  startedServiceRequestsbyMe {
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
  }
}

`;

const GET_STARTED_SERVICE_REQUESTS_FOR_ME=gql`
query MyStartedServiceRequests{
  startedServiceRequestsForMe {
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
  }
}
`;

const GET_COMPLETED_SERVICE_REQUESTS_OF_ME=gql`
query CompletedServiceRequests{
  
  completedServiceRequestsbyMe {
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
  }
}

`;

const GET_COMPLETED_SERVICE_REQUESTS_FOR_ME=gql`
query MyCompletedServiceRequests{
  completedServiceRequestsForMe {
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
  }
}
`;

const GET_REVIEWED_SERVICE_REQUESTS_OF_ME=gql`
query ReviewedServiceRequests{
  
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
  }
}

`;

const GET_REVIEWED_SERVICE_REQUESTS_FOR_ME=gql`
query MyReviewedServiceRequests{
  reviewedServiceRequestsForMe {
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
  }
}
`;


const GET_ALL_SERVICE_TYPES=gql`
query Query {
  viewAllServiceTypes {
    id
    service_name
    description
    user_type
    image
  }
  
}
`;

const GET_ME_AS_SERVICE_PROVIDER = gql`
    query Query {
        me {
            username
            email
            nic
            profession
            province
            city
            town
            bio
            service_providing_status
            profile_state
            roles
        }
    }
`;

const GET_JOB_POSTING_FEED = gql`
  query Query(
    $jobPostingFeedProvince: String!
    $jobPostingFeedCity: String!
    $jobPostingFeedTown: String!
    $jobPostingFeedCategory: String!
    $jobPostingFeedCursor: String
  ) {
    jobPostingFeed(
      province: $jobPostingFeedProvince
      city: $jobPostingFeedCity
      town: $jobPostingFeedTown
      category: $jobPostingFeedCategory
      cursor: $jobPostingFeedCursor
    ) {
      jobPostings {
        id
        postedBy {
          username
        }
        heading
        description
        budgetRange {
          lowerLimit
          upperLimit
        }
        location {
          city
          town
        }
      }
      cursor
      hasNextPage
    }
  }
`;

const GET_JOB_POSTING = gql`
    query Query($jobPostingId: ID!) {
        jobPosting(id: $jobPostingId) {
            id
            heading
            location {
                province
                city
                town
            }
            category
            skills
            postedBy {
                id
                username
                email
                nic
            }
            description
            budgetRange {
                lowerLimit
                upperLimit
            }
        }
    }
`;


export {GET_ME,GET_ALL_SERVICE_PROVIDERS,
    GET_ALL_SERVICE_TYPES,GET_ME_AS_SERVICE_PROVIDER,GET_JOB_POSTING_FEED,GET_JOB_POSTING
    }