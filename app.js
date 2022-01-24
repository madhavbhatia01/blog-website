//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

let arr = [];

const homeStartingContent = "Are you a blogger ? Well you have come to the right place. Start writing your blog by clicking the COMPOSE button above. ";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.connect(process.env.SECRET, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const postSchema = {
   heading: String,
   content: String,
    imag: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/" , function(req,res){
  Post.find({}, function(err, foundItems){
    if(err){console.log(err);}
    else{
      res.render("home" , {text: homeStartingContent , posts: foundItems});
    }
  })
})

app.get("/about" , function(req,res){
  res.render("about" , {text: aboutContent});
})

app.get("/contact" , function(req,res){
  res.render("contact" , {text: contactContent});
})

app.get("/compose" , function(req,res){
  res.render("compose");
})

app.post("/compose" , function(req,res){
  const post = new Post ({
     heading: req.body.Heading,
     content: req.body.Body,
    imag : req.body.Image
   });
   post.save(function(err){
     if (!err){
       res.redirect("/");
     }
   });

  // const post = {
  //   heading : req.body.Heading,
  //   content : req.body.Body
  // }
  // arr.push(post);
  // res.redirect("/");
})

app.get("/posts/:val" , function(req,res){
  // arr.forEach(function(Post){
  //   if( _.lowerCase(req.params.val) == _.lowerCase(Post.heading) ){
  //     res.render("post" , {heading: Post.heading , text : Post.content});
  //   }
  // })

  Post.findOne({_id: req.params.val}, function(err, foundItem){
    if(!err){
      res.render("post" , {heading: foundItem.heading , text : foundItem.content , imag : foundItem.imag});
    }
  })

})



let port = process.env.PORT;
if(port===null || port==""){
  port=3000;
}

app.listen(3000, function() {
  console.log("Server started");
});
