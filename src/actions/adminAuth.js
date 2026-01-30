"use server";

//Get Admin Auth
export default async function getAdminCredential() {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/Account/Login`;
  const Credential = btoa(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`);
  try {
    const response = await fetch(loginUrl,{
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        "username":`${process.env.API_USERNAME}`,
        "password":`${process.env.API_PASSWORD}`
      })
    })
    if(!response.ok) {
      throw new Error("Request Failed Check Credentials");
    }
    const result = await response.json();
    return {
      userKey : result.data.userKey,
      Credential: Credential
    }
  }catch(err) {
    console.error(err);
    return null;
  }
}