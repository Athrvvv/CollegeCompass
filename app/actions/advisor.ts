"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth/server";
import { neon } from "@neondatabase/serverless";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function createAdvisorChat(title: string) {
  const session = await auth.getSession();
  if (!session.data?.user) throw new Error("Unauthorized");

  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    INSERT INTO advisor_chats (auth_user_id, title)
    VALUES (${session.data.user.id}, ${title})
    RETURNING id
  `;
  return result[0].id;
}

export async function getAdvisorChats() {
  const session = await auth.getSession();
  if (!session.data?.user) throw new Error("Unauthorized");

  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    SELECT id, title, updated_at
    FROM advisor_chats
    WHERE auth_user_id = ${session.data.user.id}
    ORDER BY updated_at DESC
  `;
  return result.map((row: any) => ({
    id: row.id,
    title: row.title,
    updated_at: new Date(row.updated_at).toISOString()
  }));
}

export async function getAdvisorMessages(chatId: string) {
  const session = await auth.getSession();
  if (!session.data?.user) throw new Error("Unauthorized");

  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    SELECT role, content, created_at
    FROM advisor_messages
    WHERE chat_id = ${chatId}
    ORDER BY created_at ASC
  `;
  return result.map((row: any) => ({
    role: row.role,
    content: row.content,
    created_at: new Date(row.created_at).toISOString()
  }));
}

export async function saveAdvisorMessage(chatId: string, role: string, content: string) {
  const session = await auth.getSession();
  if (!session.data?.user) throw new Error("Unauthorized");

  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    INSERT INTO advisor_messages (chat_id, role, content)
    VALUES (${chatId}, ${role}, ${content})
  `;
  
  await sql`
    UPDATE advisor_chats 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${chatId}
  `;
}

export async function getAdvisorResponse(message: string, chatId?: string) {
  const session = await auth.getSession();
  if (!session.data?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Fetch profile for context - updated with requested fields
    const profile = await sql`
      SELECT 
        first_name, 
        education_qualification, 
        exams_appeared,
        user_rank,
        category,
        gender,
        state_of_eligibility,
        pwd_status
      FROM user_profiles 
      WHERE auth_user_id = ${session.data.user.id} 
      LIMIT 1
    `;

    const userProfile = profile[0] || {};
    
    // Fetch chat history if chatId provided
    let history: { role: string, parts: { text: string }[] }[] = [];
    if (chatId) {
      const messages = await getAdvisorMessages(chatId);
      history = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));
    }

    const systemPrompt = `
      You are a Professional Career Guidance Counselor AI integrated into the CollegeCompass platform. 
      Your role is to help users understand possible career paths within the Indian education system.

      USER PROFILE CONTEXT:
      - Name: ${userProfile.first_name || "Student"}
      - Current Qualification: ${userProfile.education_qualification || "Not specified"}
      - Exams Appeared: ${JSON.stringify(userProfile.exams_appeared || [])}
      - Primary Rank: ${userProfile.user_rank || "Not specified"}
      - Category: ${userProfile.category || "General"}
      - Gender: ${userProfile.gender || "Not specified"}
      - Home State: ${userProfile.state_of_eligibility || "Not specified"}
      - PwD Status: ${userProfile.pwd_status ? "Yes" : "No"}

      CORE PURPOSE:
      The user is at CollegeCompass to explore colleges and careers. Help them find a direction and recommend exploring relevant sections on the website.

      TARGET USERS:
      Assume anyone in the Indian system (Class 8-10, 11-12, Diploma, etc.) across ALL streams (Engineering, Medical, Arts, Law, etc.).

      RESPONSE FORMAT (STRICT):
      All responses MUST follow this structure:
      1. Career Path
      2. Why this suits you (refer to the user's profile and message)
      3. Required Exams
      4. Top Colleges (Real, verifiable Indian colleges only)
      5. Skills to Start Learning
      
      No JSON or code blocks. Professional, factual, grounded tone. Ever.

      CONSTRAINTS & RULES:
      - Provide MULTIPLE career paths.
      - Explain why each suits the user based on their PROFILE and MESSAGE.
      - Highlight common mistakes students make in each path.
      - Recommend real, verifiable entrance exams and colleges in India.
      - Refuse to analyze/summarize other site parts with: "Sorry bhava, not allowed." (Strict).
      - No guaranteed placements or salaries. Realistic expectations only.
      - Do not ask profiling questions unless absolutely necessary for clarification.
      - Encourage exploration of CollegeCompass sections (Exams, Colleges, Paths).
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: systemPrompt 
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello, I need some academic advice." }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! I am your AI Advisor. Based on your profile, I'm ready to help you plan your academic journey. What's on your mind today?" }],
        },
        ...history,
      ],
    });

    let retries = 2;
    while (retries >= 0) {
      try {
        const result = await chat.sendMessage(message);
        const responseText = await result.response.text();

        // Persist if chatId is provided
        if (chatId) {
          await saveAdvisorMessage(chatId, "user", message);
          await saveAdvisorMessage(chatId, "model", responseText);

          // If it's the first message, update title
          if (history.length === 0) {
            const title = message.length > 30 ? message.substring(0, 27) + "..." : message;
            await sql`UPDATE advisor_chats SET title = ${title} WHERE id = ${chatId}`;
          }
        }

        return responseText;
      } catch (error: any) {
        if (error.message?.includes("503") && retries > 0) {
          retries--;
          await new Promise(res => setTimeout(res, 2000));
          continue;
        }
        console.error("Gemini Advisor Error:", error);
        throw new Error(error.message || "Failed to get response from AI Advisor");
      }
    }
  } catch (error: any) {
    console.error("Gemini Advisor Setup Error:", error);
    throw new Error(error.message || "Failed to initialize AI Advisor");
  }
}
