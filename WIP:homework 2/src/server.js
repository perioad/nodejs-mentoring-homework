import express from 'express';
import Joi from '@hapi/joi';
import { mockUserbase } from './utils';

const app = express();
const userbaseRouter = express.Router();
const autoSuggestRouter = express.Router();
const USERBASE = 'userbase';

app.listen(3000);

app.use(express.json());

app.set(USERBASE, mockUserbase);

const joiSchema = Joi.object({
  id: Joi
    .string()
    .required(),
  login: Joi
    .string()
    .required(),
  password: Joi
    .string()
    .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'))
    .required(),
  age: Joi
    .number()
    .integer()
    .min(4)
    .max(130)
    .required(),
  isDeleted: Joi
    .boolean()
    .required()
});

function errorResponce(schemaErrors) {
  const errors = schemaErrors.map(error => {
    const { path, message } = error;
    return { path, message };
  });
  return {
    status: 'failed',
    errors
  };
}

function validateSchemaMiddleware(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (!error) {
      next();
      return;
    }
    res.status(400).json(errorResponce(error.details));
  };
}

userbaseRouter.all('/', validateSchemaMiddleware(joiSchema));

userbaseRouter.get('/', (req, res) => {
  res
    .status(200)
    .json({
      message: 'Welcome to the awesome user base :)',
      userbase: app.get(USERBASE)
    });
});

userbaseRouter.get('/:id', (req, res) => {
  console.log(app.get(USERBASE));

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
      .json({ message: `User with id ${req.params.id} wasn't found :c` });
  }
});

userbaseRouter.post('/:id', (req, res) => {
  const newUser = req.body;
  const existingUser = app.get(USERBASE).find(
    ({ id }) => id === newUser.id
  );
  if (existingUser) {
    res
      .status(400)
      .json({ message: `User with id ${existingUser.id} already exists in the userbase` });
  } else {
    const updatedUserbase = [...app.get(USERBASE), newUser];
    app.set(USERBASE, updatedUserbase);
    console.log(app.get(USERBASE));
    res
      .status(201)
      .json({ message: `New user with id ${newUser.id} has been added to the userbase` });
  }
});

userbaseRouter.put('/:id', (req, res) => {
  const userToUpdate = req.body;
  const existingUser = app.get(USERBASE).find(
    ({ id }) => id === userToUpdate.id
  );
  if (!existingUser) {
    res
      .status(400)
      .json({ message: `User with id ${userToUpdate.id} doesn't exist in the userbase` });
  } else if (existingUser && existingUser.isDeleted) {
    res
      .status(400)
      .json({ message: `User with id ${existingUser.id} has been deleted` });
  } else {
    const updatedUserbase = app.get(USERBASE).map(
      user => user.id === userToUpdate.id ? userToUpdate : user
    );
    app.set(USERBASE, updatedUserbase);
    console.log(app.get(USERBASE));
    res
      .status(200)
      .json({ message: `User with id ${userToUpdate.id} was succesfully edited` });
  }
});

userbaseRouter.delete('/:id', (req, res) => {
  const existingUser = app.get(USERBASE).find(
    ({ id }) => id === req.params.id
  );
  if (existingUser && !existingUser.isDeleted) {
    const updatedUserbase = app.get(USERBASE).map(
      user => user.id === existingUser.id ? { ...existingUser, isDeleted: true } : user
    );
    app.set(USERBASE, updatedUserbase);
    console.log(app.get(USERBASE));
    res
      .status(200)
      .json({ message: `User with id ${existingUser.id} was succesfully deleted` });
  } else {
    res
      .status(404)
      .json({ message: `User with id ${req.params.id} wasn't found :c` });
  }
});

app.use('/userbase', userbaseRouter);

autoSuggestRouter.get('/', (req, res) => {
  const loginSubstring = req.query.loginSubstring;
  const limit = Number(req.query.limit);
  const suitedUsers = app.get(USERBASE).filter(
    ({ login }) => login.includes(loginSubstring)
  );
  if (suitedUsers.length === 0) {
    res
      .status(404)
      .json({ message: 'There are no users from auto-suggest :c' });
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

app.use('/auto-suggest', autoSuggestRouter);

