import "dotenv/config";
import { UserActions } from "../db/queries.js";
import bcrypt from "bcryptjs";

const dbUserActions = new UserActions();

export class ControllerActions {
    createUser = async function(userData){
        const result = {isSuccess: false};
        try{
            const existingUser = await dbUserActions.checkForExistingUser(userData.email);
            if(!existingUser.user){
                const processedUserData = await processUserData(userData);
                dbUserActions.createUser(processedUserData.userData);
                result.isSuccess = true;
                result.message = "User was created successfully";
            } else {
                result.isSuccess = true;
                result.message = `User with email ${userData.email} already exists!`;
            }
            return result;
        }
        catch(err){
            console.error(err);
            result.message = "There was an error creating the user!";
            return result;
        }
    }
}

async function processUserData(userData){
    console.log("=== Processing User Data ===");
    let processingResult = {}
    processingResult.isSuccess = false;
    if(userData){        
        const stringFields = ['firstName', 'lastName', 'email'];
        const secureFields = ['password'];
        const processed = {...userData};

        for(const field of stringFields){
            if(processed[field] !== null && typeof processed[field] == "string"){
                processed[field] = processed[field].trim();
            }
        }

        const hashedPassword = await hashPassword(processed.password);
        processed.password = hashedPassword;

        processed.fullName = processed.firstName + " " + processed.lastName;
        processingResult.isSuccess = true;
        processingResult.userData = processed;
        console.log("=== Finished Processing User Data ===");
    } else {
        processingResult.message = "No user data was found!";
    }

    return processingResult;
}

async function hashPassword(password){
    let hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

