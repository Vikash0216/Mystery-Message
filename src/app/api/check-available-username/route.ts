import {z} from "zod"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User.model"
import {userNameValidation} from "@/schemas/signUpSchema"

const userNameVerifySchema = z.object({
    userName:userNameValidation
})

export async function GET(request:Request) {
   await dbConnect()
   try {
    const {searchParams} = new URL(request.url)
    const queryParams = {
        userName: searchParams.get('userName')
    }
    const result = userNameVerifySchema.safeParse(queryParams)
    console.log(result);
    if(!result.success){
        const userNameErrors = result.error.format().userName?._errors || []
        return Response.json({
            success:false,
            message: userNameErrors.length > 0 ? userNameErrors.join(",") : "Invalid query parameters"
        },{
            status:400
        })
    }
    const {userName} = result.data
    const isUserNameTakenAndVerified =  await UserModel.findOne({userName, isVerified:true})
    if(isUserNameTakenAndVerified){
        console.log("UserName already taken");
        return Response.json({
            success:false,
            message:"UserName already taken"
        },{
            status:409
        })
    }
    
        return Response.json({
            success:true,
            message:"Username is available"
        },{
            status:200
        })
   } catch (error) {
    console.log("Failed  to check the username uniqueness",error);
    return Response.json({
        success:false,
        message:"Failed to check the username uniqueness"
    },{
        status:500
    })
    
   }
}