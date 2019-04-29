

var mutedUsers = []; // This will have to persist across restarts in the future. We can fix it once the save system is working.

function unmuteUser(userId) {
    while (true) {
        user = mutedUsers.find((currVal) => currVal[0] === userId);
        if (!user) break;
        userIndex = mutedUsers.indexOf(user);
        mutedUsers.splice(userIndex, 1);
    }
}

function shutupUser(userId, durationSeconds) {
    // Remove all previous instances of same user from array:
    unmuteUser(userId);
    // Push userId, and mute end time to arrayy:
    mutedUsers.push([userId, Date.now() + durationSeconds*1000]);
}

function userMuted(userId) {
    user = mutedUsers.find((currVal) => currVal[0] === userId);
    if (!user) return false;
    if (user[1] >= Date.now()) {
        userIndex = mutedUsers.indexOf(user);
        mutedUsers.splice(userIndex, 1); // remove user from array if mute has expired.
        return false;
    }
    
    return true;
}

module.exports = {shutupUser, userMuted, unmuteUser}