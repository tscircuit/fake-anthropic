import { withRouteSpec } from "lib/middleware/with-winter-spec"
import { z } from "zod"

const MessageContentSchema = z.object({
  text: z.string(),
  type: z.literal("text"),
})

const UsageSchema = z.object({
  cache_creation_input_tokens: z.number(),
  cache_read_input_tokens: z.number(),
  input_tokens: z.number(),
  output_tokens: z.number(),
})

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
})

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
  const { model, max_tokens, messages } = req.jsonBody

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
  }

  return ctx.json(response)
})
