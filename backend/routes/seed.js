const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');

router.post('/', async (req, res) => {
  try {
    await Course.deleteMany({});
    await Quiz.deleteMany({});
    
    const courses = await Course.insertMany([
      {
        title: "Full Stack React Mastery",
        category: "Web Development",
        level: "Advanced",
        rating: 4.9,
        students: "12k",
        price: 89.99,
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        desc: "Build highly scalable, production-ready web applications with React, Node.js, and modern tools. Learn by building real-world projects.",
        learningKey: "react",
        lessons: [
          { title: "1. Welcome to the course", duration: "05:00", videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0", order: 1 },
          { title: "2. React Basics & Setup", duration: "15:00", videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8", order: 2 },
          { title: "3. Introduction to React Hooks", duration: "25:00", videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0", order: 3 },
          { title: "4. useState Deep Dive", duration: "20:00", videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0?start=600", order: 4 },
          { title: "5. useEffect Lifecycle", duration: "30:00", videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U", order: 5 }
        ]
      },
      {
        title: "Python for Data Science",
        category: "Data Science",
        level: "Beginner",
        rating: 4.8,
        students: "25k",
        price: 74.99,
        img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
        desc: "Learn Python programming and explore data analysis, visualization, and machine learning techniques.",
        learningKey: "python",
        lessons: [
          { title: "1. Setting up Environment", duration: "08:00", videoUrl: "https://www.youtube.com/embed/YYXdXT2l-Gg", order: 1 },
          { title: "2. Intro to Pandas", duration: "35:00", videoUrl: "https://www.youtube.com/embed/dcqPhpY7tWk", order: 2 },
          { title: "3. Data Cleaning", duration: "28:00", videoUrl: "https://www.youtube.com/embed/bDhvCp3_lYw", order: 3 },
          { title: "4. Matplotlib Basics", duration: "20:00", videoUrl: "https://www.youtube.com/embed/3Xc3CA655Ls", order: 4 },
          { title: "5. Machine Learning Intro", duration: "45:00", videoUrl: "https://www.youtube.com/embed/7eh4d6sabA0", order: 5 }
        ]
      },
      {
        title: "UI/UX Design Essentials",
        category: "UI/UX Design",
        level: "Beginner",
        rating: 4.7,
        students: "15k",
        price: 59.99,
        img: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80",
        desc: "Master the principles of user interface and user experience design to create beautiful, functional products.",
        learningKey: "css",
        lessons: [
          { title: "1. Intro to Flexbox", duration: "10:00", videoUrl: "https://www.youtube.com/embed/K74l26pE4YA", order: 1 },
          { title: "2. Advanced Flexbox Patterns", duration: "22:00", videoUrl: "https://www.youtube.com/embed/u044iM9xsWU", order: 2 },
          { title: "3. CSS Grid Basics", duration: "18:00", videoUrl: "https://www.youtube.com/embed/jV8B24rSN5o", order: 3 },
          { title: "4. Responsive Design", duration: "25:00", videoUrl: "https://www.youtube.com/embed/srvUrASNj0s", order: 4 },
          { title: "5. CSS Animations", duration: "15:00", videoUrl: "https://www.youtube.com/embed/YszONjKpgg4", order: 5 }
        ]
      },
      {
        title: "Advanced Node.js Patterns",
        category: "Web Development",
        level: "Advanced",
        rating: 4.9,
        students: "8k",
        price: 99.99,
        img: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&q=80",
        desc: "Deep dive into Node.js architecture, performance optimization, and enterprise-grade design patterns.",
        learningKey: "js",
        lessons: [
          { title: "1. Closures and Scope", duration: "15:00", videoUrl: "https://www.youtube.com/embed/vKJpN5FAeF4", order: 1 },
          { title: "2. Prototype Chain", duration: "25:00", videoUrl: "https://www.youtube.com/embed/MiKdMjcsFZ4", order: 2 },
          { title: "3. Async / Await", duration: "18:00", videoUrl: "https://www.youtube.com/embed/V_Kr9OSfDeU", order: 3 },
          { title: "4. The Event Loop", duration: "26:00", videoUrl: "https://www.youtube.com/embed/8aGhZQkoFbQ", order: 4 },
          { title: "5. Design Patterns", duration: "32:00", videoUrl: "https://www.youtube.com/embed/0T1yQ0dK1eA", order: 5 }
        ]
      }
    ]);
    
    const reactCourse = courses.find(c => c.learningKey === 'react');
    if (reactCourse) {
      await Quiz.create({
        title: "React Hooks Quiz",
        courseId: reactCourse._id,
        questions: [
          {
            question: "What is the primary purpose of the useState hook?",
            options: [
              "To handle side effects in functional components",
              "To add state to functional components",
              "To optimize performance",
              "To navigate between routes"
            ],
            correct: 1
          },
          {
            question: "Which hook would you use to perform a side effect like fetching data?",
            options: [
              "useState",
              "useContext",
              "useEffect",
              "useReducer"
            ],
            correct: 2
          },
          {
            question: "What must you pass as the second argument to useEffect to run it only once?",
            options: [
              "The component name",
              "An empty array []",
              "null",
              "The state variable"
            ],
            correct: 1
          },
          {
            question: "Can you use Hooks inside a class component?",
            options: [
              "Yes, always",
              "Yes, but only useState",
              "No, hooks are only for functional components",
              "Only in specific React versions"
            ],
            correct: 2
          },
          {
            question: "What is the correct way to update state using useState?",
            options: [
              "state = newValue",
              "setState(newValue)",
              "updateState(newValue)",
              "this.setState(newValue)"
            ],
            correct: 1
          }
        ],
        timer: 120
      });
    }
    
    res.json({ message: 'Database seeded successfully!' });
  } catch (err) {
    console.error('Seeding error:', err);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

module.exports = router;
