import {useCallback, useState} from "react";
import axios from "axios";

const UseFetchHook = () => {

    const [error, setError] = useState('');

    const getRequest = useCallback(async (url, headers) => {
        try {
            const response = await axios.get(url, headers);
            if (response.statusText !== "OK") {
                throw new Error(`Couldn't fetch ${url}, status : ${response.status} `)
            }
            return response.data;
        } catch (e) {
            setError("Error message");
            throw e;
        }
    }, [])

    const postRequest = useCallback(async (url, data ,  headers) => {
        try {
            const response = await axios.post(url, data, headers );
            if (response.statusText !== "OK") {
                throw new Error(`Couldn't fetch ${url}, status : ${response.status} `)
            }
            return response.data;
        } catch (e) {
            setError("Error message");
            throw e;
        }
    }, [])


    const clearError = useCallback(()=>{
        setError("")
    }, [])

    return {getRequest, postRequest, error, clearError}
};

export default UseFetchHook;