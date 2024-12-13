import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const key = Deno.env.get('SCANDIT_LICENSE_KEY')
    if (!key) {
      throw new Error('Scandit license key not found')
    }

    return new Response(
      JSON.stringify({
        key
      }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      },
    )
  }
})