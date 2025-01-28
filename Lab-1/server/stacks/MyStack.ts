import 'dotenv/config'
import { Api, StackContext } from "sst/constructs";
import { setMaxListeners } from "events";

export function MyStack({ stack }: StackContext) {
  // Define the API Gateway
  setMaxListeners(20);
  const api = new Api(stack, "Api", {
    defaults:{
      function: {
        timeout: 30,
        environment: {
          MONGO_URI:process.env.MONGO_URI
        },
      },
    },
    routes: {
      "GET /products": "services/ProductService/index.handler",
      "POST /products": "services/ProductService/index.handler",
      "GET /orders": "services/OrderService/index.handler",
      "POST /orders": "services/OrderService/index.handler",
    },
  });

  // Output the API endpoint
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
