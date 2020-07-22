import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import response from '/opt/nodejs/defaultResponses';

export default async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return Promise.resolve(response.success(200, {}, { message: 'Hello World!' }));
};
