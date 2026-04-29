"use server";

export interface RoundPrediction {
  round_name: string;
  predicted_cutoff: number;
  status: "SECURED" | "WAITLIST";
}

export interface Competitor {
  college_name: string;
  avg_rank: number;
  similarity_score: number;
  course_name?: string;
}

export interface AIAnalysisResponse {
  predicted_rank: number;
  round_predictions: RoundPrediction[];
  earliest_round: string;
  final_verdict: string;
  trend_tag: string;
  is_anomaly: boolean;
  anomaly_score: number;
  admission_probability: number;
  volatility_score: number;
  stability_score: number;
  competitors: Competitor[];
  recommended_round: string;
  strategy_insights: string[];
  insights: string[];
  region_competition_index: number;
  user_location_context?: string;
  coordinates?: { lat: number; lng: number };
}

export interface AIAnalysisRequest {
  counseling_source: string;
  exam_type: string;
  college_name: string;
  course_name: string;
  category: string;
  user_rank: number;
  user_location?: string;
  history?: number[];
}

export async function getAIAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse | null> {
  const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/v1/trends/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error(`AI Analysis Service Error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch AI analysis:", error);
    return null;
  }
}
