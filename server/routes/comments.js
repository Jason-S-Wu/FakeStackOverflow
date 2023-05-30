// Routing to /posts/comments
const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Answers = require('../models/answers');
const Users = require('../models/users');
const Comments = require('../models/comments');

const auth = require('../middleware/auth');

router.use(auth); // ANYTHING BELOW THIS WILL REQUIRE AUTHENTICATION

router.post('/addComment', async (req, res) => {
  const commentType = req.body.commentType;
  const toId = req.body.toId;
  let newCommentInput = req.body;
  newCommentInput.com_by = req.session.user.userId; // do not trust the client to send the user id via post request

  const user = await Users.findById(newCommentInput.com_by).exec();

  if (user.reputation < 50) {
    res.send('User reputation too low');
    return;
  }

  if (newCommentInput.text.length === 0 || newCommentInput.text.length > 140) {
    res.send('Comment must be between 1 and 140 characters');
    return;
  }

  try {
    const newComment = new Comments({
      text: newCommentInput.text,
      com_by: newCommentInput.com_by,
    });
    await newComment.save();

    if (commentType === 'question') {
      const question = await Questions.findById(toId).exec();
      await addCommentToQuestion(newComment, question);
      res.send('success');
    }
    if (commentType === 'answer') {
      const answer = await Answers.findById(toId).exec();
      await addCommentToAnswer(newComment, answer);
      res.send('success');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

async function addCommentToQuestion(comment, question) {
  question.comments.push(comment._id);
  await question.save();
}

async function addCommentToAnswer(comment, answer) {
  answer.comments.push(comment._id);
  await answer.save();
}

module.exports = router;
