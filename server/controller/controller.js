const user = require('../model/user');

exports.register = async (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: "Content can not be empty" });
        return
    }
    const { name, email, password } = req.body;

    const alreadyUser = await user.findOne({ email: email })
    if (alreadyUser) {
        console.log(user.findOne({ email: email }))
        return res.status(400).json({ message: "user already exists" });
    }

    // new user
    const newUser = new user({
        name,
        email,
        password
    });


    //save user in the database
    newUser.save(newUser)
        .then(data => {
            res.status(200).json({ message: 'user registered' });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message || "Some error occured while creating user"
            });
        });
}


// login user
exports.login = (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: "Content can not be empty" });
        return
    }
    const { email } = req.body;

    user.findOne({ email })
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "Not found user with this username" });
            } else {
                res.send(user)
            }
        })
        .catch(error => {
            res.status(500).send({ message: error.message || "Error occured while retrieving user iformation" });
        })
}


exports.users = (req, res) => {
    user.find()
        .then(data => {
            console.log('request successful');
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(200).send("no user in database")
            }
        })
        .catch(error => {
            res.status(500).json(error);
        })
}

// search 
exports.search = (req, res) => {
    if (!req.body) {
        return "Enter search Text";
    }
    const { email } = req.body;

    user.findOne({ email })
        .then(data => {
            if (!data) {
                res.status(404).json({ message: "data is not available" });
            } else {
                res.status(200).send(data);
            }
        })
        .catch(error => {
            res.status(400).send(error)
        })
}



