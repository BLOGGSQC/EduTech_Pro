// scripts/seedDatabase.js
require('dotenv').config();
const mongoose = require('mongoose');

// ✅ Import models
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const ClassModel = require('../models/Class');
// If you have a Parent model, uncomment and use it:
// const Parent = require('../models/Parent');

async function seed() {
  try {
    console.log('🌱 Connecting to database...');

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('❌ MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.MONGODB_DB_NAME || 'edutech-pro',
    });

    console.log('✅ Connected to MongoDB');

    // 🧹 Clear old data
    await Promise.all([
      User.deleteMany({}),
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      Subject.deleteMany({}),
      ClassModel.deleteMany({}),
      // If you have Parent model: await Parent.deleteMany({})
    ]);
    console.log('🧹 Old data cleared');

    // ✅ Create Users (with plain text passwords; pre-save hook will hash them)
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@edutech-pro.com',
      password: 'Admin123!', // matches demo credentials
      role: 'admin',
      phone: '+254700000001',
      isEmailVerified: true
    });

    const teacherUser = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah.johnson@edutech-pro.com',
      password: 'Teacher123!', // matches demo credentials
      role: 'teacher',
      phone: '+254700000002',
      isEmailVerified: true
    });

    const studentUser = await User.create({
      name: 'John Smith',
      email: 'john.smith@student.edutech-pro.com',
      password: 'Student123!', // matches demo credentials
      role: 'student',
      phone: '+254700000003',
      isEmailVerified: true
    });

    const parentUser = await User.create({
      name: 'Robert Smith',
      email: 'robert.smith@parent.edutech-pro.com',
      password: 'Parent123!', // matches demo credentials
      role: 'parent',
      phone: '+254700000004',
      isEmailVerified: true
    });

    // ✅ Create Teacher Profile
    const teacherProfile = await Teacher.create({
      user: teacherUser._id,
      employeeId: 'EMP250001',
      department: 'Science',
      position: 'Physics Teacher',
      joiningDate: new Date(),
      salary: {
        basic: 40000,
        allowances: 5000,
        deductions: 2000
      }
    });

    // ✅ Create Subject
    const physicsSubject = await Subject.create({
      name: 'Physics',
      code: 'PHY101',
      description: 'Introduction to Physics',
      department: 'Science',
      credits: 3,
      grade: 'Grade 10',
      academicYear: '2024-2025',
      teachers: [
        {
          teacher: teacherProfile._id,
          classes: [],
        }
      ],
      schedule: {
        hoursPerWeek: 4,
        totalHours: 60,
        practicalHours: 10
      }
    });

    // ✅ Create Class
    const classDoc = await ClassModel.create({
      name: 'Physics Class A',
      grade: 'Grade 10',
      section: 'A',
      academicYear: '2024-2025',
      classTeacher: teacherProfile._id,
      capacity: 30,
      subjects: [
        {
          subject: physicsSubject._id,
          teacher: teacherProfile._id
        }
      ],
      room: {
        number: '101',
        building: 'Main',
        floor: '1',
        capacity: 35,
        facilities: ['Projector', 'Whiteboard']
      },
      schedule: {
        startTime: '08:00',
        endTime: '14:00',
        breakTimes: [
          { name: 'Short Break', startTime: '10:00', endTime: '10:15' },
          { name: 'Lunch Break', startTime: '12:00', endTime: '12:30' }
        ]
      },
      performance: {
        averageGrade: 75,
        attendanceRate: 90,
        passRate: 85
      },
      fees: {
        tuitionFee: 10000,
        labFee: 2000,
        libraryFee: 1000,
        miscellaneousFee: 500
      }
    });

    // ✅ Create Student Profile
    await Student.create({
      user: studentUser._id,
      studentId: 'STU250001',
      class: classDoc._id,
      rollNumber: '01',
      section: 'A',
      academicYear: '2024-2025',
      admissionDate: new Date(),
      attendance: {
        totalDays: 100,
        presentDays: 90
      },
      fees: {
        totalAmount: 13500,
        paidAmount: 5000,
      }
    });

    // ✅ (Optional) Create Parent Profile if model exists
    // await Parent.create({
    //   user: parentUser._id,
    //   children: [studentUser._id],
    //   phoneNumber: '+254700000004'
    // });

    console.log('✅ Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
