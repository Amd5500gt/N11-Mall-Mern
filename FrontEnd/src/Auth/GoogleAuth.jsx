import React, { useEffect } from 'react'
import { jwtDecode} from  "jwt-decode"
import BASE_URL from '../config/config'
import toast from 'react-hot-toast'


const GoogleAuth = () => {
    handleCredentailResponse = async (respone) =>{
         try{
             const res = await fetch(`${BASE_URL}/goole-login`, {
                method: "POST",
                headers :{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    credential : respone.credential
                })
                });

                const  data = await res.json();
                console.log(data)
                if(data.success){
                    localStorage.setItem("token",data.token)
                    toast.success("Login Success")
                }
         } catch(err){
            console.log(err)
         }
    }

     useEffect(()=>{
        google.accounts.id.initialize({
            client_id :"544841424268-ouptou7q8ca2j72gajck8ckrcr4btl7h.apps.googleusercontent.com",
            callback : handleCredentailResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("googleBtn"),
            {
                theme: "outline",
                size:"large"
            }
        );
     },[]);
  return (
       <div>
      <div id="googleBtn"></div>
    </div>
  )
}

export default GoogleAuth