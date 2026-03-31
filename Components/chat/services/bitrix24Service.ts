/**
 * Bitrix24 Chat Service
 * Handles communication with Bitrix24 via REST API/Webhook
 */

export interface BitrixMessage {
  text: string
  email?: string
  name?: string
  phone?: string
}

export interface BitrixResponse {
  success: boolean
  message?: string
  error?: string
  data?: any
}

export interface BitrixContact {
  id: string
  name: string
  email: string
  phone?: string
}

/**
 * Send message to Bitrix24 CRM
 * Creates a new lead/contact with the message
 */
export async function sendMessageToBitrix24(
  payload: BitrixMessage
): Promise<BitrixResponse> {
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_BITRIX24_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('Bitrix24 webhook URL not configured')
      return {
        success: false,
        error: 'Bitrix24 webhook URL not configured'
      }
    }

    // Format the request for Bitrix24
    const requestBody = {
      fields: {
        NAME: payload.name || 'Website Visitor',
        EMAIL: payload.email ? [{ VALUE: payload.email, VALUE_TYPE: 'WORK' }] : [],
        PHONE: payload.phone ? [{ VALUE: payload.phone, VALUE_TYPE: 'WORK' }] : [],
        COMMENTS: payload.text,
        SOURCE_ID: 'WEB_SITE',
      }
    }

    // Send to Bitrix24
    const response = await fetch(webhookUrl + 'crm.lead.add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const result = await response.json()

    if (result.result) {
      console.log('Message sent to Bitrix24 successfully')
      return {
        success: true,
        message: 'Your message has been received. We will get back to you soon.',
        data: result.result
      }
    } else {
      console.error('Bitrix24 API error:', result)
      return {
        success: false,
        error: result.error_description || 'Failed to send message to Bitrix24'
      }
    }
  } catch (error) {
    console.error('Error sending message to Bitrix24:', error)
    return {
      success: false,
      error: 'An error occurred while sending your message'
    }
  }
}

/**
 * Create a contact in Bitrix24
 */
export async function createBitrix24Contact(
  contact: BitrixContact
): Promise<BitrixResponse> {
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_BITRIX24_WEBHOOK_URL

    if (!webhookUrl) {
      return {
        success: false,
        error: 'Bitrix24 webhook URL not configured'
      }
    }

    const requestBody = {
      fields: {
        NAME: contact.name,
        EMAIL: [{ VALUE: contact.email, VALUE_TYPE: 'WORK' }],
        PHONE: contact.phone ? [{ VALUE: contact.phone, VALUE_TYPE: 'WORK' }] : [],
      }
    }

    const response = await fetch(webhookUrl + 'crm.contact.add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const result = await response.json()

    if (result.result) {
      return {
        success: true,
        data: result.result
      }
    } else {
      return {
        success: false,
        error: result.error_description || 'Failed to create contact'
      }
    }
  } catch (error) {
    console.error('Error creating Bitrix24 contact:', error)
    return {
      success: false,
      error: 'An error occurred'
    }
  }
}

/**
 * Log activity to Bitrix24 (Timeline)
 */
export async function logActivityToBitrix24(
  contactId: string,
  message: string,
  type: 'EMAIL' | 'CALL' | 'NOTE' = 'EMAIL'
): Promise<BitrixResponse> {
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_BITRIX24_WEBHOOK_URL

    if (!webhookUrl) {
      return {
        success: false,
        error: 'Bitrix24 webhook URL not configured'
      }
    }

    const requestBody = {
      fields: {
        OWNER_ID: contactId,
        OWNER_TYPE_ID: 'C',
        TYPE_ID: type,
        SUBJECT: 'Website Chat Message',
        DESCRIPTION: message,
        COMPLETED: 'N',
      }
    }

    const response = await fetch(webhookUrl + 'crm.activity.add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const result = await response.json()

    if (result.result) {
      return {
        success: true,
        data: result.result
      }
    } else {
      return {
        success: false,
        error: result.error_description || 'Failed to log activity'
      }
    }
  } catch (error) {
    console.error('Error logging activity to Bitrix24:', error)
    return {
      success: false,
      error: 'An error occurred'
    }
  }
}

/**
 * Get Bitrix24 chat widget config
 */
export function getBitrix24Config() {
  return {
    scriptUrl: process.env.NEXT_PUBLIC_BITRIX24_SCRIPT_URL,
    webhookUrl: process.env.NEXT_PUBLIC_BITRIX24_WEBHOOK_URL,
  }
}
