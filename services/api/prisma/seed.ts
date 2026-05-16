import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const prisma = new PrismaClient({
  datasourceUrl: "file:./dev.db",
} as any);

async function main() {
  console.log('Seeding database...');
  
  const novel = await prisma.novel.upsert({
    where: { slug: 'the-awakening' },
    update: {},
    create: {
      slug: 'the-awakening',
      title: 'The Awakening',
      description: 'A story of discovery.',
      chapters: {
        create: [
          {
            chapterNumber: 1,
            title: 'Chapter 1: The Call',
            content: JSON.stringify([
              "The wind howled through the ancient trees, their bare branches scratching against the windowpane like desperate fingers. In the dimly lit room, Elara sat huddled over the dusty tome, her eyes scanning the faded ink.",
              "She had been searching for this book for years, a relic from a forgotten age, said to hold the key to the lost city of Aethelgard. Her heart pounded against her ribs as she finally deciphered the final passage.",
              "The journey would be perilous, filled with unknown dangers and mythical beasts. But the promise of uncovering the truth, of proving her grandfather's theories, was a fire that burned brighter than any fear.",
              "With a resolute sigh, she closed the book. Tomorrow, at first light, she would leave the safety of her village. The Awakening had begun.",
              "Far away, in the heart of the shadowed mountains, a pair of crimson eyes snapped open. The seal was weakening. The time of waiting was drawing to a close."
            ])
          },
          {
            chapterNumber: 2,
            title: 'Chapter 2: Departure',
            content: JSON.stringify([
              "Dawn broke with a cold, grey light, painting the sky in shades of slate and pearl. Elara stood at the edge of the village, her breath pluming in the crisp air. Her pack was heavy, laden with provisions and the ancient tome.",
              "She cast one last look at the cluster of thatched-roof cottages, her home for as long as she could remember. A pang of melancholy tightened her chest, but she pushed it aside. Her path lay forward.",
              "The Whispering Woods loomed ahead, a dense tangle of ancient trees that seemed to drink the morning light. The villagers spoke of the woods in hushed tones, trading tales of spirits and shape-shifters.",
              "Elara tightened the straps of her pack and took her first step onto the moss-covered path. The forest swallowed her whole, the air growing thick with the scent of damp earth and decaying leaves.",
              "She hadn't gone far when she heard the first snap of a twig. It was faint, but unmistakable. Something was following her."
            ])
          }
        ]
      }
    }
  });

  console.log({ novel });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
