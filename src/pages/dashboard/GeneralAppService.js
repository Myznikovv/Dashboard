
import useFetchHook from "../../hooks/useFetchHook";

const UseTableDataService = () => {

    const {getRequest, postRequest, error, clearError} = useFetchHook();

    const _baseUrl = "https://ideav.online/api/magnet";

    const getData = async () =>{
        const res = await getRequest(`${_baseUrl}report/42928`);
        return res;
    }


    const Authorise = async () => {
        const res = await postRequest(`${_baseUrl}/auth`, { "login": "guest", "pwd": "magnetx" }, 
            { headers: { 
                'Content-Type': 'application/x-www-form-urlencoded' 
            } })
            return res
    }

    
    return {getData, Authorise, error, clearError};
};

export default UseTableDataService;