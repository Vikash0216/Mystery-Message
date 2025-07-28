import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
 

export  async function sendVerificationEmail(
    email: string,
    userName: string,
    verificationCode: string,
): Promise<ApiResponse>{
    try{
       await resend.emails.send({
        from: 'onboarding@resend.dev',
        to:email,
        subject: 'Verification Email',
        react: VerificationEmail({userName,otp:verificationCode}),
        })
        return{success:true , message:"Email sent successfully"}
    }catch(emailError){
        console.log("Failed to send email", emailError);
        return{success:false , message:"Failed to send email"}
    }
}