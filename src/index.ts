import { config } from 'dotenv';
import path from 'path';
import bodyParser from "body-parser";
import express from "express";
import multer from "multer";
import waclient from "./waclient";
import storage from "./storage";
import { apiAuthorize } from "./auth";
import { MessageMedia } from "whatsapp-web.js";
import fs from "fs";


//////////////////////// SERVER CONFIGS BEGINS ////////////////////////
config({ path: path.resolve(__dirname, '../.env') });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ storage });

///////////////////////// SERVER CONFIGS ENDS ////////////////////////


waclient.initialize();


app.post('/:num/message', apiAuthorize, async (req, res) => {
    try {

        const userNumber = req.params.num;

        if (!req.body || !userNumber || !req.body.message) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const { message } = req.body;

        const finalNumber = userNumber.replace('+', '').replace(' ', '');

        if (finalNumber.length < 11) {
            return res.status(400).json({ success: false, message: 'Invalid phone number' });
        }

        await waclient.sendMessage(`${finalNumber}@c.us`, message);

        return res.status(200).json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message', error });
    }
});


app.post('/:num/file', apiAuthorize, upload.single('file'), async (req, res) => {
    try {
        const body = req.body;

        const userNumber = req.params.num;


        if (!body || !userNumber) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const finalNumber = userNumber.replace('+', '').replace(' ', '');

        if (finalNumber.length < 11) {
            return res.status(400).json({ success: false, message: 'Invalid phone number' });
        }

        const media = MessageMedia.fromFilePath(file.path);

        await waclient.sendMessage(`${finalNumber}@c.us`, media);

        fs.unlinkSync(file.path);

        return res.status(200).json({ success: true, message: 'File sent successfully' });

    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message', error });
    }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`✅ ZWAPI Server is running on port ${PORT}`);
});
