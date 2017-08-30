/* ================================= SETUP ================================= */

const User       = require('../models/user');
const Post       = require('../models/post');
const parseSKill = require('../utils/skillsparser');

const user_projection = {
    signupKey : 0, passwordResetKey: 0, hash: 0, salt: 0
};


/* ============================ PUBLIC METHODS ============================= */

// GET ALL PROFILES
function getProfiles(req, res) {
    const target = req.params.id;

    User.find({}, user_projection, (err, profiles) => {

        if (!profiles) {
            return res
                .status(404)
                .json({ message : 'No profiles found!'});
        }

        return res
            .status(200)
            .json(profiles);

    });
}

// GET ONE PROFILE
function getOneProfile(req, res) {

    const target = req.params.id;

    User.findOne({_id: target}, user_projection, (err, profile) => {

        if (!profile) {
            return res
                .status(404)
                .json({ message : 'User profile not found!'});
        }

        return res
            .status(200)
            .json(profile);

    });

}

// UPDATE PROFILE
function updateProfile(req, res) {

    const target = {
        _id      : req.params.id,
        username : req.token.username
    };

    // kick off promise chain
    new Promise( (resolve, reject) => {

        // make sure the requesting user ID and target user ID match
        if (target._id === req.token._id) {
            resolve(target);
        } else {
            reject('Error: user ID mismatch.');
        }

    })
    .then( () => {

        const options = {
            new: true  // return updated document rather than the original
        };

        const updates = {
            ghUserName : req.body.ghUserName,
            name       : req.body.name,
            avatarUrl  : req.body.avatarUrl,
            location   : req.body.location,
            languages  : req.body.languages,
            gender     : req.body.gender,
            about      : req.body.about,
            skills     : (req.body.skills).map( skill => parseSKill(skill) ),
            time_zone  : req.body.time_zone,
            twitter    : req.body.twitter,
            facebook   : req.body.facebook,
            link       : req.body.link,
            linkedin   : req.body.linkedin,
            codepen    : req.body.codepen,
        };

        User.findOneAndUpdate(target, updates, options)
            .exec()
            .then( user => {

                if (!user) {

                    return res
                        .status(404)
                        .json({message: 'User not found!'});

                } else {

                    return res
                        .status(200)
                        .json({
                            message : 'User updated!',
                            user    : user
                        });

                }
        });

    })
    .catch( err => {
        console.log('Error!!!', err);
        return res
            .status(400)
            .json({ message: err});
    });

}

// DELETE A PROFILE
function deleteProfile(req, res) {
    
    const targetUser = {
        _id      : req.params.id,
        username : req.token.username
    };

    // make sure the requesting user ID and target user ID match
    if (targetUser._id !== req.token._id) {
        return res
            .status(400)
            .json({ message: 'Error: user ID mismatch.'});
    }
    
    User.findOneAndRemove(targetUser)
        .exec()
        .then( user => {

            if (!user) {

                return res
                    .status(404)
                    .json({message: 'User not found!'});

            } else {
                
                const postAuthor = {
                    author_id : targetUser._id,
                    author    : targetUser.username
                };
                
                const updates = {
                    deleted   : true,
                    active    : false
                };
                
                const options = {
                    multi     : true
                };
                
                // "delete" all posts from same author. Sets "deleted" to true,
                // and "active" to false
                Post.update(postAuthor, updates, options, (err, raw) => {
                    
                    if (err) { throw err; }
                    
                    else {
                        console.log('The raw response from Mongo was ', raw);
                        
                        return res
                            .status(200)
                            .json({
                                message : 'User profile deleted!',
                                user    : user
                            });
                    }                    
                    
                }); 
                
            }

        })
        .catch( err => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
        });

}


/* ============================== EXPORT API =============================== */

module.exports = {
  getProfiles   : getProfiles,
  getOneProfile : getOneProfile,
  updateProfile : updateProfile,
  deleteProfile : deleteProfile
};
