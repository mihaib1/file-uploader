import { prisma } from "../lib/prisma.js";

export class UserActions {
    constructor(){
        this.response = {isSuccess: false};
    }

    async getUserByEmail(emailAddress){
        if(emailAddress){
            const user = await prisma.user.findUnique({
                where: {
                    email: emailAddress
                }
            });
            this.response.isSuccess = true;
            this.response.records = user
        }
        return this.response;
    }

    async getUserById(id) {
        if(id){
            const user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            });
            this.response.isSuccess = true;
            this.response.records = user;
        }
        return this.response;
    }

    async checkForExistingUser (emailAddress) {
        if(emailAddress){
            const user = await prisma.user.findUnique({
                where: {
                    email: emailAddress
                }
            });
            this.response.isSuccess = true;
            this.response.user = user;
        }
        return this.response;
    }

    async createUser (userData){
        if(userData){
            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    password: userData.password,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    fullName: userData.fullName
                }
            });
            this.response.isSuccess = true;
            this.response.createdUser = user;
        }
        return this.response;
    }
}

export class FilesActions {
    constructor(){
        this.response = {isSuccess: false}
    }

    async getFileById(id){
        if(id){
            const file = await prisma.files.findUnique({
                where:{
                    id: id
                }
            })
            return file;
        }
        return null;
    }

    async createFolder(payload){
        if(payload){
            const folder = await prisma.folder.create({
                data: {
                    createdBy: payload.userId,
                    name: payload.folderName
                }
            });
            this.response.createdFolder = folder;
            this.response.isSuccess = true;
        }
        return this.response;
    }

    async createFile(payload){
        if(payload){
            const file = await prisma.files.create({
                data: {
                    createdBy: payload.userId,
                    folderId: payload.folderId,
                    name: payload.name,
                    url: payload.url
                }
            });
            this.response.isSuccess = true;
            this.response.createdFile = file;
        }
        return this.response;
    }

    async getFoldersByUserId(userId){
        if(userId){
            const folders = await prisma.folder.findMany({
                where:{
                    createdBy: userId
                }
            });
            return folders;
        }
        return [];
    }

    async getFilesByFolderId(folderId){
        if(folderId){
            const files = await prisma.files.findMany({
                where:{
                    folderId: folderId
                }
            });
            this.response.isSuccess = true;
            return files
        }
        return [];
    }

    async getFolderById(folderId){
        if(folderId){
            const folder = await prisma.folder.findUnique({
                where:{
                    id: folderId
                }
            });
            return folder;
        }
        return [];
    }

    async getFilesByUserId(userId){
        if(userId){
            const files = await prisma.files.findMany({
                where:{
                    createdBy: userId
                }
            });
            this.response.isSuccess = true;
            this.response.files = files;
        }
        return this.response;
    }
}