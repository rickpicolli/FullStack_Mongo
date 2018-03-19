//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require('request');

// Require all models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var PORT = process.env.PORT || 3000

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//handlebars
var exphbs = require('express-handlebars');
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// parse application/json
app.use(bodyParser.json());

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;



// Connect to localhost if not a production environment
if(process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI);
}

else{
  mongoose.connect('mongodb://localhost/news');
}


// Routes

// A GET route for scraping the echojs website
app.get("/", function(req, res) {
  Article.find({"saved": false}, function(error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

app.get("/saved", function(req, res) {
  Article.find({"saved": true}).populate("notes").exec(function(error, articles) {
    var hbsObject = {
      article: articles
    };
    res.render("saved", hbsObject);
  });
});


app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("https://www.nytimes.com/", function(error, response, html) {

    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("h2")
        .text();
        result.summary = $(this)
        .children(".summary")
        .text();
      result.link = $(this)
        .children("h2")
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, res) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(res);
          res.redirect("/");
        }
      });

    });
        res.send("Scrape Complete");
        res.redirect("/");

  });
  // Tell the browser that we finished scraping the text
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  Article
    .find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article
    .findOne({ "_id": req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


//send a article to saved articles
app.post("/articles/save/:id", function(req, res) {
	Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
	.then(function(saveToDb) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(saveToDb);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//delete a article from saved articles
app.post("/articles/delete/:id", function(req, res) {
	Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": []})
	.then(function(deleteFromDb) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(deleteFromDb);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


app.post("/notes/save/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  Note
    .create(req.body)
    .then(function(dbNote) {
      
      return Article.findOneAndUpdate({ "_id": req.params.id }, {$push: {"notes": dbNote._id }}, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
