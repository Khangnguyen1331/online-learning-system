// models/course.model.js
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    imageUrl: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    price: {
      type: Number,
      required: function() { return this.isPremium; }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  // Thêm virtual fields để dễ dàng lấy bài học liên quan
  courseSchema.virtual('videoLessons', {
    ref: 'VideoLesson',
    localField: '_id',
    foreignField: 'courseId'
  });
  
  courseSchema.virtual('theoryLessons', {
    ref: 'TheoryLesson',
    localField: '_id',
    foreignField: 'courseId'
  });