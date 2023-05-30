//Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

const bcrypt = require('bcrypt');

let userArgs = process.argv.slice(2);

if (userArgs.length < 2) {
  throw new Error('Must provide 2 Arguments: an email address and password for Admin.');
}

// let username = userArgs[0];
// let password = userArgs[1];

let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');
let User = require('./models/users');
let Comment = require('./models/comments');

let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.dropDatabase();

function userCreate(username, email, password, isAdmin, created_at, reputation) {
  let user = new User({
    username: username,
    email: email,
    password: password,
    isAdmin: isAdmin,
    created_at: created_at,
    reputation: reputation,
  });
  return user.save();
}

function tagCreate(name, user) {
  let tag = new Tag({
    name: name,
    created_By: user,
  });
  return tag.save();
}

function questionCreate(title, summary, text, tags, answers, asked_by, ask_date_time, views, votes, comments) {
  let question = new Question({
    title: title,
    summary: summary,
    text: text,
    tags: tags,
    answers: answers,
    asked_by: asked_by,
    ask_date_time: ask_date_time,
    views: views,
    votes: votes,
    comments: comments,
  });
  return question.save();
}

function answerCreate(text, ans_by, ans_date_time, votes, comments) {
  let answer = new Answer({
    text: text,
    ans_by: ans_by,
    ans_date_time: ans_date_time,
    votes: votes,
    comments: comments,
  });
  return answer.save();
}

function commentCreate(text, com_by, com_date_time, votes) {
  let comment = new Comment({
    text: text,
    com_by: com_by,
    com_date_time: com_date_time,
    votes: votes,
  });

  return comment.save();
}

// Finctions used to populate
const keywords = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Angular',
  'Vue.js',
  'jQuery',
  'Bootstrap',
  'SASS',
  'Webpack',
  'Gulp',
  'Grunt',
  'Git',
  'Responsive',
  'Accessibility',
  'Testing',
  'Debugging',
  'Agile',
  'UI/UX',
  'Design',
];
const randomIndex = (list) => Math.floor(Math.random() * list.length);
const randomWord = (li) => li[randomIndex(li)];

const populate = async () => {
  // Create Admin
  const hashedPassword_admin = await bcrypt.hash(userArgs[1], 10);
  let admin_user = await userCreate(`Admin`, userArgs[0], hashedPassword_admin, true, new Date(), 1000);
  admin_user.save();

  // Create 3 users
  const users = [];
  const reputations = [0, 40, 70];
  for (let i = 1; i <= 3; i++) {
    const username = `user${i}`;
    const email = `user${i}@gmail.com`;
    const password = 'abc123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = false;
    const created_at = new Date();
    const reputation = reputations[i - 1];
    let user = await userCreate(username, email, hashedPassword, isAdmin, created_at, reputation);
    users.push(user);
  }

  // Create 10 Tags
  const tagss = [];
  for (let i = 0; i < 10; i++) {
    let tag = await tagCreate(`tag${i}`, users[i % 3]);
    tagss.push(tag);
  }

  function randomUniqueTags() {
    const tags = [];
    while (tags.length < 3) {
      const tag = randomWord(tagss);
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    return tags;
  }

  const comments = [];
  for (let i = 0; i < 14; i++) {
    const text = `Comment ${i} ${randomWord(keywords)} ${randomWord(keywords)} `;
    const com_by = randomWord(users);
    const com_date_time = new Date();
    const votes = 0;
    const comment = await commentCreate(text, com_by, com_date_time, votes);
    comments.push(comment);
  }

  async function comCreateMany() {
    const comments = [];
    for (let i = 0; i < 4; i++) {
      const text = `Comment ${i} ${randomWord(keywords)} ${randomWord(keywords)} `;
      const com_by = randomWord(users);
      const com_date_time = new Date();
      const votes = 0;
      const comment = await commentCreate(text, com_by, com_date_time, votes);
      comments.push(comment);
    }
    return comments;
  }

  // Create 24 Amswers
  const answers = [];
  for (let i = 0; i < 24; i++) {
    const text = `Answer ${i} ${randomWord(keywords)} ${randomWord(keywords)} `;
    const ans_by = randomWord(users);
    const ans_date_time = new Date();
    const votes = 0;
    const comments_a = await comCreateMany();
    const answer = await answerCreate(text, ans_by, ans_date_time, votes, comments_a);
    answers.push(answer);
  }

  function getRandomRange(min, max) {
    let range = [];
    let randomStart = Math.floor(Math.random() * (max - min + 1)) + min;
    let randomEnd = Math.floor(Math.random() * (max - randomStart + 1)) + randomStart;
    range.push(randomStart);
    range.push(randomEnd);
    return range;
  }

  // Create 45 instances of Question
  const questions = [];
  for (let i = 1; i <= 45; i++) {
    const title = `Question ${i}: ${randomWord(keywords)} ${randomWord(keywords)} `;
    const summary = `Summary of question ${i} ${randomWord(keywords)}`;
    const text = `Text of question ${i} ${randomWord(keywords)} ${randomWord(keywords)} ${randomWord(keywords)}`;
    const tags_q = randomUniqueTags();
    const answers_q = [];
    let [min, max] = getRandomRange(0, answers.length);
    for (let i = min; i < max; i++) {
      answers_q.push(answers[i]);
    }
    const asked_by = randomWord(users);
    const ask_date_time = new Date();
    const views = i % 5;
    const votes = 0;
    const comments_q = [randomWord(comments), randomWord(comments), randomWord(comments), randomWord(comments)];
    const question = await questionCreate(
      title,
      summary,
      text,
      tags_q,
      answers_q,
      asked_by,
      ask_date_time,
      views,
      votes,
      comments_q
    );
    questions.push(question);
  }

  if (db) db.close();
  console.log('done');
};

populate().catch((err) => {
  console.log('ERROR: ' + err);
  if (db) db.close();
});

console.log('processing ...');
