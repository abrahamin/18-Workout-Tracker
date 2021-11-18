const router = require("express").Router();
const db = require("../models/model.js");
const path = require("path");

router.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/index.html"))
);

router.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/exercise.html"));
});

router.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/stats.html"));
});

router.get("/api/workouts", (req, res) =>
  db.Workout.aggregate([
    {
      $addFields: { totalDuration: { $sum: "$exercises.duration" } },
    },
  ])
    .then((workout) => res.json(workout))
    .catch((err) => res.status(400).json(err))
);

router.put("/api/workouts/:id", (req, res) =>
  db.Workout.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { exercises: req.body } }
  )
    .then((workout) => res.json(workout))
    .catch((err) => res.status(400).json(err))
);

router.post("/api/workouts", ({ body }, res) => {
  db.Workout.create(body)
    .then((workout) => res.json(workout))
    .catch((err) => res.status(400).json(err));
});

router.get("/api/workouts/range", (req, res) =>
  db.Workout.aggregate([
    {
      $addFields: { totalDuration: { $sum: "$exercises.duration" } },
    },
  ])
    .limit(7)
    .then((workout) => res.json(workout))
    .catch((err) => res.status(400).json(err))
);

module.exports = router;
