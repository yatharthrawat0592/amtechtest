import { Outlet, Navigate } from "react-router-dom";

const PrivateToutes = (props:any) => {
    console.log("Props_Check")

    let auth = localStorage.getItem("token") ? {'token':true} : {'token':false};

    return(
        auth.token ? <Outlet/>: <Navigate to ='/'/>
    )
}

export default PrivateToutes;