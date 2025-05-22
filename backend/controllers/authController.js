const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function for error handling
const handleError = (res, statusCode, message) => {
  console.error(message);
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

exports.googleAuth = async (req, res) => {
  try {
    const { credentials:token } = req.body;
    

    if (!token) {
      return handleError(res, 400, 'Google token is required');
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { sub: googleId, email, name, picture } = ticket.getPayload();

    // Validate required fields
    if (!googleId || !email || !name) {
      return handleError(res, 400, 'Invalid Google payload');
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        googleId,
        name,
        email,
        avatar: picture,
        role: 'user'
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID if logging in for first time
      user.googleId = googleId;
      if (picture) user.avatar = picture;
      await user.save();
    }

    return sendTokenResponse(user, 200, res);

  } catch (err) {
    return handleError(res, 401, 'Authentication failed');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-__v -googleId -createdAt -updatedAt');
    
    if (!user) {
      return handleError(res, 404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {
    handleError(res, 500, 'Server error');
  }
};

exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  try {
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
    };

    // Remove sensitive data before sending user info
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    };

    res
      .status(statusCode)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        token,
        user: userResponse
      });

  } catch (err) {
    handleError(res, 500, 'Token generation failed');
  }
}; 