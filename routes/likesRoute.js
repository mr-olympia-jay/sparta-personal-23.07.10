// routes>likesRoute.js

const express = require('express');
const router = express.Router();

// Middleware
const authMiddleware = require('../middlewares/authMiddleware.js');
// Model
const { UserInfos, Posts } = require('../models');

const { Op } = require('sequelize');

// 게시글 '좋아요' API (PUT)
router.put('/posts/:postId/like', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;

  let { likePostIds } = await UserInfos.findOne({ where: { userId } });
  let likePostsIdsArray = likePostIds.split(',').filter(Boolean); // 문자열 => 배열

  // unlike //
  if (likePostsIdsArray.includes(postId)) {
    try {
      // '좋아요' 수 감소 (-1)
      let { likeCounts } = await Posts.findOne({ where: { postId } });
      likeCounts -= 1;
      await Posts.update(
        { likeCounts },
        {
          where: {
            [Op.and]: [{ postId }, { userId }],
          },
        }
      );
      // UserInfos의 likePostIds에 '좋아요' 표시를 취소한 'postId'를 제거합니다.
      let { likePostIds } = await UserInfos.findOne({ where: { userId } });
      const newLikePostsIdsArray = likePostsIdsArray.filter((item) => item != postId && !'');
      likePostIds = String(newLikePostsIdsArray); // 배열 => 문자열
      await UserInfos.update(
        { likePostIds },
        {
          where: { userId },
        }
      );
      return res.status(200).json({ message: '게시글의 좋아요를 취소하였습니다.' });
    } catch {
      return res.status(400).json({ message: '게시글 좋아요 취소에 실패하였습니다.' });
    }
    // like //
  } else if (!likePostsIdsArray.includes(postId)) {
    try {
      // '좋아요' 수 증가 (+1)
      let { likeCounts } = await Posts.findOne({ where: { postId } });
      likeCounts += 1;
      await Posts.update(
        { likeCounts },
        {
          where: {
            [Op.and]: [{ postId }],
          },
        }
      );
      // UserInfos의 likePostIds에 '좋아요' 표시한 'postId'를 추가합니다.
      let { likePostIds } = await UserInfos.findOne({ where: { userId } });
      if (likePostIds === '') {
        likePostIds = postId;
      } else {
        likePostIds = `${likePostIds},${postId}`;
      }
      await UserInfos.update(
        { likePostIds },
        {
          where: { userId },
        }
      );
      return res.status(200).json({ message: '게시글의 좋아요를 등록하였습니다.' });
    } catch {
      return res.status(400).json({ message: '게시글 좋아요에 실패하였습니다.' });
    }
  }
});

// 사용자가 '좋아요' 표시한 게시물 조회 API (GET)
router.get('/like', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const userInfo = await UserInfos.findOne({ where: { userId } });
    const likePostIdsArray = userInfo.likePostIds.split(','); // 문자열 => 배열
    let likePostsArray = [];

    for (const likePostId of likePostIdsArray) {
      const likePosts = await Posts.findOne({
        attributes: ['postId', 'userId', 'title', 'likeCounts', 'createdAt', 'updatedAt'],
        include: [
          {
            model: UserInfos,
            attributes: ['nickname'],
          },
        ],
        where: { postId: likePostId },
      });
      likePostsArray.push(likePosts);
    }
    // 'likeCounts'를 기준으로 내림차순 정렬
    likePostsArray = likePostsArray.sort((a, b) => b.likeCounts - a.likeCounts);
    return res.status(200).json({ posts: likePostsArray });
  } catch {
    return res.status(400).json({ message: '좋아요 게시글 조회에 실패하였습니다.' });
  }
});

module.exports = router;
