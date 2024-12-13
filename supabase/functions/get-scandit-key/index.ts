import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const key = Deno.env.get('SCANDIT_LICENSE_KEY')
    if (!key) {
      console.error('Scandit license key not found in environment variables')
      throw new Error('Scandit license key not found')
    }

    console.log('Successfully retrieved Scandit license key')
    
    return new Response(
      JSON.stringify({ key }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      },
    )
  } catch (error) {
    console.error('Error in get-scandit-key function:', error.message)
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      },
    )
  }
})