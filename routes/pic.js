const fs = require('fs');

module.exports = {
    addPicPage: (req, res) => {
        res.render('add-pic.ejs', {
            title: "Welcome to Annelise's Professional Photo Blog | Add a new pic",
            message: ''
        });
    },
    addPic: (req, res) => {
        if (!req.files) {
            console.log(req);
            console.log(uploadedFile);
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let username = req.body.username;
        let pic_title = req.body.pic_title;
        let pic_desc = req.body.pic_desc;
        let uploadedFile = req.files.image;
        let pic_file = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        pic_file = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `pictures` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-cat.ejs', {
                    message,
                    title: "Welcome to Annelise's Professional Photo Blog | Add a new picture"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${pic_file}`, (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        let query = "INSERT INTO `pictures` (pic_file, user_name, pic_title, pic_desc) VALUES ('" +
                            pic_file + "', '" + username + "', '" + pic_title + "', '" + pic_desc + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-pic.ejs', {
                        message,
                        title: "Welcome to Annelise's Professional Picture Blog | Add a new pic"
                    });
                }
            }
        });
    },

    editPicPage: (req, res) => {
        let pic_ID = req.params.id;

        let query = "SELECT * FROM `pictures` WHERE `pic_id` = " + pic_ID + " ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-pic.ejs', {
                title: "Edit picture info",
                pic: result[0],
                message: ''
            });
        });
    },
    editPic: (req, res) => {
        let pic_ID = req.params.id;
        let pic_title = req.body.pic_title;
        let pic_desc = req.body.pic_desc;

        let query = "UPDATE `pictures` SET `pic_title` = '" + pic_title + "', `pic_desc` = '" + pic_desc + "' WHERE `pic_id` = " + pic_ID + " ";

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePic: (req, res) => {
        let pic_ID = req.params.id;
        let getImageQuery = "SELECT `pic_file` from `pictures` WHERE `pic_id` = " + pic_ID + " ";
        let deleteUserQuery = "DELETE FROM `pictures` WHERE `pic_id` = " + pic_ID + " ";

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let pic_file = result[0].pic_file;

            fs.unlink(`public/assets/img/${pic_file}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};