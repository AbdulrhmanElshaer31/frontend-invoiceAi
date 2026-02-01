"use server"

import { getSession } from "./session";
//get dashboard data 
export default async function Dashboard() {
    const userAuth = await getSession();
    try {
        const request = await fetch(`${process.env.API_URL}/api/v1/Dashboard` ,{
            method:"GET",
             headers: {
            "X-API-KEY" : userAuth.clientKey,
            "X-USER-KEY" : userAuth.userKey            
        }
        })
        const response = await request.json();
        if(!request.ok) {
            return{
                message:"failed to load Dashboard Data",
                isSuccess : false,
                data:null
            }
        }
            return{
                message:"Dashboard Data Loaded!",
                isSuccess : true,
                data : response
            }
        }catch(err) {
            console.error(err);
            
            return{
                message: "failed to load Dashboard Data, Check Your Internet",
                isSuccess : false,
                data : null
            }
    }
}
