// routes>commentsRoute.js

const express = require('express');
const router = express.Router();

// Middleware
const authMiddleware = require('../middlewares/authMiddleware.js');
// Model
const { UserInfos, Comments } = require('../models');

const { Op } = require('sequelize');

// 댓글 생성 API (POST)
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { content } = req.body;

  try {
    if (!postId) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }
    if (!content) {
      return res.status(412).json({ message: 'Data 형식이 올바르지 않습니다.' });
    }
    const userinfo = await UserInfos.findOne({ where: userId });
    await Comments.create({
      userId: userId,
      userInfoId: userinfo.userInfoId,
      postId: postId,
      content: content,
    });
    return res.status(201).json({ message: '댓글 작성에 성공하였습니다.' });
  } catch {
    return res.status(400).json({ message: '댓글 작성에 실패였습니다.' });
  }
});

// 댓글 조회 API (GET)
router.get('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    if (!postId) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }
    const comments = await Comments.findAll({
      attributes: ['commentId', 'postId', 'content', 'createdAt', 'updatedAt'],
      include: [
        {
          model: UserInfos,
          attributes: ['nickname'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ data: comments });
  } catch {
    return res.status(400).json({ message: '댓글 조회에 실패하였습니다.' });
  }
});

// 댓글 수정 API (PUT)
router.put('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId } = res.locals.user;
  const { content } = req.body;

  try {
    if (!postId) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }
    const comment = await Comments.findOne({ where: { commentId } });
    if (!comment) {
      return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
    } else if (comment.userId !== userId) {
      return res.status(403).json({ message: '댓글의 수정 권한이 존재하지 않습니다.' });
    }
    if (!content) {
      return res.status(412).json({ message: 'Data 형식이 올바르지 않습니다.' });
    }
    try {
      await Comments.update(
        { content },
        {
          where: {
            [Op.and]: [{ commentId }, { userId }],
          },
        }
      );
      return res.status(200).json({ data: '댓글 수정에 성공하였습니다.' });
    } catch {
      return res.status(400).json({ data: '댓글 수정이 정상적으로 처리되지 않았습니다.' });
    }
  } catch {
    return res.status(400).json({ data: '댓글 수정에 실패하였습니다.' });
  }
});

// 댓글 삭제 API (DELETE)
router.delete('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId } = res.locals.user;

  try {
    if (!postId) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }
    const comment = await Comments.findOne({ where: { commentId } });
    if (!comment) {
      return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
    } else if (comment.userId !== userId) {
      return res.status(403).json({ message: '댓글 삭제 권한이 존재하지 않습니다.' });
    }
    try {
    } catch {
      return res.status(400).json({ data: '댓글 삭제가 정상적으로 처리되지 않았습니다.' });
    }
    await Comments.destroy({
      where: {
        [Op.and]: [{ commentId }, { userId }],
      },
    });

    return res.status(200).json({ data: '댓글 삭제에 성공하였습니다.' });
  } catch {
    return res.status(400).json({ data: '댓글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
