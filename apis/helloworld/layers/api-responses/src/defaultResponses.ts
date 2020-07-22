import { APIGatewayProxyResult } from 'aws-lambda';

const response = {
  success: (statusCode: number = 200, headers: any = {}, data: any = {}): APIGatewayProxyResult => {
    /** Generate default response with no data */
    const response: {
      statusCode: number;
      headers: any;
      body: any;
    } = {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({}),
    };

    /** Add body if status is not 204 and there is data to add.  */
    if (statusCode !== 204)
      response.body = JSON.stringify({
        error: {},
        data,
      });

    return response;
  },
  error: (statusCode: number = 500, headers: any = {}, err?: Error): APIGatewayProxyResult => {
    /** Log the error */
    console.log(err);

    /** Generate default response with no error */
    const response: {
      statusCode: number;
      headers: any;
      body: any;
    } = {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        error: {},
        data: {},
      }),
    };

    /** If status code is 500, return a general internal server error */
    if (statusCode === 500) {
      response.body = JSON.stringify({
        error: {
          message:
            'There was an internal server error. Please try again later. If the problem persists, please contact technical support.',
        },
        data: {},
      });
    }

    /** If status code is not 500 and there is an error message, return it */
    if (statusCode !== 500 && err.message) {
      response.body = JSON.stringify({
        error: {
          message: err.message,
        },
        data: {},
      });
    }

    return response;
  },
};

export default response;
