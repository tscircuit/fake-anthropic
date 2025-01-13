import { test, expect } from "bun:test"
import Anthropic from "@anthropic-ai/sdk"
import { getTestServer } from "tests/fixtures/get-test-server"
import { normalizeForSnapshot } from "tests/fixtures/normalizeForSnapshot"

test("basic anthropic sdk usage", async () => {
  const { url } = await getTestServer()
  const anthropic = new Anthropic({
    apiKey: "fake-anthropic-api-key",
    baseURL: url,
  })

  const message = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Say hello world!",
      },
    ],
  })

  expect(normalizeForSnapshot(message)).toMatchInlineSnapshot(`
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
}
`)
})
