const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req, res, next) => {
    Promotions.find({})
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => { next(err); })
        .catch((err) => { next(err); });
})
.post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => { next(err); })
    .catch((err) => { next(err); });
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported for /promotions');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.remove({})
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }, (err) => {
        next(err);
    })
    .catch((err) => { next(err); });
});


promoRouter.route('/:promoId/')
    .get((req, res, next) => {
        console.log(req.params.promoId);
        Promotions.findById(req.params.promoId)
        .then((promo) => {
            if (promo != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            } else {
                err = new Error('Promotion ' + req.params.promoId + ' not found.');
                err.status = 404;
                next(err);
            }
        }, (err) => { next(err); })
        .catch((err) => { next(err); });
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403; //forbidden
        res.end('POST operation not supported on /promotions/' + req.params.promoId);
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true })
        .then((promo) => {
            if (promo != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            } else {
                err = new Error('Promotion: ' + req.params.promoId + ' is not found.');
                err.status = 404;
                next(err);
            }
        }, (err) => { next(err); })
        .catch((err) => { next(err); });
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => { next(err); })
        .catch((err) => { next(err); });
        res.end('Deleting the promo : ' + req.params.promoId);
    });

module.exports = promoRouter;