import express from 'express';

import { mockUserbase } from './utils';
import { joiSchema, validateSchemaMiddleware } from './validation';

const app = express();
app.listen(3000);

app.use(express.json());

const USERBASE = 'userbase';
app.set(USERBASE, mockUserbase);

const userbaseRouter = express.Router();
app.use('/userbase', userbaseRouter);

userbaseRouter.get('/', (req, res) => {
    res
        .status(200)
        .json({
            message: 'Welcome to the awesome user base :)',
            userbase: app.get(USERBASE)
        });
});

userbaseRouter.route('/:id')
    .get((req, res) => {
        const existingUser = app.get(USERBASE).find(
            ({ id }) => id === req.params.id
        );
        if (existingUser) {
            res
                .status(200)
                .json(existingUser);
        } else {
            res
                .status(404)
                .json({
                    message: `User with id ${req.params.id} wasn't found :c`
                });
        }
    })
    .post(validateSchemaMiddleware(joiSchema), (req, res) => {
        const newUser = req.body;
        const existingUser = app.get(USERBASE).find(
            ({ id }) => id === req.params.id
        );
        if (req.params.id !== newUser.id) {
            res
                .status(400)
                .json({
                    message: `User id in the URI must be equal to the user id in the request's body (${req.params.id} !== ${newUser.id})`
                });
        } else if (existingUser) {
            res
                .status(400)
                .json({
                    message: `User with id ${existingUser.id} exists in the userbase`
                });
        } else {
            const updatedUserbase = [...app.get(USERBASE), newUser];
            app.set(USERBASE, updatedUserbase);
            res
                .status(201)
                .json({
                    message: `New user with id ${newUser.id} has been added to the userbase`
                });
        }
    })
    .put(validateSchemaMiddleware(joiSchema), (req, res) => {
        const userToUpdate = req.body;
        const existingUser = app.get(USERBASE).find(
            ({ id }) => id === req.params.id
        );
        if (req.params.id !== userToUpdate.id) {
            res
                .status(400)
                .json({
                    message: `User id in the URI must be equal to the user id in the request's body (${req.params.id} !== ${userToUpdate.id})`
                });
        } else if (!existingUser) {
            res
                .status(400)
                .json({
                    message: `User with id ${userToUpdate.id} doesn't exist in the userbase`
                });
        }  else if (existingUser && existingUser.isDeleted) {
            res
                .status(400)
                .json({
                    message: `User with id ${existingUser.id} has been deleted`
                });
        } else {
            const updatedUserbase = app.get(USERBASE).map(
                user => user.id === userToUpdate.id ? userToUpdate : user
            );
            app.set(USERBASE, updatedUserbase);
            res
                .status(200)
                .json({
                    message: `User with id ${userToUpdate.id} was succesfully edited`
                });
        }
    })
    .delete((req, res) => {
        const existingUser = app.get(USERBASE).find(
            ({ id }) => id === req.params.id
        );
        if (!existingUser) {
            res
                .status(404)
                .json({
                    message: `User with id ${req.params.id} wasn't found :c`
                });
        } else if (existingUser && existingUser.isDeleted) {
            res
                .status(400)
                .json({
                    message: `Ooops! User with id ${existingUser.id} has already been deleted`
                });
        } else  {
            const updatedUserbase = app.get(USERBASE).map(
                user => user.id === existingUser.id ? { ...existingUser, isDeleted: true } : user
            );
            app.set(USERBASE, updatedUserbase);
            res
                .status(200)
                .json({
                    message: `User with id ${existingUser.id} was succesfully deleted`
                });
        }
    });

const autoSuggestRouter = express.Router();
app.use('/auto-suggest', autoSuggestRouter);

// for example: GET /auto-suggest?limit=${number}&loginSubstring=${string}
autoSuggestRouter.get('/', (req, res) => {
    const loginSubstring = req.query.loginSubstring;
    const limit = Number(req.query.limit);
    const suitedUsers = app.get(USERBASE).filter(
        ({ login }) => login.includes(loginSubstring)
    );
    if (suitedUsers.length === 0) {
        res
            .status(404)
            .json({
                message: 'There are no users from auto-suggest :c' });
    } else if (suitedUsers.length > limit) {
        const indexForSplice = limit - 1;
        const limitedSuitedUsers = suitedUsers.slice(indexForSplice);
        res
            .status(200)
            .json(limitedSuitedUsers);
    } else {
        res
            .status(200)
            .json(suitedUsers);
    }
});
