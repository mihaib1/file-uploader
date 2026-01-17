import { FilesActions } from "../db/queries.js";
const filesActions = new FilesActions();

export default class FolderController {
    constructor(){
        this.response = {}
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
            this.response.newFile = newFile;
            this.isSuccess = true;
            return newFile;
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