const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

exports.generateRecommendations = require("./generateRecommendations").
    generateRecommendations;
exports.generateQuiz = require("./generateQuiz").generateQuiz;
exports.analyzeResume = require("./analyzeResume").analyzeResume;
