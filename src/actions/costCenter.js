"use server"

//This File Contain All CRUDS Functions for Cost-Center
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import { getSession } from "./session";
// create cost center function 
 export async function createCostCenter(name) {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/CostCenters`,{
            method: "POST",
            headers:{
                "content-type" : "application/json",
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            },
            body:JSON.stringify({
                "clientId" : `${userAuth.clientId}`,
                "name" : name,
                "isActive" : true
            })
        })

        const response = await request.json();
        if(!request.ok) {
            return {
                message : response.messages[0],
                isSuccess : false
            }
        }
        return {
            message : response.messages[0],
            isSuccess : true
        }
    }catch(err){
        console.error("Create Cost Center Error",err);
        return {
            message: "can't create cost center check internet connection",
            isSuccess : false
        }
    }
}
//get All Cost Center 
export async function getAllCostCenter(showAll,pageNumber,pageSize) {
    const userAuth = await getSession();
    const params = new URLSearchParams({
        "query.ShowAll" : showAll,
        "query.pageNumber" : pageNumber  ,
        "query.pageSize" : pageSize,
        "query.Fields" : "id,name"
    });
    try{
    const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/CostCenters?${params.toString()}`,{
        method: "GET",
        headers:{
            "X-API-KEY" : userAuth.clientKey,
            "X-USER-KEY" : userAuth.userKey
        }
    })
    const response = await request.json();
    if(!request.ok) {
        return {
            message : response.messages[0] || "Failed to get cost-center",
            isSuccess : false
        }
    }
    return {
        message : response.messages[0] || "Cost Centers Loaded Successful",
        data : response.data,
        isSuccess : true 
    }

}catch(err) {
    console.error(err);
    return {
        message : "Can't Load Cost Center's Check Your Internet Connection",
        isSuccess: false
    }
}
}
 // get Cost Center By id (Uses in form when edit)
export async function getCostCenterById(costCenterId) {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/CostCenters/${costCenterId}`,{
            method : "GET",
        headers:{
            "X-API-KEY" : userAuth.clientKey,
            "X-USER-KEY" : userAuth.userKey
        }
    })
    const response = await request.json();
    if(!request.ok) {
        return {
            message : response.messages[0] || "Failed to get cost-center",
            isSuccess : false
        }
    }
    return {
        message : response.messages[0] || "Cost Center Loaded Successful",
        data : response.data,
        isSuccess : true 
    }

}catch(err) {
    console.error(err);
    return {
        message : "Can't Load Cost Center Check Your Internet Connection",
        isSuccess: false
    }
}
}
// Edit Cost Center
export async function editCostCenter(costCenterId,name) {
    const userAuth = await getSession();
    try{
        const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/CostCenters/${costCenterId}`,{
            method: "PUT",
            headers: {
                "content-type" : "application/json",
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            },
            body: JSON.stringify({
                id:costCenterId,
                name: name,
                isActive: true
            })
        })

        const response = await request.json();
        if(!request.ok) {
            return{
                message: response.messages[0] || "Can't Edit Cost Center",
                isSuccess: false 
            }
        }
        return {
            message : response.messages[0] || "Cost Center Edited !",
            isSuccess: true
        }
    }catch(err) {
        console.error(err);
        return{
            message: "Can't Edit Cost Center Check Your Internet Connection",
            isSuccess: false
        }
    }
}
//Delete Cost Center
export async function deletCostCenter(costCenterId) {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/CostCenters/${costCenterId}`,{
            method:"DELETE",
            headers: {
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            }
        })
        const response = await request.json();
        if(!request.ok) {
            return{
            message: response.messages[0] || "Failed To Delete Cost Center, Try Again",
            isSuccess:false
            }
        }
        return{
            message: response.messages[0] || "Cost Center Deleted!",
            isSuccess: true
        }
    }catch(err) {
        console.error(err);
        return{
            message: "Can't Delete Cost Center Check Your Internet Connection",
            isSuccess: false
        }
    }
}
//restore deleted cost center 
export async function restoreCostCenter(costCenterId) {
    const userAuth = await getSession();
    try{
        const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/CostCenters/${costCenterId}/restore`, {
            method:"PUT",
            headers: {
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            }
        })
        const response = await request.json();
        if(!request.ok) {
            return{
            message: response.messages[0] || "Can't Restore Cost Center Try Again!",
            isSuccess:false
            }
        }
        return {
            message:response.messages[0] || "Resored Successeful",
            isSuccess: true
        }
    }catch(err) {
        console.error(err);
        return{
        message : "Can't restore Cost Center Check You Internet Connection",
        isSuccess:false
        }
    }
}

