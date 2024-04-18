const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const path = require('path'); 
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;
const session = require('express-session');
const bcrypt = require('bcrypt');
const { User, Image,mongoose } = require('./config');

require('dotenv').config();

const fileType = import('file-type');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

const { v4: uuidv4 } = require('uuid');
// Generate a unique secret key
const secretKey = uuidv4();
console.log('Secret Key:', '0330c970-a6c6-4b57-b501-f0dd95a44bd1');

  // Parse JSON bodies
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.use(expressLayouts);
  app.set("layout", "./layouts/layout");
  app.set("view engine", "ejs");
  

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
      // Check if the file is an image
      if (!file.mimetype.startsWith('image')) {
          return cb(new Error('Please upload only images.'));
      }
      cb(null, true);
  },
  limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
});
// Handle image upload
app.post('/uploadmultiple', upload.array('images', 5), async (req, res) => {
  try {
      const uploadedFiles = req.files;

      if (!uploadedFiles || uploadedFiles.length === 0) {
          return res.status(400).send('No files uploaded.');
      }

      const images = await Promise.all(uploadedFiles.map(async (file) => {
          const timestamp = Date.now(); // Get current timestamp
          const uniqueFilename = `${timestamp}_${file.originalname}`;
          const imageBase64 = (await fs.promises.readFile(file.path)).toString('base64'); // Read file as base64 string

          // Determine file extension
          const extension = file.originalname.split('.').pop().toLowerCase();

          // Map common file extensions to MIME types (you may need to add more mappings)
          const mimeTypeMap = {
              'jpg': 'image/jpeg',
              'jpeg': 'image/jpeg',
              'png': 'image/png',
              // Add more mappings as needed
          };

          // Get MIME type based on file extension
          const contentType = mimeTypeMap[extension] || 'application/octet-stream'; 

          return {
              filename: uniqueFilename,
              contentType: contentType,
              imageBase64: imageBase64
          };
      }));

      // Save the images to the database using the Image model
      await Image.create(images);

      // Render the 'gallery' view and pass the images data to it
      res.render('gallery/gallery', { images: images });

  } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).send('Internal Server Error');
  }
});


// Route to render the gallery page
app.get('/gallery', async (req, res) => {
  try {
      // Fetch images from the Image collection
      const images = await Image.find().limit(5);
      res.render('gallery/gallery', { images });
  } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).send('Internal Server Error');
  }
});


