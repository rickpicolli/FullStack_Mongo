var mongoose = require("mongoose");
var Note = require("./Note");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required, is unique and of type String
  title: {
    type: String,
    unique: true,
    required: true
  },
  //a small `summary` about the article, required and of type String
  summary: {
  	type: String,
  	required: true
  },
  // `link` of type String
  link: {
    type: String,
  },
  // `saved` article of type Boolean and default false
  saved: {
  	type: Boolean,
  	default: false
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;