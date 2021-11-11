import React,{useEffect} from "react";


import Loading from '../../components/Loading';
import {useQuery} from "@apollo/client";
import {GET_ME_AS_SERVICE_REQUESTER} from "../../gql/query";


const ServiceReqAuth = props => {

    const serviceReqrQuery = useQuery(GET_ME_AS_SERVICE_REQUESTER)
    if(serviceReqrQuery.loading) return <Loading />;
    else{
        if(serviceReqrQuery.data.me.roles.includes("service_requester")){
            props.navigation.navigate("ServiceProviderStack")
        }else{
            props.navigation.navigate("ServiceProviderReject")
        }
    }
    return <Loading/>
};

export default ServiceReqAuth