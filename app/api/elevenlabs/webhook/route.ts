import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const payload = await request.json()

	// Log the entire payload to see what ElevenLabs sends
	console.log('=== ElevenLabs Webhook Received ===')
	console.log('Conversation ended:', JSON.stringify(payload, null, 2))
	console.log('===================================')

	return NextResponse.json({ success: true })
}
