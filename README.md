# @tscircuit/fake-anthropic

## Introduction

`@tscircuit/fake-anthropic` is a library designed to facilitate testing by providing a fake implementation of the Anthropic API. This allows developers to test their applications without making actual calls to the Anthropic service. This README will guide you through setting up the test environment, integrating `fake-anthropic` in your tests, mocking external services, and effective testing strategies.

## What is `fake-anthropic`?

`fake-anthropic` is a library that provides a fake implementation of the Anthropic API. It is useful for testing purposes, allowing you to simulate interactions with the Anthropic service without making real API calls. This can help you test your application's behavior in a controlled environment.

## Setting up the test environment


3. Set up the test server in `tests/fixtures/get-test-server.ts`:
   ```ts
    import { afterEach } from "bun:test";
    import defaultAxios from "redaxios";
    import { startServer } from "./start-server";
    import ky from "ky";


    interface TestFixture {
      url: string;
      server: any;
      axios: typeof defaultAxios;
    }

    export const getTestServer = async (): Promise<TestFixture> => {
      const port = 3001 + Math.floor(Math.random() * 999);
      const testInstanceId = Math.random().toString(36).substring(2, 15);
      const testDbName = `testdb${testInstanceId}`;

      const server = await startServer({
        port,
        testDbName,
      });

      const url = `http://127.0.0.1:${port}`;
      const axios = defaultAxios.create({
        baseURL: url,
      });

      afterEach(async () => {
        await server.stop();
      });

      return {
        url,
        server,
        axios: ky.create({
          prefixUrl: url,
        }),
      };
    };
   ```

## Using `fake-anthropic` in other application tests

To use the `fake-anthropic` bundle in other application tests, follow these steps:

1. Install the `fake-anthropic` package in your application:
  ```sh
  npm install @tscircuit/fake-anthropic
  ```

2. Import and use the `fake-anthropic` bundle in your test file:
  ```ts
  import { test, expect } from "bun:test";
  import { getTestServer } from "tests/fixtures/get-test-server";
  import { normalizeForSnapshot } from "tests/fixtures/normalizeForSnapshot";
  import { Anthropic } from "@tscircuit/fake-anthropic/dist/bundle";

  test("integration test with fake-anthropic", async () => {
    const { url } = await getTestServer();
    const anthropic = new Anthropic({
     apiKey: "fake-anthropic-api-key",
     baseURL: url,
    });

    const message = await anthropic.messages.create({
     model: "claude-3-5-haiku-20241022",
     max_tokens: 1024,
     messages: [
      {
        role: "user",
        content: "Say hello world!",
      },
     ],
    });

    expect(normalizeForSnapshot(message)).toMatchInlineSnapshot(
    {
     "content": [
      {
        "text": "Hello world!",
        "type": "text",
      },
     ],
     "id": "[id]",
     "model": "claude-3-5-haiku-20241022",
     "role": "assistant",
     "stop_reason": "end_turn",
     "stop_sequence": null,
     "type": "message",
     "usage": {
      "cache_creation_input_tokens": 0,
      "cache_read_input_tokens": 0,
      "input_tokens": 0,
      "output_tokens": 0,
     },
    });
  });
  ```

## Fake external services using `fake-anthropic`

To Fake external services using `fake-anthropic`, you can create a fake implementation of the Anthropic API and use it in your tests. This allows you to simulate interactions with the Anthropic service without making real API calls.

1. Create a fake implementation of the Anthropic API in `routes/v1/messages/index.ts`:
   ```ts
   import { withRouteSpec } from "lib/middleware/with-winter-spec";
   import { z } from "zod";

   const MessageContentSchema = z.object({
     text: z.string(),
     type: z.literal("text"),
   });

   const UsageSchema = z.object({
     cache_creation_input_tokens: z.number(),
     cache_read_input_tokens: z.number(),
     input_tokens: z.number(),
     output_tokens: z.number(),
   });

   const MessageSchema = z.object({
     _request_id: z.string(),
     content: z.array(MessageContentSchema),
     id: z.string(),
     model: z.string(),
     role: z.literal("assistant"),
     stop_reason: z.literal("end_turn"),
     stop_sequence: z.null(),
     type: z.literal("message"),
     usage: UsageSchema,
   });

   export default withRouteSpec({
     methods: ["POST"],
     jsonBody: z.object({
       model: z.string(),
       max_tokens: z.number(),
       messages: z.array(
         z.object({
           role: z.string(),
           content: z.string(),
         }),
       ),
     }),
     jsonResponse: MessageSchema,
   })((req, ctx) => {
     const { model, max_tokens, messages } = req.jsonBody;

     const response: z.infer<typeof MessageSchema> = {
       _request_id: "req_019HyxDonkJQ1hi7nKaLkoMD",
       content: [{ text: "Hello world!", type: "text" }],
       id: "msg_01XEzaHf6udRSzDAS2ACBUwd",
       model: model,
       role: "assistant",
       stop_reason: "end_turn",
       stop_sequence: null,
       type: "message",
       usage: {
         cache_creation_input_tokens: 0,
         cache_read_input_tokens: 0,
         input_tokens: 0,
         output_tokens: 0,
       },
     };

     return ctx.json(response);
   });
   ```


> [!NOTE]
>
> For more information on effective testing strategies, refer to the blog post: [Talking to External Services](https://seve.blog/p/a-simple-pattern-for-api-testing?open=false#%C2%A7talking-to-external-services-spoiler-use-fakes).
