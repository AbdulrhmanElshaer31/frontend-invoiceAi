"use server"

//This File Containes The CRUDS opreations for invoices
import { getSession } from "./session";
// upload invoice
export async function uploadInvoice(File,isPublic,CostCenterId,ExpenseTypeId,ProcessImmediately){
    const userAuth = getSession();
    const formData = new FormData();
    formData.append("File",File);
    formData.append("CostCenterId",CostCenterId);
    formData.append("ExpenseTypeId",ExpenseTypeId);
    formData.append("isPublic",String(isPublic));
    formData.append("ProcessImmediately",String(ProcessImmediately));
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/files/upload`,{
            method: "POST",
            headers: {
            "content-type" : "multipart/form-data",
            "X-API-KEY" : userAuth.clientKey,
            "X-USER-KEY" : userAuth.userKey            
        },
        body : formData
        })
        const response = await request.json();
        if(!request.ok) {
            throw new Error("Failed To Upload Invoice");
        }
        return response;
    }catch(err) {
        console.error(err);
        return null;
    }
} 

//get All Invoices 
export async function getAllInvoices() {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/Invoices`, {
            headers: {
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            }
        })
        const response = await request.json();
        if(!request.ok) {
            return{
                message : response.messages[0] || "Failed To Load Invoices",
                data: null,
                isSuccess : false
            }
        }
        return {
            message : response.messages[0] || "Invoices Loaded Successfully",
            data : response.data,
            isSuccess : true
        }
    }catch(err) {
               return{
                message : "Failed To Load Invoices Check Your Internet",
                data: null,
                isSuccess : false
               }
            }
}

// get invoice by id
export async function getInvoiceById(invoiceId) {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/Invoices/${invoiceId}`,{
            headers: {
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            }
        })
        const response = await request.json();
        if(!request.ok) {
            return {
                message : response.messages[0] || "Failed To Load Invoice Data, Try Again Later!",
                isSuccess: false
            }
        }
        return {
            message:response.messages[0] || "invoice data loaded Successfully",
            isSuccess:true,
            data: response.data,
            extraData: response.data.extraData
        }
    }catch(err) {
                return{
                message : response.messages[0] || "Failed To Load Invoice Data, Try Again Later!",
                isSuccess: false
            }
}}


//get all files (invoices befor parsing)
export async function getAllFiles() {
    const userAuth = await getSession();
    try{
    const request = await fetch(`${process.env.API_URL}/api/Invoices/files`,{
        method: "GET",
            headers: {
                "X-API-KEY" : userAuth.clientKey,
                "X-USER-KEY" : userAuth.userKey
            }
    })
    const response = await request.json();
  if(!request.ok) {
            return{
                message : response.messages[0] || "Failed To Load Files",
                data: null,
                isSuccess : false
            }
        }
        return {
            message : response.messages[0] || "Files Loaded Successfully",
            data : response.data,
            isSuccess : true
        }
    }catch(err) {
               return{
                message : "Failed To Load Files Check Your Internet",
                data: null,
                isSuccess : false
               }
            }
}

