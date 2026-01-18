import multer from "multer";
import { Router } from "express";
import fs from "fs";
import FolderController from "../controllers/filesController.js";
const folderController = new FolderController();

let filesRouter = Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(req.user){
            console.log("file aici ");
            console.log(file);
            console.log("dupa file")
            const userId = req.user.id;
            const path = `/Users/mihaibaiasu/uploads/${userId}`;
            if(fs.existsSync(path)){
                cb(null, path);
            } else {
                fs.mkdirSync(path);
                cb(null, path);
            }
        } else {
            console.log("user is not connected, shouldn't have access to this page!");
        }
    },
    filename: function(req, file, cb){
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniquePrefix + file.originalname)
    }
})

/*filesRouter.get("/upload", (req, res) => {
    console.log(req.params);
    res.render("file-form");
});*/

filesRouter.get("/upload", (req, res) => {
    res.render("file-form", {
        folderId: null
    });
});

filesRouter.get("/upload/:folderId", async (req, res) => {
    const folder = await folderController.getFolderById(Number(req.params.folderId))

    if (!folder) {
        return res.redirect("/user-page");
    }

    res.render("file-form", {
        folderId: folder.id
    });
});

const upload = multer({storage: storage});

filesRouter.post("/upload", upload.single("file"), (req, res, next) => {
    
    res.end();
});

filesRouter.post("/upload", upload.single("file"), async (req, res) => {
    console.log("upload fara fisier");
    res.end();
  }
);

filesRouter.post("/upload/:folderId", upload.single("file"), async (req, res) => {
    const folderId = Number(req.params.folderId);
    const filePath = req.file.path;
    const fileName = req.body.fileName
    console.log("==== Starting file upload ====");
    const fileUrl = await folderController.uploadFile(filePath);
    const filePayload = {
        userId: req.user.id,
        folderId: folderId,
        name: fileName,
        url: fileUrl
    }
    const newFile = await folderController.addFile(filePayload);
    console.log("==== Finished uploading file ====");
    res.redirect("/files/view-folders");
  }
);

filesRouter.get("/view-folders", async (req, res) => {
    if(req.user && req.user.id){
        const foldersList = await folderController.getFolderByUser(req.user.id);
        if(foldersList && foldersList.length > 0){
            res.render("folders", {user: req.user, folders: foldersList});
        }
    } else {
        res.redirect("/");
    }
});

filesRouter.get("/create-folder", (req, res) => {
    if(req.user){
        res.render("folder-form", {user: req.user});
    } else {
        res.redirect("/");
    }  
});

filesRouter.post("/create-folder", async (req, res) => {
    if(req.user){
        const payload = {
            userId: req.user.id,
            folderName: req.body.folderName
        };
        const queryResponse = await folderController.createFolder(payload);
        if(queryResponse.isSuccess){
            res.redirect("/files/view-folders");
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
})

filesRouter.get("/folder/:id", async (req, res) => {
    const folderId = Number(req.params.id);
    const folderDetails = await folderController.getFolderById(folderId);
    const files = await folderController.getFilesByFolder(folderId);
    res.render("folder", {folder: folderDetails, files: files});
});

filesRouter.get("/file/:id", async (req,res) => {
    console.log("ajunge aici")
    const fileId = Number(req.params.id);
    const fileDetails = await folderController.getFileById(fileId);
    console.log("fileDetails = ", fileDetails);
    res.render("file-details", {file: fileDetails});
})



export {filesRouter}