import type { DocSection, TestSuite } from "./types";

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "grant-management",
    title: "Grant Management",
    slug: "grant-management",
    description: "OAuth 2.0 Grant Management API - list, query, and revoke grants.",
    tags: ["oauth", "grants", "api"],
    content: `
## Grant Management API

The Grant Management API allows resource owners to list and revoke OAuth 2.0 grants
issued to client applications.

### List Grants

\`\`\`http
GET /grants-management/Grants
Authorization: Bearer <token>
\`\`\`

### Revoke a Grant

\`\`\`http
DELETE /grants-management/Grants/{id}
Authorization: Bearer <token>
\`\`\`

### Filter by Client

\`\`\`http
GET /grants-management/Grants?$filter=client_id eq 'my-client'
Authorization: Bearer <token>
\`\`\`
`.trim(),
  },
  {
    id: "authorization-flow",
    title: "Authorization Flow",
    slug: "authorization-flow",
    description: "OAuth 2.0 Authorization Code flow with PKCE.",
    tags: ["oauth", "authorization", "pkce"],
    content: `
## Authorization Code Flow

### Step 1: Authorization Request

\`\`\`http
GET /oauth/authorize
  ?response_type=code
  &client_id=<client_id>
  &redirect_uri=<redirect_uri>
  &scope=openid profile
  &code_challenge=<challenge>
  &code_challenge_method=S256
\`\`\`

### Step 2: Token Exchange

\`\`\`http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=<code>
&redirect_uri=<redirect_uri>
&code_verifier=<verifier>
\`\`\`
`.trim(),
  },
  {
    id: "rich-authorization-requests",
    title: "Rich Authorization Requests",
    slug: "rich-authorization-requests",
    description: "RFC 9396 – fine-grained authorization details in the request.",
    tags: ["oauth", "rar", "rfc9396"],
    content: `
## Rich Authorization Requests (RAR)

RAR extends OAuth with structured \`authorization_details\` objects.

### Example Request

\`\`\`json
{
  "authorization_details": [
    {
      "type": "payment_initiation",
      "locations": ["https://example.com/payments"],
      "instructedAmount": {
        "currency": "EUR",
        "amount": "123.50"
      }
    }
  ]
}
\`\`\`
`.trim(),
  },
];

let uid = 0;
function id() {
  return `tc-${++uid}`;
}

export function buildTestSuites(): TestSuite[] {
  return DOC_SECTIONS.map((section) => {
    const snippets = extractCodeBlocks(section.content);
    return {
      id: section.id,
      name: section.title,
      status: "pending",
      cases: snippets.map((snip, i) => ({
        id: id(),
        name: `Snippet ${i + 1}: ${snip.lang || "code"}`,
        status: "pending",
      })),
    };
  });
}

function extractCodeBlocks(md: string): { lang: string; code: string }[] {
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  const results: { lang: string; code: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(md)) !== null) {
    results.push({ lang: m[1], code: m[2] });
  }
  return results;
}