// Route to handle image update
app.post('/updateImage', upload.single('image'), async (req, res) => {
  try {
    // Extract the image data and image ID from the request
    const image = req.file;
    const imageId = req.body.imageId;

    // Check if both image data and image ID are provided
    if (!image || !imageId) {
      return res.status(400).json({ error: 'Image data or image ID not provided' });
    }

    // Find the image in the database by ID
    const existingImage = await Image.findById(imageId);

    // Update the image data in the database
    if (existingImage) {
      existingImage.contentType = image.mimetype;
      existingImage.imageBase64 = image.buffer.toString('base64');
      existingImage.filename = image.originalname;
      await existingImage.save();

      // Return a success response
      return res.status(200).json({ message: 'Image updated successfully' });
    } else {
      // If image with provided ID is not found, return an error response
      return res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle image deletion
app.delete('/images/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    // Find the image by its ID and delete it from the database
    const deletedImage = await Image.findByIdAndDelete(imageId);
    if (!deletedImage) {
      return res.status(404).send('Image not found.');
    }
    res.status(200).send('Image deleted successfully.');
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Profile route under /profile
app.get('/profile', async (req, res) => {
  try {
    // Fetch the user's profile information from the database
    const user = await User.findOne({ email: req.session.user.email });
 
    if (!user) {
      return res.send('User not found.');
    }

    // Define the user object with relevant properties
    const userData = {
      name: user.name,
      email: user.email,
      status: user.status,
      plan: user.plan,
      preferences: user.preferences,
      notificationPreferences: user.notificationPreferences,
      languageSettings: user.languageSettings
    };

    // Render the profile template with user data
    return res.render(path.join(__dirname, '/views/profile/profile.ejs'), { user: userData });
  } catch (error) {
    console.error('Error fetching user information:', error);
    return res.status(500).send('Internal server error.');
  }
});

// Delete user route
app.post('/delete-account', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Delete the user document from the database
    await User.deleteOne({ email: email });

    // Redirect to the login page after successfully deleting the account
    res.redirect('/login');

    // Optionally, you can also send a success message
    // return res.status(200).send('Account deleted successfully.');
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).send('Internal server error.');
  }
});


//function to retrive data from the database
async function getUserData(email) {
  try {
      // Query the database to find the user by their email
      const user = await User.findOne({ email: email });

      if (!user) {
          // If user not found, return null or throw an error
          return null;
      }

      // Return the user data
      return {
          name: user.name,
          email: user.email,
          status: user.status,
          plan: user.plan,
          preferences: user.preferences,
          notificationPreferences: user.notificationPreferences,
          languageSettings: user.languageSettings
      };
  } catch (error) {
      // Handle errors
      console.error('Error fetching user data:', error);
      throw error;
  }
}

// GET route for settings page
app.get('/settings', async (req, res) => {
  try {
      // Fetch user data using the getUserData function
      const user = await getUserData(req.session.user.email); 
      if (!user) {
          // Handle case where user data is not found
          return res.status(404).send('User not found.');
      }

      // Render the settings page with user data
      res.render('settings/settings', { user: user });
  } catch (error) {
      // Handle errors
      console.error('Error rendering settings page:', error);
      res.status(500).send('Internal Server Error');
  }
});

// POST route to update profile
app.post('/updateProfile', async (req, res) => {
  try {
    // Extract user's email from request body
    const userEmail = req.body.email;

    // Extract updated profile information from request body
    const { name, email, status,  preferences, languageSettings, plan, notificationPreferences } = req.body;

    // Assuming you have a User model
    const updatedUser = await User.findOneAndUpdate({ email: userEmail }, {
      name: name,
      email: email,
      status: status,
      preferences: preferences,
      languageSettings: languageSettings,
      plan: plan,
      notificationPreferences: notificationPreferences
    });

    // Redirect to confirmation page after successful update
    res.redirect('/confirmation');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

//sendFile
app.get('/',(req,res)=>{
  res.render(path.join(__dirname, '/views/index/index.ejs'));
})
// Flights route
app.get('/flights', (req,res)=>{
  res.render(path.join(__dirname, '/views/flights/flights.ejs'));
});
//weather
app.get('/weather', (req, res)=>{
  res.render(path.join(__dirname, '/views/weather/weather.ejs'));
});
//amenities
app.get('/amenities', (req, res)=>{
  res.render(path.join(__dirname, '/views/amenities/amenities.ejs'));
});
//FAQS
app.get('/faqs', (req, res)=>{
  res.render(path.join(__dirname, '/views/FAQ/faq.ejs'));
});

// Signin route under /account
app.get('/login', (req, res) => {
  res.render(path.join(__dirname, '/views/account/login.ejs'));
});

// Signup route under /account
app.get('/signup', (req, res) => {
  res.render(path.join(__dirname, '/views/account/signup.ejs'));
});

// Settings route for /settings
app.get('/settings', (req, res) => {
  res.render(path.join(__dirname, '/views/settings/settings.ejs'));
});

// Settings route for /settings
app.get('/delete', (req, res) => {
  res.render(path.join(__dirname, '/views/settings/delete.ejs'));
});

// Settings route for /settings
app.get('/gallery', (req, res) => {
  res.render(path.join(__dirname, '/views/upload/gallery.ejs'));
});

// Confirmation page route
app.get('/confirmation', (req, res) => {
  res.render(path.join(__dirname, '/views/confirmation/confirmation.ejs'), { message: 'Profile updated successfully.' });
});


//route to signup
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.send('Email already exists. Please choose a different email.');
    } else {
      // Hash the password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Save user information to the database
      await User.create({ name: name, email: email, password: hashedPassword });

      // Redirect the user to the sign-in page with a success message
      return res.redirect('/login?signupSuccess=true&email=${encodeURIComponent(email)}');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).send('Internal server error.');
  }
});

 // Login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.send("User not found");
    }

    // Compare the hashed password from the database with the plaintext password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.send("Invalid password");
    }

    // Save the user's name to the session
    req.session.user = user;
    // Successful login, redirect to the profile page with user data
    res.redirect('/profile');
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Internal server error.');
  }
});

  // Handle logout
app.post("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).send('Internal server error.');
      }
      // Redirect the user to the login page or any other page
      res.redirect('/login');
  });
});

// Define Port for Application
const port = 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});
