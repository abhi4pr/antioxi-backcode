const express = require('express');
const router = express.Router();
const users = require('./controllers/users.js');
const feedback = require('./controllers/feedback.js');
const posts = require('./controllers/posts.js');
const questions = require('./controllers/questions.js');
const quotes = require('./controllers/quotes.js');
const audios = require('./controllers/audios.js');
const tasks = require('./controllers/tasks.js');
const videos = require('./controllers/videos.js');
const reward = require('./controllers/rewards.js');
const taskStatus = require('./controllers/taskStatus.js');
const moods = require('./controllers/moods.js');
const journals = require('./controllers/journals.js');
const journey = require('./controllers/journey.js');
const token = require('./token.js');
const { upload, fileUpload } = require('./fileUpload');

router.get("/", (req, res) => {
  res.send({ message: "Welcome to my application." });
});

router.post("/add_user", upload.single('user_image'), users.addUser);
router.get("/get_single_user", users.getSingleUser);
router.get("/get_all_users", users.getAllUsers);
router.put("/update_user", upload.single('user_image'), users.updateUser);
router.post("/login_user", users.loginUser);
router.delete("/delete_user", users.deleteUser);
// router.post("/send_otp", users.sendOtp);
// router.post("/verify_otp", users.verifyOtp);

router.post("/add_feedback", upload.single('feedback_image'), fileUpload, feedback.addFeedback);
router.get("/get_single_feedback", feedback.getSingleFeedback);
router.get("/get_all_feedbacks", feedback.getAllFeedbacks);
router.delete("/delete_feedback", feedback.deleteFeedback);

router.post("/add_post", upload.single('post_image'), fileUpload, posts.addPost);
router.get("/get_single_post/:postId", posts.getSinglePost);
router.get("/get_all_posts", posts.getAllPosts);
router.put("/update_post/:postId", upload.single('post_image'), fileUpload, posts.updatePost);
router.delete("/delete_post/:postId", posts.deletePost);
router.post("/add_like", posts.addLike);
router.post("/add_comment", posts.addComment);
router.get("/get_all_comments/:postId", posts.getPostComments);

router.post("/add_question", questions.addQuestion);
router.get("/get_single_question/:questionId", questions.getSingleQuestion);
router.get("/get_all_questions", questions.getAllQuestions);
router.put("/update_question/:questionId", questions.updateQuestion);
router.delete("/delete_question/:questionId", questions.deleteQuestion);

router.post("/add_quote", upload.single('quote_img'), fileUpload, quotes.addQuote);
router.get("/get_single_quote/:quoteId", quotes.getSingleQuote);
router.get("/get_all_quotes", quotes.getAllQuotes);
router.put("/update_quote/:quoteId", upload.single('quote_img'), fileUpload, quotes.updateQuote);
router.delete("/delete_quote/:quoteId", quotes.deleteQuote);

router.post("/add_task", tasks.addTask);
router.get("/get_single_task/:taskId", tasks.getSingleTask);
router.get("/get_all_tasks", tasks.getAllTasks);
router.put("/update_task/:taskId", tasks.updateTask);
router.delete("/delete_task/:taskId", tasks.deleteTask);

router.post("/add_video", upload.single('video_src'), fileUpload, videos.addVideo);
router.get("/get_single_video/:videoId", videos.getSingleVideo);
router.get("/get_all_videos", videos.getAllVideos);
router.put("/update_video/:videoId", upload.single('video_src'), fileUpload, videos.updateVideo);
router.delete("/delete_video/:videoId", videos.deleteVideo);

router.post("/add_reward", upload.single('reward_logo'), fileUpload, reward.addReward);
router.get("/get_single_reward/:rewardId", reward.getSingleReward);
router.get("/get_all_rewards", reward.getAllRewards);
router.put("/update_reward/:rewardId", upload.single('reward_logo'), fileUpload, reward.updateReward);
router.delete("/delete_reward/:rewardId", reward.deleteReward);

router.post("/add_audio", upload.single('audio_file'), fileUpload, audios.addAudio);
router.get("/get_single_audio/:audioId", audios.getSingleAudio);
router.get("/get_all_audios", audios.getAllAudio);
router.put("/update_audio/:audioId", upload.single('audio_file'), fileUpload, audios.updateAudio);
router.delete("/delete_audio/:audioId", audios.deleteAudio);

router.post("/add_journal", journals.addJournal);
router.get("/get_single_journal/:userId", journals.getSingleJournal);
router.put("/update_journal/:journalId", journals.updateJournal);

router.post("/add_mood", moods.addMood);
router.get("/get_single_mood/:userId", moods.getSingleMood);
router.get("/get_all_moods/:userId", moods.getUserMoodsByMonth);

router.get("/get_tasks/:userId", taskStatus.getUserTaskStatuses);
router.put("/update_task_status/:taskId/:userId", taskStatus.updateTaskStatus);

router.get("/user/progress/:userId", journey.getUserProgress);
router.get("/get_all_checkpoints", journey.getAllCheckpoints);
router.get("/get_checkpoints/:userId", journey.getCheckpointUserid);
router.get("/checkpoint/:checkpoint_id/:user_id", journey.checkpointWithUser);
router.put("/checkpoint/video-shown", journey.updateVideoSeen);
router.put("/checkpoint/description-shown", journey.updateDescSeen);
router.put("/checkpoint/complete-tasks", journey.updateTasksDone);
router.put("/checkpoint/unlock-next", journey.unLockNextCheckpoint)
router.get("/checkpoint_details/:_id", journey.getCheckpointDetails);

module.exports = router;