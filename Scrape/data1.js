require( "dotenv" ).config();

const email = {
  service: process.env.SERVICE,
  auth: {
    user: process.env.USEREMAIL,
    pass: process.env.PASSWORDEMAIL
  },
  from: process.env.USEREMAIL,
  to: process.env.TO,
  subject: "A new evidence was found",
  text: "Check it on the website",
  text2: `<a href="https://www.sitepoint.com/create-new-express-js-apps-with-express-generator/">Check it on the website</a>`
};
const DanyURL = 'https://www.mainpi.com/query?i=548' ;
const pageURL = 'https://tw.news.yahoo.com/?guccounter=1' ;//"http://ppgcc.posgrad.ufsc.br/cursos/";
const mongoURI = process.env.MONGOURI;
// let MONGOURI='mongodb+srv://howard:224568@webscraping.80yjw.mongodb.net/591Rent?retryWrites=true&w=majority'
module.exports = {
email,
pageURL,
DanyURL
};