// middleware>authMiddleware.js

// JWT
const jwt = require('jsonwebtoken');
// Model
const { Users } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = (authorization ?? '').split(' ');

    if (!token) {
      return res.status(401).json({
        // 존재하지 않는 경우
        message: 'log-in이 필요한 기능입니다.',
      });
    }
    if (tokenType !== 'Bearer') {
      // 형태가 일치하지 않는 경우
      return res.status(403).json({
        message: '전달된 Cookie에서 오류가 발생하였습니다.',
      });
    }

    // Decoding ==================================================
    const decodedToken = jwt.verify(token, 'customized_secret_key');
    const userId = decodedToken.userId;
    // Decoding ==================================================

    const user = await Users.findOne({
      where: { userId },
    });
    if (!user) {
      // 사용자가 존재하지 않을 경우, "authorization" Cookie를 제거하여, 인증상태를 해제합니다.
      res.clearCookie('authorization');

      return res.status(403).json({
        message: '전달된 Cookie에서 오류가 발생하였습니다.',
      });
    }
    res.locals.user = user; // <= 이 변수에 'userId'가 들어있습니다.
    next();
    // try => catch
  } catch (error) {
    // 비정상적인 요청일 경우, "authorization" Cookie를 제거하여, 인증상태를 해제합니다.
    res.clearCookie('authorization');

    return res.status(403).json({
      message: '전달된 Cookie에서 오류가 발생하였습니다.',
    });
  }
};
