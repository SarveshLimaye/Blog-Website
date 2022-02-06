require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const methodOverride=require("method-override");

const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.get("/",(req,res)=>{
   res.redirect("/blogs");
})

mongoose.connect(process.env.url)

const blogSchema= new mongoose.Schema({
    title:String,
    username:String,
    desc:String
})

const Blog = mongoose.model("blogs",blogSchema);

app.get("/blogs",async (req,res)=>{
    const blogs=await Blog.find();
    res.render("index.ejs",{blogs:blogs});
})

app.get("/new-blog",(req,res)=>{
    const blog={title:"",username:"",desc:""};
    res.render("new_blog.ejs",{blog:blog});
})

app.post("/new-blog",async(req,res)=>{

    const blog=await Blog.findOne({title:req.body.title});

    if(blog)
    {
       Blog.updateOne({title:req.body.title},{desc:req.body.desc},function(err){
           if(err)
           {
               console.log(err);
           }
       })
    }
    else
    {
        const currBlog=new Blog({
            title:req.body.title,
            desc:req.body.desc,
            username:req.body.username
        })
        currBlog.save();
    }
    // console.log(req.body);
    // res.send("Done")
    res.redirect("/blogs");
})

app.delete("/blogs/:id",async (req,res)=>{
    const id=req.params.id;
    await Blog.findByIdAndDelete(id);
    res.redirect("/blogs");
})

app.patch("/blogs/:id",async (req,res)=>{
    const blog=await Blog.findOne({id:req.params.id});
    res.render("new_blog.ejs",{blog:blog});
})

app.listen(5000,()=>{
    console.log("Server started at localhost 5000");
})
