var express = require("express");
var app = express();
var bodyParser=require("body-parser");
var methodOverride = require('method-override');
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//mongoose.connect('mongodb://localhost/RESTapp');
mongoose.connect('mongodb://sumanth:bhlv0304@ds217349.mlab.com:17349/blogapp');

var blogSchema= new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog", blogSchema);

 /*Blog.create({
    title:"test_blog",
    image:"https://images.unsplash.com/photo-1519631347231-c061f6b24554?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3dd0b8c3f987aca4615c2150864b3eb2&auto=format&fit=crop&w=934&q=80",
    body:"hello this is a blog post"
}); */
app.get("/",(req,res)=>{
    res.redirect("/blogs");
});
app.get("/blogs/new",(req,res)=>{
    res.render("new");
});

app.post("/blogs", function(req, res){
	
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{

        if(err) throw err;
        else{
            res.render("index",{blogs:blogs});
        }

    });
   
});
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	})//id, newdata, callback
});


app.delete("/blogs/:id", function(req, res){
	
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	})
	
})


















app.listen(3000,()=>{console.log("server is running on port 3000");});