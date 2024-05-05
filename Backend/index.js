const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require('mongoose');
const cors = require('cors');
// const {PORT} = require("./config.js");
const Book = require('./model/bookmodel.js');

const mongoURL = 'mongodb+srv://root:root1234@books.vmg1tag.mongodb.net/books-collection?retryWrites=true&w=majority&appName=Books'


app.use(express.json());
app.use(cors());


mongoose.connect(mongoURL)
.then(()=>{
console.log('App connected to database');
})
.catch((err)=>{
console.log(err);
});




app.get("/",(req,res)=>{
    res.send("Welcome");
})
// Route post the books in your database

app.post('/books',async(req,res)=>{
  try{
  if(!req.body.title || !req.body.author || !req.body.PublishYear){
    return res.status(400).send({
        message: 'Send all requires fields: title,author,PublishYear',
        });
  }
  const newBokk = {
 title: req.body.title,
 author: req.body.author,
 PublishYear:req.body.PublishYear,
  };
  const book = await Book.create(newBokk);

  return res.status(201).send(book);
  }
  catch(error){
  console.log(error.message);
  res.status(500).send({message : error.message
  });
  }
});
// Route for get all books

app.get("/books",async(req,res)=>{
  try{
    const books = await Book.find({});
    return res.status(200).json({
      count : books.length,
      data : books
    });
  } catch(error){
    console.log(error.message);
    res.status(500).send({message : error.message})

  }
})

// Route for get one Book from database

app.get("/books/:id",async(req,res)=>{
  try{
    const {id} = req.params;
    const books = await Book.findById(id);
    return res.status(200).json(books);
  } catch(error){
    console.log(error.message);
    res.status(500).send({message : error.message})

  }
})

app.put("/books/:id",async(req,res)=>{
   try{
    if(!req.body.title || !req.body.author || !req.body.PublishYear){
      return res.status(400).send({
          message: 'Send all requires fields: title,author,PublishYear',
          });
    }
    const {id} = req.params;
    const result = await Book.findByIdAndUpdate(id,req.body);

    if(!result){
      return res.status(404).json({message : 'Book not found'});
    }
    return res.status(200).send({message : 'Book updated Successfylly'});

   }catch(error){
    console.log(error.message);
    res.status(500).send({message:error.message});
   }
})
// Delet route
app.delete('/books/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const result = await Book.findByIdAndDelete(id);
    if(!result){
      return res.status(404).json({message : 'Book not found'});
    }
    return res.status(200).send({message : 'Book Deleted Successfylly'});

   
  }catch(error){
    console.log(error.message);
    res.status(500).send({message:error.message});
  }
})



app.listen(PORT,()=>{

    console.log(`App is listening to port: ${PORT}`);
})


