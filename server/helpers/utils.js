module.exports = {
    sessionizeUser: (user) => ({
        userID: user._id,
        username: user.username
    })
}
