const Bookmark = require('../../../schemas/BookmarkSchema');
const { isAuthenticated, validateObjectID } = require('../../../middlewares/middlewares');
const { makeResponseJson, makeErrorJson } = require('../../../helpers/utils');
const Post = require('../../../schemas/PostSchema');

const router = require('express').Router({ mergeParams: true });

router.post(
    '/v1/bookmark/post/:post_id',
    isAuthenticated,
    validateObjectID('post_id'),
    async (req, res, next) => {
        try {
            const { post_id } = req.params;

            const post = await Post.findById(post_id);
            if (!post) return res.sendStatus(404);

            if (req.user._id.toString() === post._author_id.toString()) {
                return res.status(401).send(makeErrorJson({ status_code: 401, message: 'You can\'t bookmark your own post.' }))
            }

            const isPostBookmarked = await Bookmark.findOne({ _owner_id: req.user._id });

            if (isPostBookmarked) {
                await Bookmark.findOneAndDelete({ _owner_id: req.user._id });
                res.status(200).send(makeResponseJson([]));
            } else {
                const bookmark = new Bookmark({
                    _post_id: post_id,
                    _owner_id: req.user._id,
                    createdAt: Date.now()
                });
                await bookmark.save();

                res.status(200).send(makeResponseJson(bookmark));
            }
        } catch (e) {
            console.log('CANT BOOKMARK POST ', e);
            res.sendStatus(500);
        }
    }
);

module.exports = router;
