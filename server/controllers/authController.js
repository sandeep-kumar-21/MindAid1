import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';


const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// @desc    Register new user AND send OTP
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user exists AND is verified
    const userExists = await User.findOne({ email });
    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Validate Password Strength
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.' 
      });
    }

    // 3. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Create or Update User (if they existed but weren't verified, we overwrite)
    let user = userExists;
    if (!user) {
      user = new User({ name, email, password });
    } else {
      // Update existing unverified user with new details
      user.name = name;
      user.password = password;
    }

    // 5. Save OTP to user document (hashed for security is better, but plain text for simplicity in this example is okay for short lived OTPs. Let's just hash it to be safe and consistent with reset token)
     // Actually, for a simple 6-digit OTP that expires in 10 mins, plain text comparison is often acceptable for MVPs, but let's do it right:
     // We will store it directly for now to keep the verification simple, 
     // as 6 digit hashing can sometimes be brute-forced easily if leaked.
     // Given your current setup, let's stick to storing it directly but with a short expiry.
     user.otp = otp;
     user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes
     
     await user.save();

     // 6. Send Email
     const message = `Your verification code for MindAid is: \n\n ${otp} \n\nThis code expires in 10 minutes.`;
     try {
       await sendEmail({
         email: user.email,
         subject: 'MindAid Email Verification',
         message,
       });
       // NOTE: We do NOT send the token yet. User is not logged in until they verify.
       res.status(200).json({ 
         success: true, 
         message: `Verification code sent to ${user.email}` 
       });
     } catch (err) {
       // If email fails, delete the unverified user so they can try again
       await User.deleteOne({ _id: user._id });
       return res.status(500).json({ message: 'Email could not be sent. Please try again.' });
     }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // --- NEW CHECK: Is verified? ---
      if (!user.isVerified) {
         // Optional: You could trigger a new OTP send here if you wanted to be fancy
         return res.status(401).json({ message: 'Please verify your email first.' });
      }
      // -------------------------------

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update basic info
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // --- NEW: Password Change Logic ---
      if (req.body.password) {
         // 1. Check if old password was provided
         if (!req.body.oldPassword) {
            return res.status(400).json({ message: 'Please enter your current password to change it.' });
         }
         // 2. Verify old password
         if (!(await user.matchPassword(req.body.oldPassword))) {
            return res.status(401).json({ message: 'Invalid current password' });
         }
         // 3. Set new password
         user.password = req.body.password;
      }
      // ----------------------------------

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Forgot Password (send reset link)
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with that email does not exist' });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash it and save to database (for security)
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set expiration to 10 minutes from now
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create the reset URL (pointing to your FRONTEND)
    // Assuming your frontend runs on port 5173
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    
    const html = `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'MindAid Password Reset Token',
        message,
        html,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get the token from the URL and hash it to match what's in the DB
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Check if it hasn't expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, data: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Verify Email with OTP
// @route   POST /api/auth/verify
// @access  Public
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() }, // Check if not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    // NOW we can log them in and send the token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Don't forget to export them!
export { registerUser, loginUser, updateUserProfile, forgotPassword, resetPassword, verifyEmail };