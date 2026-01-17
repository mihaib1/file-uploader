import "dotenv/config";
import { FilesActions } from "../db/queries.js";
const filesActions = new FilesActions();

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
}); 

export default class FolderController {
    constructor(){
        this.response = {}
    }

    async uploadFile(path){
        const result = await cloudinary.uploader.upload(path);
        const fileUrl = await cloudinary.url(result.public_id)
        console.log("fileUrl = ", fileUrl);
        return fileUrl;
    }

    async getFileById(id){
        if(id){
            let fileDetails = await filesActions.getFileById(id);
            return fileDetails;
        }
        return null;
    }

    async getFolderByUser(userId){
        if(userId){
            let folders = await filesActions.getFoldersByUserId(userId);
            this.response = folders;
            return folders;
        }
        return null;
    }

    async getFilesByFolder(folderId){
        if(folderId){
            let files = await filesActions.getFilesByFolderId(folderId);
            return files;
        }
        
        return null;
    }

    async createFolder(payload){
        if(payload){
            let newFolder = await filesActions.createFolder(payload);
            this.response = newFolder;
            return newFolder;
        }
        return null;
    }

    async addFile(payload){
        if(payload){
            let newFile = await filesActions.createFile(payload);
            return newFile.createdFile;
        }
        return [];
    }

    async getFolderById(folderId){
        if(folderId){
            let folderDetails = await filesActions.getFolderById(folderId);
            this.response.folderDetails = folderDetails;
            return folderDetails;
        }
        return [];
    }
}