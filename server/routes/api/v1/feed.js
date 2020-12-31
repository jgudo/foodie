const { isAuthenticated } = require('../../../middlewares/middlewares');

const router = require('express').Router({ mergeParams: true });

router.get(
    '/v1/feed',
    isAuthenticated,
    async (req, res, next) => {
        try {
            let page = 1;
            let limit = 20;
        } catch(e) {
            
        }
    }
);

module.exports = router;
