import User from "../models/User.js";

// GETUSER
export const getUser = async(req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).json({
            success: true,
            user
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}

// GETFRIENDS
export const getUserFriends = async (req, res) => {
    console.log("getUserFriends");
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        console.log("formattedFriends ",formattedFriends);
        res.status(200).json(
            formattedFriends
        )
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

export const addRemoveFriend = async(req, res) => {
    try{
        const {id, friendId} = req.params;
        console.log("id ",id, " friendId ",friendId);
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, pcturePath}) => {
                return {_id, firstName, lastName, occupation, location, pcturePath};
            }
        );

        res.status(200).json({
            success: true,
            formattedFriends
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

