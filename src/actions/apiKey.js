//This File Contain All CRUDS Functions for api-key
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import { getSession } from "./session";

// create Api Key function 
 export async function createApiKey(name) {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/keys`,{
            method: "POST",
            headers:{
                "content-type" : "application/json",
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            },
            body:JSON.stringify({
                "key" : name,
                "isRevoked" : true
            })
        })

        const response = await request.json();
        if(!request.ok) {
            return {
                message : response.messages[0] || "can't create api-key!",
                isSuccess : false
            }
        }
        return {
            message : response.messages[0] || "api-key Created",
            isSuccess : true
        }
    }catch(err){
        console.error("Create Api Key",err);
        return {
            message: "can't create api-key check internet connection",
            isSuccess : false
        }
    }
}
//get All Api Key 
export async function getAllApiKeys() {
    const userAuth = await getSession();
    try{
    const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/keys?query.ShowAll=true`,{
        method: "GET",
        headers:{
            "X-API-KEY" : userAuth.clientKey,
            "X-USER-KEY" : userAuth.userKey
        }
    })
    const response = await request.json();
    if(!request.ok) {
        return {
            message : response.messages[0] || "Failed to get Api-Key's",
            isSuccess : false
        }
    }
    return {
        message : response.messages[0] || "Api-Key's Loaded Successful",
        data : response.data,
        isSuccess : true 
    }

}catch(err) {
    console.error(err);
    return {
        message : "Can't Load Api-Key's Check Your Internet Connection",
        isSuccess: false
    }
}
}
 // get Api Key By id (Uses in form when edit)
export async function getApiKeyById(apiKeyId) {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/keys/${apiKeyId}`,{
            method : "GET",
        headers:{
            "X-API-KEY" : userAuth.clientKey,
            "X-USER-KEY" : userAuth.userKey
        }
    })
    const response = await request.json();
    if(!request.ok) {
        return {
            message : response.messages[0] || "Failed to get api-key",
            isSuccess : false
        }
    }
    return {
        message : response.messages[0] || "api-key Loaded Successful",
        data : response.data,
        isSuccess : true 
    }

}catch(err) {
    console.error(err);
    return {
        message : "Can't Load api-key Check Your Internet Connection",
        isSuccess: false
    }
}
}
// Edit Api Key
export async function editApiKey(id,key,isRevoked) {
    const userAuth = await getSession();
    try{
        const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/keys/${id}`,{
            method: "PUT",
            headers: {
                "content-type" : "application/json",
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            },
            body: JSON.stringify({
                id,
                key,
                isRevoked
            })
        })

        const response = await request.json();
        if(!request.ok) {
            return{
                message: response.messages[0] || "Can't Edit api-key",
                isSuccess: false 
            }
        }
        return {
            message : response.messages[0] || "api-key Edited !",
            isSuccess: true
        }
    }catch(err) {
        console.error(err);
        return{
            message: "Can't Edit api-key Check Your Internet Connection",
            isSuccess: false
        }
    }
}
//Delete Api Key
export async function deletApiKey(apiKeyId) {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/keys/${{apiKeyId}}`,{
            method:"DELETE",
            headers: {
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            }
        })
        const response = await request.json();
        if(!request.ok) {
            return{
            message: response.messages[0] || "Failed To Delete Api Key, Try Again",
            isSuccess:false
            }
        }
        return{
            message: response.messages[0] || "Api Key Deleted!",
            isSuccess: true
        }
    }catch(err) {
        console.error(err);
        return{
            message: "Can't Delete Api Key Check Your Internet Connection",
            isSuccess: false
        }
    }
}
//restore deleted Api Key
export async function restoreApiKey(apiKeyId) {
    const userAuth = await getSession();
    try{
        const request = await fetch(`${process.env.API_URL}/api/v1/clients/${userAuth.clientId}/keys/${apiKeyId}/restore`, {
            method:"PUT",
            headers: {
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            }
        })
        const response = await request.json();
        if(!request.ok) {
            return{
            message: response.messages[0] || "Can't Restore api-key Try Again!",
            isSuccess:false
            }
        }
        return {
            message:response.messages[0] || "Restored Successeful",
            isSuccess: true
        }
    }catch(err) {
        console.error(err);
        return{
        message : "Can't restore api-key Check You Internet Connection",
        isSuccess:false
        }
    }
}
