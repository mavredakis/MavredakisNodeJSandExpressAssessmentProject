const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let loggedInUser;

const isValid = (username)=>{ //returns boolean
  //Mavredakis write code to check is the username is valid
  let validusername = users.filter((user)=>{
    return (user.username === username)// && user.password === password)
  });
  if(validusername.length > 0){
    console.log("Valid username");
    return true;
  } else {
    console.log("Invalid username");
    return false;
  }
}
//Mavredakis TODO check how to apply filterIndex on Objects instead of Arrays
const doesExist = (username, isbn)=>{
  for (const [key, value] of Object.entries(books)) {
    let userswithsamename = Object.values(books[key].reviews).filter((user)=>{
      //console.log("username " + username + " user.username " + user.username);      
      return user.username === username && isbn === key
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //Mavredakis write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    console.log("Username & pass correct");    
    return true;
  } else {
    console.log("Username & pass correct");
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Mavredakis Task7 Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    loggedInUser = username;
    return res.status(200).send(`User ${username} successfully logged in`);
  }
  else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Mavredakis Task8 Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const currentUser = req.user;
  console.log(currentUser);     
  const isbn = req.params.isbn;
  let  isbntomodify = books[isbn]
  //let username = req.body.username;
  let review = req.body.review;
  
  if (isbntomodify) {  
                
      for (const [key, value] of Object.entries(books)) {
        if (value.reviews) {         
          
          const newReview = {
            username: loggedInUser,//.session.authenticatedUser,
            review: review            
          };          

          if (!doesExist(loggedInUser, isbn)){
            //books[key].reviews = newReview;
            books[isbn].reviews = newReview;
            res.send(`Review for ISBN  ${isbn} added by user ${loggedInUser}.`);            
          }
          else {
            let index = books[key].reviews.indexOf(loggedInUser);
            books[isbn].reviews.splice(index,1);
            books[isbn].reviews = newReview;
            //books[key].reviews.splice(index,1);
            //books[key].reviews = newReview;
            res.send(`Review for ISBN  ${isbn} updated by user ${loggedInUser}.`);            
          }             
        }        
      }
  }
  else{
      res.send("Unable to find ISBN!");
  }
  
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Mavredakis for Task9
  const isbn = req.params.isbn;
  //const user = loggedInUser;
  if (isbn && books[isbn].reviews.username === loggedInUser){
    delete books[isbn].reviews.review
  }
  res.send(`Book review for isbn with the isbn  ${isbn} deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
