import type { TopicType, TopicProgress, GlobalStats, OptionKey } from '../types';

const STORAGE_KEY = 'mcq_portal_progress_v1';
const SETTINGS_KEY = 'mcq_portal_settings_v1';

export interface StorageData {
  progressByTopic: Record<TopicType, TopicProgress>;
}

export interface UserSettings {
  shuffleEnabled: boolean;
  theme: 'light' | 'dark';
}

const defaultProgressForTopic = (topic: TopicType): TopicProgress => ({
  topic,
  answers: {},
  lastActiveIndex: 0,
  bookmarkedIds: [],
  shuffledOrder: undefined,
});

export const getDefaultStorageData = (): StorageData => ({
  progressByTopic: {
    'Percentage': defaultProgressForTopic('Percentage'),
    'Ratio & Proportion': defaultProgressForTopic('Ratio & Proportion'),
    'Profit & Loss': defaultProgressForTopic('Profit & Loss'),
    'DSA': defaultProgressForTopic('DSA'),
  },
});

export const loadStorageData = (): StorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStorageData();
    const parsed = JSON.parse(raw);
    const defaultData = getDefaultStorageData();
    return {
      progressByTopic: {
        ...defaultData.progressByTopic,
        ...(parsed.progressByTopic || {}),
      },
    };
  } catch (err) {
    console.error('Failed to load storage data:', err);
    return getDefaultStorageData();
  }
};

export const saveStorageData = (data: StorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save storage data:', err);
  }
};

export const loadUserSettings = (): UserSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { shuffleEnabled: false, theme: 'light' };
    return JSON.parse(raw);
  } catch {
    return { shuffleEnabled: false, theme: 'light' };
  }
};

export const saveUserSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save user settings:', err);
  }
};

export const recordQuestionAnswer = (
  topic: TopicType,
  questionId: string,
  selectedAnswer: OptionKey,
  isCorrect: boolean
): StorageData => {
  const current = loadStorageData();
  const topicData = current.progressByTopic[topic] || defaultProgressForTopic(topic);
  
  topicData.answers[questionId] = {
    questionId,
    selectedAnswer,
    isCorrect,
    timestamp: Date.now(),
  };

  current.progressByTopic[topic] = topicData;
  saveStorageData(current);
  return current;
};

export const toggleQuestionBookmark = (topic: TopicType, questionId: string): boolean => {
  const current = loadStorageData();
  const topicData = current.progressByTopic[topic] || defaultProgressForTopic(topic);
  const exists = topicData.bookmarkedIds.includes(questionId);
  
  if (exists) {
    topicData.bookmarkedIds = topicData.bookmarkedIds.filter(id => id !== questionId);
  } else {
    topicData.bookmarkedIds.push(questionId);
  }

  current.progressByTopic[topic] = topicData;
  saveStorageData(current);
  return !exists;
};

export const updateLastActiveIndex = (topic: TopicType, index: number): void => {
  const current = loadStorageData();
  if (current.progressByTopic[topic]) {
    current.progressByTopic[topic].lastActiveIndex = index;
    saveStorageData(current);
  }
};

export const resetTopicProgress = (topic: TopicType): StorageData => {
  const current = loadStorageData();
  current.progressByTopic[topic] = defaultProgressForTopic(topic);
  saveStorageData(current);
  return current;
};

export const clearAllTopicProgress = (): StorageData => {
  const fresh = getDefaultStorageData();
  saveStorageData(fresh);
  return fresh;
};

export const calculateTopicStats = (progress: TopicProgress, totalQuestions: number) => {
  const answeredKeys = Object.keys(progress.answers);
  const totalAnswered = answeredKeys.length;
  const correctCount = answeredKeys.filter(id => progress.answers[id].isCorrect).length;
  const wrongCount = totalAnswered - correctCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const progressPercent = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  return {
    totalAnswered,
    correctCount,
    wrongCount,
    accuracy,
    progressPercent,
    isCompleted: totalAnswered === totalQuestions && totalQuestions > 0,
  };
};

export const calculateGlobalStats = (data: StorageData): GlobalStats => {
  let totalAttempted = 0;
  let totalCorrect = 0;

  Object.values(data.progressByTopic).forEach((topicProg) => {
    Object.values(topicProg.answers).forEach((ans) => {
      totalAttempted += 1;
      if (ans.isCorrect) totalCorrect += 1;
    });
  });

  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return {
    totalAttempted,
    totalCorrect,
    overallAccuracy,
  };
};
