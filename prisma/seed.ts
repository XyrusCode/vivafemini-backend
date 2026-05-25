import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYMPTOMS = [
  // Physical Pain
  { category: 'physical_pain', colorCode: '#ef4444', iconEmoji: '😣', name: 'Cramps' },
  { category: 'physical_pain', colorCode: '#ef4444', iconEmoji: '🤕', name: 'Headache' },
  { category: 'physical_pain', colorCode: '#ef4444', iconEmoji: '😴', name: 'Fatigue' },
  { category: 'physical_pain', colorCode: '#ef4444', iconEmoji: '🤢', name: 'Nausea' },
  { category: 'physical_pain', colorCode: '#ef4444', iconEmoji: '🫀', name: 'Breast Tenderness' },
  { category: 'physical_pain', colorCode: '#ef4444', iconEmoji: '🩹', name: 'Back Pain' },
  { category: 'physical_pain', colorCode: '#ef4444', iconEmoji: '💧', name: 'Water Retention' },
  // Mood & Mental
  { category: 'mood_mental', colorCode: '#8b5cf6', iconEmoji: '😊', name: 'Happy' },
  { category: 'mood_mental', colorCode: '#8b5cf6', iconEmoji: '😐', name: 'Neutral' },
  { category: 'mood_mental', colorCode: '#8b5cf6', iconEmoji: '😢', name: 'Sad' },
  { category: 'mood_mental', colorCode: '#8b5cf6', iconEmoji: '😤', name: 'Irritable' },
  { category: 'mood_mental', colorCode: '#8b5cf6', iconEmoji: '🌊', name: 'Mood Swings' },
  { category: 'mood_mental', colorCode: '#8b5cf6', iconEmoji: '🧠', name: 'Brain Fog' },
  // Digestion & Appetite
  { category: 'digestion_appetite', colorCode: '#f59e0b', iconEmoji: '🫃', name: 'Bloating' },
  { category: 'digestion_appetite', colorCode: '#f59e0b', iconEmoji: '🤢', name: 'Nausea' },
  { category: 'digestion_appetite', colorCode: '#f59e0b', iconEmoji: '🍫', name: 'Cravings' },
  { category: 'digestion_appetite', colorCode: '#f59e0b', iconEmoji: '😮', name: 'Increased Appetite' },
  { category: 'digestion_appetite', colorCode: '#f59e0b', iconEmoji: '😑', name: 'Loss of Appetite' },
  // Period Indicators
  { category: 'period_indicators', colorCode: '#ec4899', iconEmoji: '🩸', name: 'Spotting' },
  { category: 'period_indicators', colorCode: '#ec4899', iconEmoji: '⬆️', name: 'Heavy Flow' },
  { category: 'period_indicators', colorCode: '#ec4899', iconEmoji: '⬇️', name: 'Light Flow' },
  // Sexual Health
  { category: 'sexual_health', colorCode: '#06b6d4', iconEmoji: '❤️', name: 'Increased Libido' },
  { category: 'sexual_health', colorCode: '#06b6d4', iconEmoji: '🌡️', name: 'Decreased Libido' },
  { category: 'sexual_health', colorCode: '#06b6d4', iconEmoji: '💧', name: 'Vaginal Discharge' },
] as const;

async function main() {
  console.log('🌱 Seeding symptoms…');
  for (const symptom of SYMPTOMS) {
    await prisma.symptom.upsert({
      create: symptom,
      update: {},
      where: { name: symptom.name },
    });
  }
  console.log(`✅ Seeded ${SYMPTOMS.length} symptoms`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
