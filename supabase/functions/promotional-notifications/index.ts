// @ts-nocheck
// This file is a Supabase Edge Function (Deno runtime)
// VS Code shows TypeScript errors but they're expected - ignore them
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  title: string
  body: string
  data?: any
  tokens: string[]
  sound?: string
  badge?: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const expoAccessToken = Deno.env.get('EXPO_ACCESS_TOKEN')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { type, payload } = await req.json()

    switch (type) {
      case 'promotional':
        return await sendPromotionalNotifications(supabase, expoAccessToken, payload)
      case 'chef_availability':
        return await sendChefAvailabilityNotifications(supabase, expoAccessToken, payload)
      case 'weekly_deals':
        return await sendWeeklyDealsNotifications(supabase, expoAccessToken)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid notification type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function sendPromotionalNotifications(
  supabase: any,
  expoAccessToken: string,
  payload: {
    title: string
    message: string
    promoCode?: string
    chefId?: string
    targetAudience: 'all' | 'customers' | 'inactive_users'
    location?: string
  }
) {
  try {
    // Get target users based on audience
    let userQuery = supabase.from('users').select('id, push_token, preferences')

    switch (payload.targetAudience) {
      case 'customers':
        userQuery = userQuery.eq('user_type', 'customer')
        break
      case 'inactive_users':
        userQuery = userQuery
          .eq('user_type', 'customer')
          .lt('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        break
      case 'all':
      default:
        break
    }

    if (payload.location) {
      userQuery = userQuery.eq('location', payload.location)
    }

    const { data: users, error } = await userQuery

    if (error) throw error

    // Filter users who have notifications enabled
    const targetUsers = users.filter(user => 
      user.push_token && 
      user.preferences?.promotional_notifications !== false
    )

    const pushTokens = targetUsers.map(user => user.push_token)

    if (pushTokens.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No target users found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send notifications in batches
    const batchSize = 100
    const results = []

    for (let i = 0; i < pushTokens.length; i += batchSize) {
      const batch = pushTokens.slice(i, i + batchSize)
      const notificationPayload: NotificationPayload = {
        title: payload.title,
        body: payload.message,
        data: {
          type: 'promotional',
          promoCode: payload.promoCode,
          chefId: payload.chefId,
        },
        tokens: batch,
        sound: 'default',
      }

      const result = await sendExpoPushNotifications(expoAccessToken, [notificationPayload])
      results.push(...result)
    }

    // Log notification campaign
    await supabase.from('notification_campaigns').insert({
      type: 'promotional',
      title: payload.title,
      message: payload.message,
      target_audience: payload.targetAudience,
      sent_count: pushTokens.length,
      success_count: results.filter(r => r.status === 'ok').length,
      created_at: new Date().toISOString(),
    })

    return new Response(
      JSON.stringify({ 
        message: 'Promotional notifications sent', 
        sent: pushTokens.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw error
  }
}

async function sendChefAvailabilityNotifications(
  supabase: any,
  expoAccessToken: string,
  payload: {
    chefId: string
    chefName: string
    location: string
    specialties: string[]
  }
) {
  try {
    // Get customers in the same location who have availability notifications enabled
    const { data: customers, error } = await supabase
      .from('users')
      .select('id, push_token, preferences')
      .eq('user_type', 'customer')
      .eq('location', payload.location)

    if (error) throw error

    const targetCustomers = customers.filter(customer => 
      customer.push_token && 
      customer.preferences?.chef_availability_notifications !== false
    )

    if (targetCustomers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No target customers found in location' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const pushTokens = targetCustomers.map(customer => customer.push_token)
    const specialtiesText = payload.specialties.join(', ')

    const notificationPayload: NotificationPayload = {
      title: 'Chef Available Nearby! 👨‍🍳',
      body: `${payload.chefName} is now available for orders in ${payload.location}. Specialties: ${specialtiesText}`,
      data: {
        type: 'chef_availability',
        chefId: payload.chefId,
        location: payload.location,
      },
      tokens: pushTokens,
      sound: 'default',
    }

    const results = await sendExpoPushNotifications(expoAccessToken, [notificationPayload])

    return new Response(
      JSON.stringify({ 
        message: 'Chef availability notifications sent', 
        sent: pushTokens.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw error
  }
}

async function sendWeeklyDealsNotifications(supabase: any, expoAccessToken: string) {
  try {
    // Get active deals for this week
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    
    const { data: deals, error: dealsError } = await supabase
      .from('promotional_deals')
      .select('*')
      .gte('valid_until', new Date().toISOString())
      .eq('is_active', true)
      .limit(3)

    if (dealsError) throw dealsError

    if (deals.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active deals found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all customers who haven't opted out of promotional notifications
    const { data: customers, error: customersError } = await supabase
      .from('users')
      .select('id, push_token, preferences')
      .eq('user_type', 'customer')

    if (customersError) throw customersError

    const targetCustomers = customers.filter(customer => 
      customer.push_token && 
      customer.preferences?.promotional_notifications !== false
    )

    if (targetCustomers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No customers with notifications enabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const pushTokens = targetCustomers.map(customer => customer.push_token)
    const dealTitles = deals.map(deal => deal.title).join(', ')

    const notificationPayload: NotificationPayload = {
      title: 'Weekly Deals Available! 🔥',
      body: `Don't miss out on these amazing deals: ${dealTitles}`,
      data: {
        type: 'promotional',
        deals: deals.map(deal => deal.id),
      },
      tokens: pushTokens,
      sound: 'default',
    }

    const results = await sendExpoPushNotifications(expoAccessToken, [notificationPayload])

    // Log campaign
    await supabase.from('notification_campaigns').insert({
      type: 'weekly_deals',
      title: 'Weekly Deals',
      message: `Deals: ${dealTitles}`,
      target_audience: 'customers',
      sent_count: pushTokens.length,
      success_count: results.filter(r => r.status === 'ok').length,
      created_at: new Date().toISOString(),
    })

    return new Response(
      JSON.stringify({ 
        message: 'Weekly deals notifications sent', 
        sent: pushTokens.length,
        deals: deals.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw error
  }
}

async function sendExpoPushNotifications(
  expoAccessToken: string,
  notifications: NotificationPayload[]
): Promise<any[]> {
  const messages = notifications.flatMap(notification => 
    notification.tokens.map(token => ({
      to: token,
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
      sound: notification.sound || 'default',
      badge: notification.badge,
      priority: 'high',
      channelId: getChannelId(notification.data?.type),
    }))
  )

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${expoAccessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  })

  if (!response.ok) {
    throw new Error(`Expo push notification failed: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data || []
}

function getChannelId(type?: string): string {
  switch (type) {
    case 'promotional':
      return 'promotional'
    case 'chef_availability':
      return 'chef_updates'
    default:
      return 'default'
  }
}

/* To deploy this function:
1. Install Supabase CLI: npm install -g supabase
2. Login: supabase login
3. Link to your project: supabase link --project-ref YOUR_PROJECT_REF
4. Deploy: supabase functions deploy promotional-notifications

Environment variables needed:
- EXPO_ACCESS_TOKEN (from Expo dashboard)
- SUPABASE_URL (automatically available)
- SUPABASE_SERVICE_ROLE_KEY (automatically available)

To call this function:
POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/promotional-notifications
{
  "type": "promotional",
  "payload": {
    "title": "Special Offer!",
    "message": "Get 20% off your next order with code SAVE20",
    "promoCode": "SAVE20",
    "targetAudience": "customers"
  }
}
*/
