import React,{useEffect} from "react";


import Loading from '../../components/Loading';
import {useQuery} from "@apollo/client";
import {GET_ME_AS_SERVICE_PROVIDER} from "../../gql/query";


const ServiceProviderAuth = props => {

    const serviceProviderQuery = useQuery(GET_ME_AS_SERVICE_PROVIDER)
    if(serviceProviderQuery.loading) return <Loading />;
    else{
        if(serviceProviderQuery.data.me.roles.includes("service_provider")){
            props.navigation.navigate("ServiceProviderStack")
        }else{
            props.navigation.navigate("ServiceProviderReject")
        }
    }
    return <Loading/>
};

export default ServiceProviderAuth