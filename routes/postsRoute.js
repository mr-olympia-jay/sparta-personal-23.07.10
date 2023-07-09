// routes>posts.route.js

const express = require('express');
const router = express.Router();

// Middleware
const authMiddleware = require('../middlewares/authMiddleware.js');
// Model
const { UserInfos, Posts } = require('../models');

const { Op } = require('sequelize');

// 게시글 생성 API (POST)
router.post('/posts', authMiddleware, async (req, res) => {
  // 'log-in'이 완료된 사용자만 작성 가능하기 때문에, authMiddleware 등록
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res.status(412).json({ message: 'Data 형식이 올바르지 않습니다.' });
    }
    if (typeof title !== 'string') {
      return res.status(412).json({ message: '게시글 제목의 형식이 일치하지 않습니다.' });
    }
    if (typeof content !== 'string') {
      return res.status(412).json({ message: '게시글 내용의 형식이 일치하지 않습니다.' });
    }
    // Posts(table)에 게시물 정보를 추가합니다.
    const userinfo = await UserInfos.findOne({ where: userId });
    await Posts.create({
      userId: userId,
      userInfoId: userinfo.userInfoId,
      title: title,
      content: content,
    });

    return res.status(201).json({ message: '게시글 작성에 성공하였습니다.' });
    // try => catch
  } catch {
    return res.status(400).json({ message: '게시글 작성에 실패하였습니다.' });
  }
});

// 게시글 조회 API (GET)
router.get('/posts', async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: ['postId', 'userId', 'title', 'likeCounts', 'createdAt', 'updatedAt'],
      include: [
        {
          model: UserInfos,
          attributes: ['nickname'],
        },
      ],
      order: [['createdAt', 'DESC']], // "createAt"을 내림차순 조회
    });

    return res.status(200).json({ posts: posts });
  } catch {
    return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
  }
});

// 게시글 상세 조회 API (GET)
router.get('/posts/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Posts.findOne({
      attributes: ['postId', 'userId', 'title', 'likeCounts', 'content', 'createdAt', 'updatedAt'],
      include: [
        {
          model: UserInfos,
          attributes: ['nickname'],
        },
      ],
      where: { postId },
    });

    return res.status(200).json({ data: post });
  } catch {
    return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
  }
});

// 본인 게시글 조회 API (GET)
router.get('/mypost', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  const posts = await Posts.findAll({
    attributes: ['postId', 'userId', 'title', 'content', 'createdAt', 'updatedAt'],
    order: [['createdAt', 'DESC']],
    where: { userId },
  });
  if (!posts) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  }

  return res.status(200).json({ data: posts });
});

// 게시글 수정 API (PUT)
router.put('/posts/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  // 수정하고자 하는 게시글을 조회합니다.
  const post = await Posts.findOne({ where: { postId } });

  try {
    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }
    if (post.userId !== userId) {
      return res.status(403).json({ message: '게시글 수정 권한이 존재하지 않습니다.' });
    }
    if (!title || !content) {
      return res.status(412).json({ message: 'Data 형식이 올바르지 않습니다.' });
    }
    if (typeof title !== 'string') {
      return res.status(412).json({ message: '게시글 제목의 형식이 일치하지 않습니다.' });
    }
    if (typeof content !== 'string') {
      return res.status(412).json({ message: '게시글 내용의 형식이 일치하지 않습니다.' });
    }

    try {
      // 게시글에 대한 권한을 확인하고, 게시글을 수정합니다.
      await Posts.update(
        { title, content }, // <= 수정하고자 하는 column입니다.
        {
          where: {
            [Op.and]: [{ postId }, { userId }],
          },
        }
      );
      // try => catch
    } catch {
      return res.status(401).json({ message: '게시글이 정상적으로 수정되지 않았습니다.' });
    }

    return res.status(200).json({ data: '게시글을 수정하였습니다.' });
    // try => catch
  } catch {
    return res.status(400).json({ message: '게시글 수정에 실패하였습니다.' });
  }
});

// 게시글 삭제 API (DELETE)
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  // 삭제하고자 하는 게시글을 조회합니다.
  const post = await Posts.findOne({ where: { postId } });

  try {
    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }
    if (post.userId !== userId) {
      return res.status(403).json({ message: '게시글 삭제 권한이 존재하지 않습니다.' });
    }

    try {
      // 게시글에 대한 권한을 확인하고, 게시글을 삭제합니다.
      await Posts.destroy({
        where: {
          [Op.and]: [{ postId }, { userId }],
        },
      });
      // try => catch
    } catch {
      return res.status(401).json({ message: '게시글이 정상적으로 삭제되지 않았습니다.' });
    }

    return res.status(200).json({ data: '게시글을 삭제하였습니다.' });
    // try => catch
  } catch {
    return res.status(400).json({ message: '게시글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
