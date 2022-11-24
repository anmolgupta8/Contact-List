const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 8000;

const db = require('./config/mongoose');
const Contact = require('./models/contact');

const app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser.urlencoded({extended: false}));

// app.use(function(req,res,next){
//     console.log('Middleware 1 called!!');
//     next();
// });

// app.use(function(req,res,next){
//     console.log('Middleware 2 called!!');
//     next();
// });

app.use(express.static('assets'));

var contactList = [
    {
        name: "Me",
        contact: "9034844621"
    },
    {
        name: "Mummy",
        contact: "9306364419"
    },
    {
        name: "Papa",
        contact: "9896654621"
    }
]

app.get('/',function(req,res){
    // console.log(__dirname);
    // res.send("<h1> Cool, it's running !!");

    // res.render('home',{
    //     title : "My contacts list",
    //     contact_list : contactList
    // });

    Contact.find({},function(err,contacts){
        if(err){
            console.log("Error in fetching from databse");
            return;
        }
        else{
            return res.render('index',{
                title: "Contacts List",
                contact_list: contacts
            });
        }
    });
});

app.get('/practice',function(req,res){
    res.render('practice',{title : "Practice Session"});
});

// app.get('/delete-contact',function(req,res){
//     let phone = req.query.contact;
//     let contactIndex = contactList.findIndex(contact => contact.phone == contact);
//     if(contactIndex != -1){
//         contactList.splice(contactIndex,1);
//     }
//     return res.redirect('back');
// });

app.post('/create-contact',function(req,res){
    contactList.push(
        {
            name : req.body.name,
            contact : req.body.contact
        }
    );

    Contact.create({
        name: req.body.name,
        contact: req.body.contact
    },function(err,newContact){
        if(err){
            console.log("Error in creating the contact");
            return;
        }
        else{
            console.log(newContact);
            return res.redirect('back');
        }
    });
    // return res.redirect('/');
});

app.get('/delete-contact/',function(req,res){
    // get the id from query in the ul
    let id = req.query.id;
    // let contactIndex = contactList.findIndex(x => x.contact == phone);
    // find the contact in the databse using id and delete it
    Contact.findByIdAndDelete(id, function(err){
        if(err){
            console.log("Error in deleting from database");
            return;
        }
    });
    // if(contactIndex != -1){
    //     contactList.splice(contactIndex,1);
    // }
    return res.redirect('back');
});

app.listen(port,function(err){
    if(err) console.log('Error in running the server !!');
    else console.log('Server is up and running on port : ',port);
});