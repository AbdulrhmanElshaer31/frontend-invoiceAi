//This File Contain All CRUDS Functions for expense-Type
import { getSession } from "./session";
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
//Create Expense Type
export async function createExpenseType(costCenterId, name) {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/cost-centers/${costCenterId}/expense-types`,{
            method:"POST",
            headers: {
                "content-type" : "application/json",
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            },
            body:JSON.stringify({
                "costCenterId" : costCenterId,
                "name" : name
            })
        })
        const response = await request.json();
        if(!request.ok) {
            return{message:response.messages[0] || "Failed To Create Expens Type!",
            isSuccess:false}
        }
        return {
            message: response.messages[0] || "Expens-Type Created Successfuly",
            isSuccess : true
        }
    }catch(err) {
        console.error(err);
        return {
        message : "Can't Create Expense Type Check You Internet Connection",
        isSuccess:false
        }
    }
}
// Delete Expense Type
export async function deleteExpenseType(costCenterId,expenseTypeId) {
    const userAuth = await getSession();
    try  {
        const request = await fetch(`${process.env.API_URL}/api/v1/cost-centers/${costCenterId}/expense-types/${expenseTypeId}`,{
            method:"DELETE",
            headers: {
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            },

        })
    const response = await request.json();
        if(!request.ok) {
            return{message:response.messages[0] || "Failed To Delete Expens Type!",
            isSuccess:false}
        }
        return {
            message: response.messages[0] || "Expens-Type Deleted Successfuly",
            isSuccess : true
        }
    }catch(err) {
        console.error(err);
        return {
        message : "Can't Delete Expense Type Check You Internet Connection",
        isSuccess:false
        }
    }
}
// update expense type
export async function updateExpenseType(costCenterId, expenseTypeId,name) {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/cost-centers/${costCenterId}/expense-types/${expenseTypeId}`,{
            method:"PUT",
            headers: {
                "content-type" : "application/json",
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            },
            body:JSON.stringify({
                "id" : expenseTypeId,
                "costCenterId" : costCenterId,
                "name" : name
            })
        })
        const response = await request.json();
        if(!request.ok) {
            return{message:response.messages[0] || "Failed To Edit Expens Type!",
            isSuccess:false
        }
        }
        return {
            message: response.messages[0] || "Expens-Type Edited Successfuly",
            isSuccess : true
        }
    }catch(err) {
        console.error(err);
        return {
        message : "Can't Edit Expense Type Check You Internet Connection",
        isSuccess:false
        }
    }
}
// get all expense type's
export async function getAllExpenseTypes(showAll,pageNumber,pageSize,costCenterId) {
    const userAuth = await getSession();
    const params = new URLSearchParams({
        "query.ShowAll" : showAll,
        "query.pageNumber" : pageNumber  ,
        "query.pageSize" : pageSize,
        "query.Fields" : "id,name"
    });
    try{
    const request = await fetch(`${process.env.API_URL}/api/v1/cost-centers/${costCenterId}/expense-types?${params.toString()}`,{
        method: "GET",
        headers:{
            "X-API-KEY" : userAuth.clientKey,
            "X-USER-KEY" : userAuth.userKey
        }
    })
    const response = await request.json();
    if(!request.ok) {
        return {
            message : response.messages[0] || "Failed to get ExpenseTypes",
            isSuccess : false
        }
    }
    return {
        message : response.messages[0] || "ExpenseTypes Loaded Successful",
        data : response.data,
        isSuccess : true 
    }

}catch(err) {
    console.error(err);
    return {
        message : "Can't Load ExpenseTypes Check Your Internet Connection",
        isSuccess: false
    }
}
}
 // get expense type By id (Uses in form when edit)
export async function getExpenseTypeById(costCenterId,expenseTypeId) {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/cost-centers/${costCenterId}/expense-types/${expenseTypeId}`,{
            method : "GET",
        headers:{
            "X-API-KEY" : userAuth.clientKey,
            "X-USER-KEY" : userAuth.userKey
        }
    })
    const response = await request.json();
    if(!request.ok) {
        return {
            message : response.messages[0] || "Failed to get Expense-Type",
            isSuccess : false
        }
    }
    return {
        message : response.messages[0] || "Expense-Type Loaded Successful",
        data : response.data,
        isSuccess : true 
    }

}catch(err) {
    console.error(err);
    return {
        message : "Can't Load Expense-Type Check Your Internet Connection",
        isSuccess: false
    }
}
}
