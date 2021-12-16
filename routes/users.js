const express = require('express');
const router = express.Router()
const { createUser, login, userUploadImage, myProfileData, editBadge, myProfileDataSports } = require('../controllers/users');
const { isLoggedIn } = require('../middleware/checkIfAuth');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// FILE UPLOAD CHECKS, IF ERROR NO UPLOAD! 

// const uploadProfile = (req, res, next) => {
//     upload.single('profile')(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//                 return res.status(401).json('Mutler error')
//         } else if (err) {
//                 return res.status(401).json('Just error')
//         }
//         console.log('Yay, everythings fine')
//         console.log(req.file, 'ohooo')
//         next()
//     })
// }


router.route('/signup')
        .post(createUser)
        
router.route('/login')
        .post(login)

// HERE TO WORK TYPE OF IMAGE (SHOULD MATC FIELDNAME like cover)
router.route('/uploadprofilepicture')
        .post(isLoggedIn, upload.single('profile'),userUploadImage)

router.route('/uploadcoverpicture')
        .post(isLoggedIn, upload.single('cover'),userUploadImage)

router.route('/myprofile')
        .get(isLoggedIn, myProfileData)

router.route('/myprofile/sports')
        .get(isLoggedIn, myProfileDataSports)

router.route('/myprofile/editbadge')
        .post(isLoggedIn, editBadge)

module.exports = router;


