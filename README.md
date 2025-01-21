`fake-anthropic` is a library that starts a server that can substitute for the
production Anthropic API. It's used for testing anthropic without making any
calls the production API.

You can start the `fake-anthropic` server like this:

## Usage with Bun

```tsx
import fakeAnthropicWinterspecBundle from "@tscircuit/fake-anthropic"

// Start a server with Bun
Bun.serve({
  port: 3030,
  fetch: (req) => {
    return fakeAnthopicWinterspecBundle.makeRequest(req)
  },
})
```

## Usage with NodeJS

```tsx
import http from "node:http"
import { getNodeHandler } from "winterspec/adapters/node"

const nodeHandler = getNodeHandler(fakeJlcpcbBundle, {
  port,
})

const server = http.createServer((req, res) => {
  nodeHandler(req, res)
})

server.listen(3000)
```

## Usage in Bun Test Fixtures

Many times, you'll want to create a test fixture that sets up your fake
anthropic server for usage with the Anthropic SDK.

```tsx
import fakeAnthropicWinterspecBundle from "@tscircuit/fake-anthropic/dist/bundle"
import { afterEach } from "bun:test"

export const getTestAnthropicServer = async () => {
  const port = 3000
  process.env.ANTHROPIC_API_KEY = "fake-anthropic-api-key"
  process.env.ANTHROPIC_BASE_URL = `http://localhost:${port}`

  const server = Bun.serve({
    port,
    fetch: (req) => {
      return fakeAnthopicWinterspecBundle.fetch(req)
    },
  })

  afterEach(() => {
    server.close()
  })

  return { anthropicBaseUrl: `http://localhost:${port}` }
}

// sometest.test.ts

test("my anthropic test", () => {
  await getTestAnthropicServer()

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: process.env.ANTHROPIC_BASE_URL,
  })
})
```