const User = require('../models/User')
const encryption = require('../utilities/encryption')

module.exports = {
    register: {
        post: (req, res) => {
            let userData = req.body

            if (userData.password && userData.password !== userData.confirmedPassword) {
                return res.status(400).send({message: 'Passwords do not match'})
            }

            let salt = encryption.generateSalt()
            userData.salt = salt

            if (userData.password) {
                userData.password = encryption.generateHashedPassword(salt, userData.password)
            }

            User.create(userData)
                .then(user => {
                    req.logIn(user, (err) => {
                        if (err) {
                            return res.status(200).send({message: 'Wrong credentials!'})
                        }

                        res.status(200).send(user)
                    })
                })
                .catch(error => {
                    res.status(500).send({message: error})
                })
        }
    },
    login: {
        post: (req, res) => {
            let userData = req.body

            User.findOne({username: userData.username}).then(user => {
                if (!user || !user.authenticate(userData.password)) {
                    return res.status(401).send({message: 'Wrong credentials!'})
                }

                req.logIn(user, (err, user) => {
                    if (err) {
                        return res.status(401).send({message: err})
                    }

                    res.status(200).send(req.user)
                })
            })
        }
    },
    logout: (req, res) => {
        req.logout()
        res.status(200).end()
    },
    get: (req, res) => {
      let userId = req.params.userId

      User.findById(userId).then(user => {
        if (!user) { return res.status(404).send({message: 'User no longer exists'}) }

        let userObj = {
          username: user.username,
          age: user.age,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender
        }

        res.status(200).send(userObj)
      })
    },
    findUserByUsername: {
        get: (req, res) => {
            let username = req.params.username

            User.find({username: username}).then(user => {
                if (!user) {
                    return res.status(404).send({message: 'User no longer exists'})
                }

                res.status(200).send(user)
            })
        }
    },
    blockUser: (req, res) => {
        let currentUserId = req.body.currentUserId
        let userForBlockId = req.body.userForBlockId

        User.findById(currentUserId).then(user => {
            if (!user.blockedUsersId.includes(userForBlockId) && currentUserId !== userForBlockId) {
                user.blockedUsersId.push(userForBlockId)
                user.save()
            }
        })
        res.status(200).send()
    }
}
