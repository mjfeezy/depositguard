import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ORCHESTRATOR_SYSTEM_PROMPT } from '@/lib/orchestratorPrompt';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function POST(request: NextRequest) {
  try {
    const { case_id, message } = await request.json();

    if (!case_id || !message) {
      return NextResponse.json({ error: 'case_id and message are required' }, { status: 400 });
    }

    // Verify case exists
    const { data: caseRow, error: caseError } = await supabaseAdmin
      .from('cases')
      .select('id, status')
      .eq('id', case_id)
      .single();

    if (caseError || !caseRow) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Save user message
    await supabaseAdmin.from('messages').insert({
      case_id,
      role: 'user',
      content: message,
    });

    // Load full conversation history
    const { data: history } = await supabaseAdmin
      .from('messages')
      .select('role, content')
      .eq('case_id', case_id)
      .order('created_at', { ascending: true });

    const messages = (history || []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Call Claude
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        system: ORCHESTRATOR_SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      console.error('Anthropic error:', err);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const anthropicData = await anthropicResponse.json();
    const rawContent = anthropicData.content?.[0]?.text || '';

    // Check for CASE_READY signal
    const caseReadyMatch = rawContent.match(/<CASE_READY>([\s\S]*?)<\/CASE_READY>/);
    let caseReady = false;
    let displayMessage = rawContent;

    if (caseReadyMatch) {
      caseReady = true;
      // Strip the CASE_READY block from what the user sees
      displayMessage = rawContent.replace(/<CASE_READY>[\s\S]*?<\/CASE_READY>/, '').trim();

      try {
        const extractedCaseData = JSON.parse(caseReadyMatch[1].trim());

        // Update case in Supabase with extracted data and mark as ready
        await supabaseAdmin
          .from('cases')
          .update({
            status: 'ready',
            case_data: extractedCaseData,
          })
          .eq('id', case_id);
      } catch (parseError) {
        console.error('Failed to parse CASE_READY JSON:', parseError);
        // Don't block — still mark ready so user can proceed
        await supabaseAdmin
          .from('cases')
          .update({ status: 'ready' })
          .eq('id', case_id);
      }
    }

    // Save assistant message (without the CASE_READY block)
    await supabaseAdmin.from('messages').insert({
      case_id,
      role: 'assistant',
      content: displayMessage,
    });

    return NextResponse.json({
      message: displayMessage,
      case_ready: caseReady,
    });
  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

// GET: return the opening message when chat starts
export async function GET(request: NextRequest) {
  const case_id = request.nextUrl.searchParams.get('case_id');
  if (!case_id) {
    return NextResponse.json({ error: 'case_id required' }, { status: 400 });
  }

  // Check if there are existing messages (returning user)
  const { data: existing } = await supabaseAdmin
    .from('messages')
    .select('id')
    .eq('case_id', case_id)
    .limit(1);

  if (existing && existing.length > 0) {
    // Load full history
    const { data: history } = await supabaseAdmin
      .from('messages')
      .select('role, content, created_at')
      .eq('case_id', case_id)
      .order('created_at', { ascending: true });

    return NextResponse.json({ messages: history || [], returning: true });
  }

  // New case — save and return the opening message
  const opening =
    "Hey — I'm here to help you get your deposit back. Tell me what happened. What did your landlord do (or not do) with your deposit?";

  await supabaseAdmin.from('messages').insert({
    case_id,
    role: 'assistant',
    content: opening,
  });

  return NextResponse.json({
    messages: [{ role: 'assistant', content: opening }],
    returning: false,
  });
}
