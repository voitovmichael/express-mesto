const router = require('express').Router();
const { getCards, postCard, delCard, likeCard, dislikeCard } = require('../controller/card');

router.get('/', getCards);
router.post('/', postCard);
router.delete('/:cardId', delCard);
router.put('/:cardId/likes', likeCard );
router.delete('/:cardId/likes', dislikeCard )

module.exports = router;