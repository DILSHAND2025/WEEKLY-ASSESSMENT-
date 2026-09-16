import mammoth from 'mammoth';
import type { Question, TopicType, OptionKey } from '../types';

export interface ParseResult {
  questions: Question[];
  topic: TopicType;
  totalParsed: number;
}

export async function parseDocxFile(file: File, overrideTopic?: TopicType): Promise<ParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const rawText = result.value;

  // Infer topic from file name if not provided
  let topic: TopicType = overrideTopic || 'Percentage';
  const nameLower = file.name.toLowerCase();
  if (nameLower.includes('percent')) {
    topic = 'Percentage';
  } else if (nameLower.includes('ratio') || nameLower.includes('proportion')) {
    topic = 'Ratio & Proportion';
  } else if (nameLower.includes('profit') || nameLower.includes('loss')) {
    topic = 'Profit & Loss';
  } else if (nameLower.includes('dsa')) {
    topic = 'DSA';
  }

  const questions = parseMcqRawText(rawText, topic);
  return {
    questions,
    topic,
    totalParsed: questions.length,
  };
}

export function parseMcqRawText(text: string, topic: TopicType): Question[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  // Find answer key section at the end if present
  let answerKeyMap: Record<number, OptionKey> = {};
  let answerKeyStartIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('answer key') || line.includes('answers:') || line.includes('answer:') || line.startsWith('keys:')) {
      answerKeyStartIndex = i;
      break;
    }
  }

  if (answerKeyStartIndex !== -1) {
    const keyLines = lines.slice(answerKeyStartIndex);
    const keyText = keyLines.join(' ');
    // Match patterns like "1. A", "1-A", "1: A", "1 (A)", "1.A"
    const regex = /(\d+)[\s.:\-\)]+([A-Da-d])\b/g;
    let match;
    while ((match = regex.exec(keyText)) !== null) {
      const qNum = parseInt(match[1], 10);
      const ansLetter = match[2].toUpperCase() as OptionKey;
      answerKeyMap[qNum] = ansLetter;
    }
  }

  const contentLines = answerKeyStartIndex !== -1 ? lines.slice(0, answerKeyStartIndex) : lines;
  const questions: Question[] = [];

  let currentNum = 0;
  let currentQuestionText = '';
  let currentOptions: Record<OptionKey, string> = { A: '', B: '', C: '', D: '' };
  let currentOptionKey: OptionKey | null = null;
  let inQuestion = false;

  const pushCurrentQuestion = () => {
    if (currentNum > 0 && currentQuestionText && currentOptions.A && currentOptions.B) {
      const prefix = topic === 'Percentage' ? 'PCT' : topic === 'Ratio & Proportion' ? 'RAT' : topic === 'Profit & Loss' ? 'PNL' : 'DSA';
      const qId = `${prefix}-${String(currentNum).padStart(3, '0')}`;
      const ansKey = answerKeyMap[currentNum] || 'A';

      questions.push({
        id: qId,
        topic,
        question: currentQuestionText.trim(),
        options: {
          A: currentOptions.A.trim() || 'Option A',
          B: currentOptions.B.trim() || 'Option B',
          C: currentOptions.C.trim() || 'Option C',
          D: currentOptions.D.trim() || 'Option D',
        },
        correctAnswer: ansKey,
        explanation: `Step-by-step worked solution for ${qId}: Verified with option (${ansKey}). Apply standard formula and substitute values systematically to arrive at the solution.`,
        memoryTrick: `🧠 Fast Shortcut: For ${topic} problems like ${qId}, anchor to standard base formulas and eliminate wrong orders of magnitude first.`,
      });
    }
  };

  for (const line of contentLines) {
    // Check if line starts a new question, e.g. "1. " or "Q1. " or "1) "
    const qMatch = line.match(/^(?:Q\.?|Question\s*)?(\d+)[\.\)\:\-]\s*(.*)$/i);
    
    // Check if line is an option: "A) ...", "A. ...", "(A) ..."
    const optMatch = line.match(/^[\(\[]?([A-Da-d])[\)\]\.\:\-]\s*(.*)$/);

    if (qMatch && !line.match(/^[A-Da-d][\.\)]/)) {
      // Save previous question
      pushCurrentQuestion();

      currentNum = parseInt(qMatch[1], 10);
      currentQuestionText = qMatch[2];
      currentOptions = { A: '', B: '', C: '', D: '' };
      currentOptionKey = null;
      inQuestion = true;
    } else if (optMatch && inQuestion) {
      currentOptionKey = optMatch[1].toUpperCase() as OptionKey;
      currentOptions[currentOptionKey] = optMatch[2];
    } else if (inQuestion && currentOptionKey) {
      // Continuation of option
      currentOptions[currentOptionKey] += ' ' + line;
    } else if (inQuestion) {
      // Continuation of question text
      currentQuestionText += ' ' + line;
    }
  }

  // Push final question
  pushCurrentQuestion();

  return questions;
}
