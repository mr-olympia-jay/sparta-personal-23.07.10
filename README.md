
```

# API

회원가입 (POST)
=> /signup

Log-in (POST)
=> /login

Log-out (POST)
=> /logout

사용자 정보 조회 (GET)
=> /users/:userId

사용자 정보 수정 (PUT)
=> /users/:userId

회원탈퇴 (DELETE)
=> /users/:userId

게시글 생성 (POST)
=> /posts

게시글 조회 (GET)
=> /posts

게시글 상세 조회 (GET)
=> /posts/:postId

본인 게시글 조회 (GET)
=> /myposts

게시글 수정 (PUT)
=> /posts/:postId

게시글 삭제 (DELETE)
=> /posts/:postId

댓글 생성 (POST)
=> /posts/:postId/comments

댓글 조회 (GET)
=> /posts/:postId/comments

댓글 수정 (PUT)
=> /posts/:postId/comments/:commentId

댓글 삭제 (DELETE)
=> /posts/:postId/comments/:commentId

게시글 '좋아요' (PUT)
=> /posts/:postId/like

사용자가 '좋아요' 표시한 게시물 조회 (GET)
=> /like

```

```

2023.07.10
├─ .gitignore
├─ .prettierrc.js
├─ app.js
├─ middlewares
│  └─ authMiddleware.js
├─ migrations
│  ├─ 20230704025827-create_users_table.js
│  ├─ 20230704025912-create_userinfos_table.js
│  ├─ 20230704025938-create_posts_table.js
│  └─ 20230704025959-create_comments_table.js
├─ models
│  ├─ comments.js
│  ├─ index.js
│  ├─ posts.js
│  ├─ userinfos.js
│  └─ users.js
├─ routes
│  ├─ commentsRoute.js
│  ├─ likesRoute.js
│  ├─ postsRoute.js
│  └─ usersRoute.js
├─ package-lock.json
├─ package.json
└─ seeders

```
