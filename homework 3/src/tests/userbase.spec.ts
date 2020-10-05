import request from 'supertest';
import express, { Application } from 'express';

import { userbaseRouter } from '../controllers/userbase.controller';
import { UserbaseService } from '../services/userbase.service';
import { UserModel } from '../models/User.model';

describe('userbaseRouter', () => {
  const userbaseMock = 'userbase';
  const tokenMock = 'token';
  const userMock = 'user';
  const userIdMock = '1';
  const loginMock = 'login';
  const passwordMock = 'password1';
  const requestBodyMock: UserModel = {
    login: loginMock,
    password: passwordMock,
    id: userIdMock,
    age: 50,
    isDeleted: false,
  };
  const userIdQueryMock = '1';
  
  const getUserbase = jest.fn().mockReturnValue(Promise.resolve(userbaseMock));
  const authenticate = jest.fn().mockReturnValue(Promise.resolve(tokenMock));
  const getUser = jest.fn().mockReturnValue(Promise.resolve(userMock));
  const createUser = jest.fn().mockReturnValue(Promise.resolve(userIdMock));
  const updateUser = jest.fn().mockReturnValue(Promise.resolve(userIdMock));
  const deleteUser = jest.fn().mockReturnValue(Promise.resolve(userIdMock));

  let app: Application;
  let userbaseServiceMock: UserbaseService;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    userbaseServiceMock = {
      getUserbase,
      authenticate,
      getUser,
      createUser,
      updateUser,
      deleteUser,
    } as unknown as UserbaseService;

    userbaseRouter(app, userbaseServiceMock);
  });

  it('should get userbase', (done) => {
    request(app)
      .get('/userbase')
      .expect('Content-Type', /json/)
      .expect(() => {
        expect(getUserbase).toHaveBeenCalledTimes(1);
      })
      .expect(
        200,
        {
          message: 'Welcome to the awesome userbase :)',
          userbase: userbaseMock,
        },
        done,
      );
  });

  it('should send authentication token', (done) => {
    request(app)
      .get('/userbase/login')
      .send(requestBodyMock)
      .expect('Content-Type', /json/)
      .expect(() => {
        expect(authenticate).toHaveBeenCalledTimes(1);
        expect(authenticate).toHaveBeenCalledWith(loginMock, passwordMock);
      })
      .expect(
        200,
        {
          message: 'Here is your JWT token :)',
          token: tokenMock,
        },
        done,
      );
  });

  it('should get user', (done) => {
    request(app)
      .get(`/userbase/${userIdQueryMock}`)
      .expect('Content-Type', /json/)
      .expect(() => {
        expect(getUser).toHaveBeenCalledTimes(1);
        expect(getUser).toHaveBeenCalledWith(userIdQueryMock);
      })
      .expect(
        200,
        `"${userMock}"`,
        done,
      );
  });

  it('should create new user', (done) => {
    request(app)
      .post(`/userbase/${userIdQueryMock}`)
      .send(requestBodyMock)
      .expect('Content-Type', /json/)
      .expect(() => {
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(createUser).toHaveBeenCalledWith(requestBodyMock);
      })
      .expect(
        201,
        {
          message: `New user with id ${userIdMock} has been added to the userbase :)`,
        },
        done,
      );
  });

  it('should fail because of different ids in the query and request body', (done) => {
    const userIdQueryMock = '2';

    request(app)
      .post(`/userbase/${userIdQueryMock}`)
      .send(requestBodyMock)
      .expect('Content-Type', /json/)
      .expect(
        400,
        {
          message: `Id in the URI must be equal to the id in the request's body (${userIdQueryMock} !== ${userIdMock})`,
        },
        done,
      );
  });

  it('should modify user', (done) => {
    request(app)
      .put(`/userbase/${userIdQueryMock}`)
      .send(requestBodyMock)
      .expect('Content-Type', /json/)
      .expect(() => {
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(updateUser).toHaveBeenCalledWith(requestBodyMock);
      })
      .expect(
        200,
        {
          message: `User with id ${userIdMock} was succesfully edited :)`,
        },
        done,
      );
  });

  it('should delete user', (done) => {
    request(app)
      .delete(`/userbase/${userIdQueryMock}`)
      .send(requestBodyMock)
      .expect('Content-Type', /json/)
      .expect(() => {
        expect(deleteUser).toHaveBeenCalledTimes(1);
        expect(deleteUser).toHaveBeenCalledWith(userIdQueryMock);
      })
      .expect(
        200,
        {
          message: `User with id ${userIdMock} was succesfully deleted :)`,
        },
        done,
      );
  });
});