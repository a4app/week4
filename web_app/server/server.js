const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const Models = require(__dirname + '/db_model.js');
const connectDB = require(__dirname + '/db_connect.js');
const app = express();

const UserModel = Models.user;
const AdminModel = Models.admin;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'secret_key',
        resave: false,
        saveUninitialized: true,
    })
);

connectDB();

app.post('/login', async (req, res) => {

    const { username, password } = req.body;
    const out = { status: true, incorrect: true, usernameStatus: true, passwordStatus: true };
    
    setTimeout( async() => {
        if (username == '' || password == '') {
            out.status = false;
            out.incorrect = false;
            if (username == '')
                out.usernameStatus = false;
            if (password == '')
                out.passwordStatus = false;
            res.json(out);
        }
        else if(username != '' && password != '') {
            const data = await AdminModel.findOne({username: username});
            
            if(data) {
                bcrypt.compare(password, data.password, (err, result) => {
                    if(err) {
                        out.incorrect = true;
                        out.usernameStatus = true;
                        out.passwordStatus = true;
                        out.status = false;
                        res.json(out);
                    }
                    else if(result === true) {
                        out.incorrect = false;
                        out.usernameStatus = true;
                        out.passwordStatus = true;
                        out.status = true;
                        req.session.admin = true;
                        res.json(out);
                    }
                    else {
                        out.incorrect = true;
                        out.usernameStatus = true;
                        out.passwordStatus = true;
                        out.status = false;
                        res.json(out);
                    }
                });
            }
            else {
                out.incorrect = true;
                out.usernameStatus = true;
                out.passwordStatus = true;
                out.status = false;
                res.json(out);
            }
        }
    },1000);
});

app.get('/logout', (req, res) => {
    setTimeout(() => {
        req.session.destroy();
        res.send('success');
    }, 1000);
});

app.get('/auth', (req, res) => {
    if (req.session && req.session.admin) {
        res.json({ status: true });
    }
    else {
        res.json({ status: false });
    }
});

app.get('/users', async ( _, res) => {
    try {
        const users = await UserModel.find();
        res.json({status: true, data: users});
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({status: false, error: 'Internal server error' });
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await UserModel.findOneAndDelete({ _id: id });

        if(deletedUser) {
            return res.json({ status: true, msg: ''});
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch(error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ status: false, msg: 'error occured'});
    }
});


app.post('/add', async (req, res) => {
    const out = {status: false, u: true, n: true, e: true, p: true, a: true, error: false}
    try {
        const { username, name, email, phone, address } = req.body;

        if(username == '' || name == '' || email == '' || phone == '' || address == '') {
            if(username == '')
                out.u = false;
            if(name == '')
                out.n = false;
            if(email == '')
                out.e = false;
            if(phone == '')
                out.p = false;
            if(address == '')
                out.a = false;
            return res.json(out);
        }
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)) {
                out.e = 'invalid';
                return res.json(out);
            }
            else {
                const newUser = new UserModel({ username, name, email, phone, address });
                await newUser.save();
                out.status = true;
                return res.json(out);
            }
        }
    }
    catch(error) {
        console.error('Error adding user:', error);
        res.json({status: false, error: true });
    }
});


app.post('/update', async (req, res) => {
    const out = {status: false, u: true, n: true, e: true, p: true, a: true, error: false}
    try {
        const { id, username, name, email, phone, address } = req.body;

        if(username == '' || name == '' || email == '' || phone == '' || address == '') {
            if(username == '')
                out.u = false;
            if(name == '')
                out.n = false;
            if(email == '')
                out.e = false;
            if(phone == '')
                out.p = false;
            if(address == '')
                out.a = false;
            return res.json(out);
        }
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)) {
                out.e = 'invalid';
                return res.json(out);
            }
            else {
                const newData = { username: username, name: name, email: email, phone: phone, address: address };
                const dda = await UserModel.findByIdAndUpdate(
                    { _id : id },
                    { $set: newData },
                    { $new: true  }
                );
                out.status = true;
                return res.json(out);
            }
        }
    }
    catch(error) {
        console.error('Error adding user:', error);
        res.json({status: false, error: true });
    }
});






app.get('/test', async (req, res) => {
    const user = 'a';
    const pass = 'a';

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(pass , salt, (err, hash) => {
            console.log('salt ==',salt)
            console.log('hash==',hash)
            const newAdmin = new AdminModel({
                username: user,
                password: hash
            });
            newAdmin.save().then(() => {
                console.log('Document saved successfully');
            })
            .catch((error) => {
                if(error.code === 11000) {
                    console.error('Duplicate key error:', error.message);
                }
                else {
                    console.error('Error saving document:', error.message);
                }
            });
            console.log('saved');
            res.send('done');
        });
    });
});


app.listen(5500, () => {
    console.log('server is started');
});