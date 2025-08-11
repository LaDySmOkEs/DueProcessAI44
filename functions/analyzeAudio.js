import OpenAI from 'npm:openai@4.20.0';

const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_AUDIO_API_KEY"),
});

Deno.serve(async (req) => {
    try {
        const { file_url, file_name, case_context, user_notes } = await req.json();

        // Step 1: Download the audio file
        const audioResponse = await fetch(file_url);
        if (!audioResponse.ok) {
            throw new Error(`Failed to download audio file: ${audioResponse.statusText}`);
        }
        
        const audioBuffer = await audioResponse.arrayBuffer();
        const audioFile = new File([audioBuffer], file_name, {
            type: 'audio/m4a'
        });

        // Step 2: Transcribe audio using Whisper
        console.log("Starting Whisper transcription...");
        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-1",
            response_format: "verbose_json",
            timestamp_granularities: ["segment"]
        });

        // Step 3: Analyze the transcript for constitutional violations
        const analysisPrompt = `Analyze this audio transcript for constitutional violations and due process issues. This is a legal evidence file.

TRANSCRIPT:
${transcription.text}

CONTEXT:
- File name: ${file_name}
- Case context: ${case_context || 'Not provided'}
- User notes: ${user_notes || 'Not provided'}

Please provide a comprehensive analysis focusing on:
1. Constitutional violations (4th, 5th, 6th, 14th Amendments)
2. Due process violations
3. Police procedural failures
4. Miranda rights issues
5. Search and seizure violations
6. False statements or perjury
7. Abuse of power
8. Denial of legal representation
9. Excessive force (if mentioned)
10. Discriminatory treatment

For each identified issue, provide:
- Specific quotes from the transcript
- Legal significance
- Constitutional implications
- Potential remedies

Also identify key speakers, timeline of events, and any inconsistencies or contradictions.`;

        const analysis = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
                role: "system",
                content: "You are an expert constitutional law analyst specializing in identifying due process violations and constitutional rights breaches. Provide detailed, legally sound analysis."
 
