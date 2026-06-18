// services/blockerDetection.ts

import clientPool from "../utils/supabase/db";

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "is", "was", "are", "were", "have", "has", "had", "been",
  "still", "not", "no", "waiting", "wait", "blocked", "blocker", "issue",
  "problem", "from", "by", "i", "we", "they", "my", "our", "need", "cant",
  "cannot", "will", "would", "could", "should", "get", "got", "getting",
  "this", "that", "some", "also", "just", "than", "then", "when",
]);

function extractKeyword(text: string): string | null {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));

  if (!words.length) return null;

  return words.slice(0, 2).join(" ");
}

export async function detectAndFlagBlocker(
  teamId: string,
  userId: string,
  blockerText: string,
  date: string,
): Promise<void> {
  const db = await clientPool.connect();
  const keyword = extractKeyword(blockerText);
  if (!keyword) return;

  await db.query(
    `INSERT INTO blocker_flags
      (team_id, user_id, keyword, content, occurrence_count, first_seen, last_seen)
     VALUES ($1, $2, $3, $4, 1, $5, $5)
     ON CONFLICT (team_id, keyword) DO UPDATE SET
       occurrence_count = blocker_flags.occurrence_count + 1,
       last_seen = EXCLUDED.last_seen,
       resolved = false,
       resolved_at = null`,
    [teamId, userId, keyword, blockerText, date],
  );
}
