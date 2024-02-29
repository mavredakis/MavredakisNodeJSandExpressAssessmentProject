const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Mavredakis for Task10
const axios = require('axios').default;

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  }
  else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Mavredakis Task6 Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    }
    else {
      return res.status(404).json({message: "User already exists!"});    
    }
  }
  else
    return res.status(404).json({message: "Please provide password as well as username!"});   
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Mavredakis Task1 Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books,null,4))  
});

//Mavredakis for Task10
const getBooksData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    // Handle response
    console.log(response.data);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
};
getBooksData();

//Mavredakis for Task11
const getBooksDataByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    // Handle response
    console.log(response.data);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
};
getBooksDataByISBN(3);

//Mavredakis for Task12
const getBooksDataByAuthor = async (author) => {
  //console.log(author);
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    // Handle response
    console.log(response.data);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
};
getBooksDataByAuthor("Chinua Achebe");

//Mavredakis for Task13
const getBooksDataByTitle = async (title) => {
  //console.log(title);
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    // Handle response
    console.log(response.data);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
};
getBooksDataByTitle("Fairy tales");

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Mavredakis Task2 Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Mavredakis Task3 Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;    
  
  //for (let i = 1; i <= 10; i++) {
  for (const [key, value] of Object.entries(books)) {
    //const book = books[i];    
    const book = books[key];     
    if (author === book.author){      
      //console.log(`Book ${i}: ${book.title} by ${book.author}`);
      //res.send(books[i]);
      res.send(books[key]);
    }       
  }
  res.send("Author does not exist");    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  //Mavredakis Task4 Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  
  for (const [key, value] of Object.entries(books)) {
    //const book = books[i];
    const book = books[key];    
    if (title === book.title)
      //console.log(`Book ${i}: ${book.title} by ${book.author}`);
      //res.send(books[i]);
      res.send(books[key]);
      //break;
    //else
      //res.send("Title does not exist");    
  }
  res.send("Title does not exist"); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Mavredakis Task5 Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;  
  for (const [key, value] of Object.entries(books)) {
    if (key === isbn){
      //console.log(`Book ${i}: ${book.title} by ${book.author}`);      
      res.send(value.reviews);
    }
  }
  res.send("ISBN does not exist");
});

module.exports.general = public_users;
