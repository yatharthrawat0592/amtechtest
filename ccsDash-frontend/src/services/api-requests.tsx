export const fetchDataFromAPI = async (apiQuery: any) => {

    const jwtToken = localStorage.getItem("token");
    
    const IpAddress = localStorage.getItem("IpAddress");
    const email = localStorage.getItem("email");

    const response = await fetch(process.env.REACT_APP_API_BASE_URL + apiQuery.api,
        {
            method: apiQuery.request.action,
            headers:{
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json',
                'x-username': `${email}`,
                'x-ip-address':`${IpAddress}`,
                'authorization': 'Bearer ' + jwtToken
            },
            //credentials: 'include',
            body: (apiQuery.request.data === '') ? null : JSON.stringify(apiQuery.request.data)
        });
 
    console.log(JSON.stringify(apiQuery.request.data));
    if(!response.ok){
        const errorData = await response.json();

        /* Check the error status code / message
         * and verify if we need to suppress or not
        */
       if ((errorData.statusNum === '3003')){
        /* do something */
        return errorData.msg;
       } else {
        //send notification to browser via notification service
        return errorData.msg;
       }
    }

    const data = await response.json();
    console.log("API Response data");
    console.log(data);
    return data;
}