const express = require('express')
const app = express()
const port = 3000

const fs = require('fs');
const multer = require('multer');

app.use(express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/upload/*', (req, res) => {
    res.sendFile(__dirname + '/uploads/' + req.params[0]);
    console.log('returned file')
})

app.post('/create', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const originalFilename = req.file.originalname;
    const tempFilePath = req.file.path;
    const targetDirectory = path.join(__dirname, 'uploaded_files');

    // Create the target directory if it doesn't exist
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }

    // Construct the final path for the uploaded file
    const targetFilePath = path.join(targetDirectory, originalFilename);

    // Move the uploaded file to the target directory
    fs.rename(tempFilePath, targetFilePath, err => {
        if (err) {
            return res.status(500).send('Error uploading file.');
        }
        res.status(200).send('File uploaded successfully.');
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})