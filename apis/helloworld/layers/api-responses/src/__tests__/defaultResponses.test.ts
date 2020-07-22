import response from '../defaultResponses';

describe(`API Response Success Tests`, () => {
  test(`Should return a default response`, () => {
    const expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: {},
        data: {},
      }),
    };

    const result = response.success();

    expect(result.statusCode).toBe(200);
    expect(result).toEqual(expectedResponse);
  });

  test(`Should return custom headers`, () => {
    const headerParam = {
      'Custom Header': '1234',
    };

    const result = response.success(204, headerParam);

    expect(result.headers).toHaveProperty('Custom Header', headerParam['Custom Header']);
  });

  test(`Should return 204 with no body`, () => {
    const expectedBody = JSON.stringify({});

    const result = response.success(204);

    expect(result.statusCode).toBe(204);
    expect(result.body).toEqual(expectedBody);
  });

  test(`Should return 200 with body data`, () => {
    const body = {
      userId: '1234',
    };

    const expectedBody = JSON.stringify({
      error: {},
      data: body,
    });

    const result = response.success(200, {}, body);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(expectedBody);
  });
});

describe(`API Response Error Tests`, () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`Should return a default error`, () => {
    const expectedBody = JSON.stringify({
      error: {
        message:
          'There was an internal server error. Please try again later. If the problem persists, please contact technical support.',
      },
      data: {},
    });

    const expectedResponse = {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: expectedBody,
    };

    const result = response.error();

    expect(result.statusCode).toBe(500);
    expect(result).toEqual(expectedResponse);
  });

  test(`Should return custom headers`, () => {
    const headerParam = {
      'Custom Header': '1234',
    };

    const result = response.error(500, headerParam);

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toBe(500);
    expect(result.headers).toHaveProperty('Custom Header', headerParam['Custom Header']);
  });

  test(`Should return 500 error wtih general`, () => {
    const expectedBody = JSON.stringify({
      error: {
        message:
          'There was an internal server error. Please try again later. If the problem persists, please contact technical support.',
      },
      data: {},
    });

    const result = response.error(500);

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(expectedBody);
  });

  test(`Should return 400 error with message`, () => {
    const error = new Error('This was a bad request');

    const expectedBody = JSON.stringify({
      error: {
        message: error.message,
      },
      data: {},
    });

    const result = response.error(400, {}, error);

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(expectedBody);
  });
});
