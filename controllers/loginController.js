import "dotenv/config";
import { UserActions } from "../db/queries.js";
import bcrypt from "bcryptjs";

const dbUserActions = new UserActions();

export class LoginController {
    connectUser = async function (loginDetails){
        const result = {isSuccess: false}
        try{
            const existingUser = await dbUserActions.checkForExistingUser(loginDetails.email);
            if(!existingUser.user){
                result.message = `User with email ${loginDetails.email} was not found!`;
            } else {
                const userDetails = existingUser.user;
                const validPassword = await bcrypt.compare(loginDetails.password, userDetails.password);
                if(!validPassword){
                    console.log("Wrong password");
                    result.message = `The password for ${loginDetails.email} is not correct!`;
                } else {
                    console.log("Correct password -> redirect to user page");
                    console.log("userDetails", userDetails);
                    const userObj = {
                        id: userDetails.id,
                        firstName: userDetails.firstName,
                        lastName: userDetails.lastName,
                        email: userDetails.email
                    };
                    result.userDetails = userObj;
                    result.isSuccess = true;
                }
                result.validPassword = validPassword; 
            }
            console.log("login result = ", result);
            return result;
        }
        catch(err){
            console.error(err);
            result.message = "There was an error searching for the user!";
            return result;
        }
    }
}