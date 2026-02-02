"use server";
import { deleteSession,setSession } from "./session";
import getAdminCredential from "./adminAuth";
import { redirect } from "next/dist/server/api-utils";
// [=== Error Reminder : ENV not working on production So I Use Basic Url Temp ===]
const basic_url = `${process.env.API_URL}`
// [=== Error Solved ===]
//==========================================
// Login function 
export async function Login(email, password) {
  const loginUrl = `${basic_url}/api/v1/Account/Login`;
  
  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({    
        "username": email,
        "password": password
      })
    });

    // Parse response even if not ok to get error messages
    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        messages: ["Login failed. Please check your credentials."]
      };
    }
    setSession(result.data)
    // Return success response
    return {
      data: result.data,
      success: result.isSuccess,
      messages: result.messages || []
    };
    
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      data: null,
      messages: ["Connection error. Please try again."]
    };
  }
}

//[=== Create Account Cycle ===]

// Request Otp Function
export async function requestOtp(email) {
  const Auth = await getAdminCredential();
  try {
    const request = await fetch(`${basic_url}/api/v1/Account/request-otp`,{
      method:"POST",
      headers:{
        "Content-Type" : "application/json",
        "X-USER-KEY" : Auth.userKey,
        "Authorization" : `Basic ${Auth.Credential}`
      },
      body:JSON.stringify({
            "identifier":email,
            "otpType": "Email Confirmation"
        })
    })
    const response = await request.json()
    if(!request.ok) {
      return {
        // data:null,
        message:[`Failed To Send OTP To (${email})`] || response.messages ,
        success:false
      };
    }
    // Return success response
    return {
      // data: response.data, No need For Data (OTP SENT WITH RESPONSE BODY)
      success: response.isSuccess,
      message:  [`OTP Sent To  (${email})`] || response.messages
    };

  } catch (err) {
    console.error("Request OTP error:", err);
    return {
      // data: null,
      success: false,
      message: ["Connection error. Please try again."]
    };
  }
}

//Validate Otp Function
export  async function validateOtop(email,otp) {
  const Auth = await getAdminCredential();
  try {
    const request = await fetch(`${basic_url}/api/v1/Account/validate-otp`,{
      method:"POST",
      headers:{
        "Content-Type" : "application/json",
        "X-USER-KEY" : Auth.userKey,
        "Authorization" : `Basic ${Auth.Credential}`
      },
      body:JSON.stringify({
        "identifier":email,
        "otpType": "Email Confirmation",
        "otp":otp
      })
    })
    const response = await request.json()
    if(!request.ok) {
      return {
        message: response.messages || ["OTP Invalid !"],
        success:false,
        emailConfirmed:false  //it uses in SignUp Body Request Check SignUp Function To Understand
      };
    }
    // Return success response
    return {
      success: response.isSuccess,
      message: response.messages || ["Validate Sucsess !"],
      emailConfirmed:true
    };

  } catch (err) {
    console.error("Validate OTP error:", err);
    return {
      success: false,
      message: ["Connection error. Please try again."]
    };
  }
}

//SignUp Function
export  async function SignUp(payload) {
  const Auth = await getAdminCredential();
  try{
    const request = await fetch(`${basic_url}/api/v1/Clients`,{
    method:"POST",
    headers:{
        "Content-Type" : "application/json",
        "X-USER-KEY" : Auth.userKey,
        "Authorization" : `Basic ${Auth.Credential}`
      },
    body:JSON.stringify(payload)
  })

  const response = await request.json();

  if(!request.ok) {
    return{
      success:false,
      message: response.messages  || ["Falied To Create Account!"]
    }
  }
  console.log(response);
  
  return {
    data:response.data,
    success:response.isSuccess,
    message:["Account Created Successfully"] || response.messages
  };
  }catch (err) {
    console.error("Signup error:", err);
    return {
      success: false,
      data: null,
      message: ["Connection error. Please try again."]
    };
  }
}
//[=== End Of Create Account Cycle ===]

//==========================================

//[=== Forget Password Cycle ===]

// Request Forget Password Otp 

export  async function resetPswdOtp(email) {
  try  {
    const request = await fetch(`${basic_url}/api/v1/Account/forget-password`,{
      method:"POST",
      headers:{
        // Here No Need For Admin Auth
        "Content-Type" : "application/json"
      },
      body:JSON.stringify({email})
    })
      const response = await request.json();
      if(!request.ok) {
      return{
      success: false,
      messages: response.messages || ["Failed To Request OTP, Please try again Later."]
      }
      }

      return {
      success: response.isSuccess,
      messages: ["OTP Sent Succe, Please Check Your Email."] || response.messages
      }

  }catch (err) {
    console.error("Request OTP error:", err);
    return {
      success: false,
      messages: ["Connection error. Please try again."]
    };
  }
}

//Validate Forget Password OTP

export  async function validatePswdOtp(email,otp) {
      try  {
    const request = await fetch(`${basic_url}/api/v1/Account/forget-password-validate`,{
      method:"POST",
      headers:{
        // Here No Need For Admin Auth
        "Content-Type" : "application/json"
      },
      body:JSON.stringify({email,otp})
    })
      const response = await request.json();
      if(!request.ok) {
      return{
      success: false,
      messages: response.messages || ["Failed To Validate OTP, Please try again Later."]
      }
      }

      return {
      success: response.isSuccess,
      messages: ["OTP Validate Sucsecss."] || response.messages
      }

  }catch (err) {
    console.error("Request OTP error:", err);
    return {
      success: false,
      messages: ["Connection error. Please try again."]
    };
  }
}

// Finally Reset Password 

export  async function resetPassword(payload) {
  const Auth = await getAdminCredential();
  try {
    const request = await fetch(`${basic_url}/api/v1/Account/reset-password`,{
      method:"POST",
      headers:{
        "Content-Type" : "application/json",
        "X-USER-KEY" : Auth.userKey,
        "Authorization" : `Basic ${Auth.Credential}`
      },
      body:JSON.stringify(payload)
    })
    const response = await request.json();
    console.log(response);
    
    if(!request.ok) {
      return{
        success: false,
        messages: response.messages || ["Failed To Reset Password, Please try again Later."]
      }
    }
    return  {
        success: true,
        messages:  ["Password Resets Succsefully Return To Login."] || response.messages 
    }
  }catch (err) {
    console.error("Reset Password Error: ",err);
      return {
      success: false,
      messages: ["Connection error. Please try again."]
    };
  }
  
}

//[=== End OF Forget Password Cycle ===]

//Logut Function 
export  async function Logout() {
  await deleteSession();
  redirect('/login');
}
