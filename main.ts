import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

console.log("✅ Simplified server running!");

serve(() => {
  return new Response("Hello from Deno Deploy!", {
    headers: { "content-type": "text/plain" },
  });
});
