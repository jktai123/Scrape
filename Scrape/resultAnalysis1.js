const notifyUser = require("./email");
const data = require("./data1");
//const {  mongoURI } = data;
const { email, mongoURI } = data;
const mongoURI2='mongodb+srv://howard:224568@webscraping.80yjw.mongodb.net/591Rent?retryWrites=true&w=majority'
const mongoose = require("mongoose");
//useNewUrlParser: true  useUnifiedTopology: true
mongoose
  .connect(mongoURI2, {useNewUrlParser: true  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const compareAndSaveResults = dataObj => {
  try {
    const News2 = require("./models/News2");

    News2.find({}, function(err, newsList) {
      return newsList;
    })
      .then(newsList => {
        if (newsList == "") {
          console.log(`A new data was created:\n${JSON.stringify(dataObj)}`);
          const newNews = new News2(dataObj);
          return newNews.save().catch(err => console.log(err));
        }

        const { amount, publishedNews } = dataObj;

        const dbId = newsList[0]._id;
        const dbAmount = newsList[0].amount;
        const dbNews = newsList[0].publishedNews;
      //  const dbLink = newsList[0].publishedNews.link;
        

        let catchDifference = false;
        if(amount!==0){
        if (dbAmount !== amount) {
          catchDifference = true;
        } else {
          dbNews.forEach((news, i) => {
          	 console.log(`news-> ${news.News} publishedNews[${i}]==>${publishedNews[i].News} ` );
            if (news.News !== publishedNews[i].News) catchDifference = true;
          });
        }
      }
        if (catchDifference) {
          console.log("A new evidence was found, updating database...");
          notifyUser(email, publishedNews);
          mongoose.set('useFindAndModify', false);
          return News2.findOneAndUpdate({ _id: dbId }, dataObj);
        }

        console.log("File is equal to page, no news to report");
      })
      .then(() => {
        mongoose.disconnect();
      })
      .catch(err => console.log(err));
  } catch (err) {
    console.error(err);
  }
};

module.exports = compareAndSaveResults;
