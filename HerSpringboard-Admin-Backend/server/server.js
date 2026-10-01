const cors = require('cors');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
require('dotenv').config();
//render code
const path = require('path');
//dotenv.config();
const app = express();
const port = 3002;
const corsOptions = {
  origin: 'https://her-springboard-admin.vercel.app',
  optionsSuccessStatus: 200,
  credentials: true,
};
// Get __dirname in ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
app.use(cors(corsOptions));
app.use(bodyParser.json());
AWS.config.update({
  region: process.env.AWS_REGION,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// ===== USERS =====



// ===============================
// GET ALL USERS
// ===============================
app.get('/users', async (req, res) => {
  const studentParams = {
    TableName: process.env.AWS_TABLE,
    ProjectionExpression:
      'userId, firstName, lastName, email, password, category, courseCompleted, coursesInProgress, emailVerified, isApproved',
  };

  const trainerParams = {
    TableName: process.env.AWS_TRAINER_TABLE,
    ProjectionExpression:
      'userId, firstName, lastName, email, password, emailVerified, isApproved, registerType',
  };

  try {
    const [studentData, trainerData] = await Promise.all([
      dynamoDb.scan(studentParams).promise(),
      dynamoDb.scan(trainerParams).promise(),
    ]);

    // Add category manually for trainers
    const trainerUsers = trainerData.Items.map((trainer) => ({
      ...trainer,
      category: 'trainer',
    }));

    const users = [
      ...studentData.Items,
      ...trainerUsers,
    ];

    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ===============================
// CREATE USER
// ===============================
app.post('/users', async (req, res) => {
  const {
    email,
    category,
    courseCompleted,
    coursesInProgress,
    emailVerified,
    firstName,
    gender,
    goal,
    hoursSpentThisWeek,
    lastName,
    password,
    profileUrl,
    registerType,
    skills,
  } = req.body;

  const newUser = {
    userId: uuidv4(),
    email,
    category,
    courseCompleted,
    coursesInProgress,
    emailVerified,
    firstName,
    gender,
    goal,
    hoursSpentThisWeek,
    lastName,
    password,
    profileUrl,
    registerType,
    skills,
  };

  const tableName =
    registerType?.toLowerCase() === 'trainer' ||
    category?.toLowerCase() === 'trainer'
      ? process.env.AWS_TRAINER_TABLE
      : process.env.AWS_TABLE;

  const params = {
    TableName: tableName,
    Item: newUser,
  };

  try {
    await dynamoDb.put(params).promise();

    console.log('User created in table:', tableName);

    res.json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ===============================
// UPDATE USER
// ===============================
app.put('/users/:email', async (req, res) => {
  const email = decodeURIComponent(req.params.email).toLowerCase();

  const {
    category,
    registerType,
    ...updates
  } = req.body;

 
  const isTrainer =
    registerType?.toLowerCase() === 'trainer' ||
    category?.toLowerCase() === 'trainer';

  const tableName = isTrainer
    ? process.env.AWS_TRAINER_TABLE
    : process.env.AWS_TABLE;

  console.log('==============================');
  console.log('UPDATE USER');
  console.log('Email:', email);
  console.log('Register Type:', registerType);
  console.log('Category:', category);
  console.log('Is Trainer:', isTrainer);
  console.log('Table:', tableName);
  console.log('==============================');

  
  const filteredUpdates = {};

  Object.keys(updates).forEach((key) => {
    if (
      updates[key] !== undefined &&
      updates[key] !== null
    ) {
      filteredUpdates[key] = updates[key];
    }
  });

 
  delete filteredUpdates.email;

 
  const updateExpParts = [];
  const expAttrValues = {};

  for (const [key, value] of Object.entries(filteredUpdates)) {
    updateExpParts.push(`${key} = :${key}`);
    expAttrValues[`:${key}`] = value;
  }

  if (updateExpParts.length === 0) {
    return res.status(400).json({
      error: 'No valid fields provided for update',
    });
  }

  const updateParams = {
    TableName: tableName,

    Key: {
      email,
    },

    UpdateExpression:
      'SET ' + updateExpParts.join(', '),

    ExpressionAttributeValues:
      expAttrValues,

    ReturnValues: 'ALL_NEW',
  };

  console.log('DynamoDB Update Params:');
  console.log(updateParams);

  try {
    const result =
      await dynamoDb.update(updateParams).promise();

    console.log('User updated successfully:');
    console.log(result.Attributes);

    res.json(result.Attributes);

  } catch (err) {
    console.error('Error updating user:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});



app.patch('/users/:email/approval', async (req, res) => {
  const email =
    decodeURIComponent(req.params.email).toLowerCase();

  const {
    isApproved,
    category,
    registerType,
  } = req.body;

  console.log('==============================');
  console.log('APPROVAL UPDATE');
  console.log('Email:', email);
  console.log('Status:', isApproved);
  console.log('Category:', category);
  console.log('Register Type:', registerType);
  console.log('==============================');

  if (
    !['approved', 'rejected'].includes(isApproved)
  ) {
    return res.status(400).json({
      error: 'Invalid approval status',
    });
  }

  
  const isTrainer =
    registerType?.toLowerCase() === 'trainer' ||
    category?.toLowerCase() === 'trainer';

  const tableName = isTrainer
    ? process.env.AWS_TRAINER_TABLE
    : process.env.AWS_TABLE;

  const params = {
    TableName: tableName,

    Key: {
      email,
    },

    UpdateExpression:
      'SET isApproved = :status',

    ExpressionAttributeValues: {
      ':status': isApproved,
    },

    ReturnValues: 'UPDATED_NEW',
  };

  console.log('Approval update table:', tableName);
  console.log('Approval update params:', params);

  try {
    const result =
      await dynamoDb.update(params).promise();

    console.log(
      'Approval updated:',
      result.Attributes
    );

    res.status(200).json({
      message: 'Approval status updated',
      updated: result.Attributes,
    });

  } catch (err) {
    console.error(
      'Error updating approval:',
      err
    );

    res.status(500).json({
      error: 'Failed to update approval',
    });
  }
});


// ===============================
// DELETE USER
// ===============================
app.delete('/users/:email', async (req, res) => {
  const email =
    decodeURIComponent(req.params.email).toLowerCase();

  const {
    category,
    registerType,
  } = req.body;

  
  const isTrainer =
    registerType?.toLowerCase() === 'trainer' ||
    category?.toLowerCase() === 'trainer';

  const tableName = isTrainer
    ? process.env.AWS_TRAINER_TABLE
    : process.env.AWS_TABLE;

  const params = {
    TableName: tableName,

    Key: {
      email,
    },
  };

  console.log('==============================');
  console.log('DELETE USER');
  console.log('Email:', email);
  console.log('Register Type:', registerType);
  console.log('Category:', category);
  console.log('Table:', tableName);
  console.log('==============================');

  try {
    await dynamoDb.delete(params).promise();

    res.status(200).json({
      message: 'User deleted successfully',
    });

  } catch (error) {
    console.error(
      'Error deleting user:',
      error
    );

    res.status(500).json({
      error: 'Failed to delete user',
    });
  }
});
// ===== COURSES =====
app.get('/courses', async (req, res) => {
  const params = {
    TableName: process.env.AWS_COURSES_TABLE,
  };
  let allItems = [];
  let lastEvaluatedKey = null;
  try {
    do {
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }
      const data = await dynamoDb.scan(params).promise();
      allItems = allItems.concat(data.Items);
      lastEvaluatedKey = data.LastEvaluatedKey;
    } while (lastEvaluatedKey);
    res.json(allItems);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: err.message });
  }
});
app.post('/courses', async (req, res) => {
  const {
    userId = '', category = '', completed = false, contents = '', cost = '',
    courseReview = '', description = '', enrolled = '', estimatedDuration = '',
    image = '', lastUpdatedOn = '', publishedOn = '', rating = '', requirements = '',
    title = '', whatWeCoverInCourse = '', whatYouLearn = ''
  } = req.body;
  const newCourse = {
    courseId: uuidv4(),
    userId,
    category, completed, contents, cost,
    courseReview, description, enrolled, estimatedDuration,
    image, lastUpdatedOn, publishedOn, rating, requirements,
    title, whatWeCoverInCourse, whatYouLearn
  };
  const params = {
    TableName: process.env.AWS_COURSES_TABLE,
    Item: newCourse,
  };
  try {
    await dynamoDb.put(params).promise();
    res.json(newCourse);
  } catch (err) {
    console.error('Error saving course:', err);
    res.status(500).json({ error: err.message });
  }
});
app.put('/courses/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  const { userId, ...updates } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required in the request body' });
  }
  const filteredUpdates = {};
  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined && updates[key] !== null) {
      filteredUpdates[key] = updates[key];
    }
  });
  delete filteredUpdates.courseId;
  const updateExpParts = [];
  const expAttrValues = {};
  for (const [key, value] of Object.entries(filteredUpdates)) {
    updateExpParts.push(`${key} = :${key}`);
    expAttrValues[`:${key}`] = value;
  }
  if (updateExpParts.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }
  const updateParams = {
    TableName: process.env.AWS_COURSES_TABLE,
    Key: { courseId, userId },
    UpdateExpression: 'set ' + updateExpParts.join(', '),
    ExpressionAttributeValues: expAttrValues,
    ReturnValues: 'ALL_NEW',
  };
  try {
    const result = await dynamoDb.update(updateParams).promise();
    res.json(result.Attributes);
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ error: err.message });
  }
});
app.delete('/courses/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required in the request body' });
  }
  const params = {
    TableName: process.env.AWS_COURSES_TABLE,
    Key: { courseId, userId },
  };
  try {
    await dynamoDb.delete(params).promise();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});