// Routing to /posts/tags
const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Tags = require('../models/tags');

// returns all tags
router.get('/', async (req, res) => {
  try {
    const result = await Tags.find().exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Converts tag_name (string) into tag_id
router.get('/:tag', async (req, res) => {
  const tag = req.params.tag;
  try {
    const result = await Tags.find({ name: tag }).exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Converts tag_id into tag_name (string)
router.get('/tag_id/:tag_id', async (req, res) => {
  const tag_id = req.params.tag_id;
  try {
    const result = await Tags.findById(tag_id).exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/tag_id/:tag_id/questions', async (req, res) => {
  const tag_id = req.params.tag_id;
  try {
    const result = await Questions.find({ tags: tag_id }).exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/getUser/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const result = await Tags.find({ created_By: user_id }).exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

const auth = require('../middleware/auth');

router.put('/modify/:tag_id', auth, async (req, res) => {
  const tag_id = req.params.tag_id;
  let tag_name = req.body.name;

  tag_name = tag_name.toLowerCase();
  if (tag_name.length > 10 || tag_name.length < 1) {
    res.send('Error tag cannot be more than 10 characters or less than 1 character');
    return;
  }

  try {
    const tagObj = await Tags.find({ _id: tag_id }).exec();
    // makes sure that it's the owner of the tag
    if (tagObj[0].created_By.toString() !== req.session.user.userId && !req.session.user.isAdmin) {
      res.send('Error you are not the owner of this tag');
      return;
    }

    // makes sure that no other user is using this tag
    const questionUsingTag = await Questions.find({ tags: tag_id }).exec();
    for (let i = 0; i < questionUsingTag.length; i++) {
      if (questionUsingTag[i].asked_by.toString() !== tagObj[0].created_By.toString()) {
        res.send('Error another user is using this tag');
        return;
      }
    }

    // updates the tag
    const result = await Tags.updateOne({ _id: tag_id }, { $set: { name: tag_name } }).exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/delete/:tag_id', auth, async (req, res) => {
  const tag_id = req.params.tag_id;
  try {
    const tagObj = await Tags.find({ _id: tag_id }).exec();
    // makes sure that it's the owner of the tag
    if (tagObj[0].created_By.toString() !== req.session.user.userId && !req.session.user.isAdmin) {
      res.send('Error you are not the owner of this tag');
      return;
    }

    // makes sure that no other user is using this tag
    const questionUsingTag = await Questions.find({ tags: tag_id }).exec();
    for (let i = 0; i < questionUsingTag.length; i++) {
      if (questionUsingTag[i].asked_by.toString() !== tagObj[0].created_By.toString()) {
        res.send('Error another user is using this tag');
        return;
      }
    }

    // deletes the tag
    await Tags.deleteOne({ _id: tag_id }).exec();
    // deletes the tag from all questions
    await Questions.updateMany({}, { $pull: { tags: tag_id } }).exec();
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
