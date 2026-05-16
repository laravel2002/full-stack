export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string[];
}

export interface Novel {
  slug: string;
  title: string;
  chapters: Chapter[];
}

export const mockNovel: Novel = {
  slug: 'the-awakening',
  title: 'The Awakening',
  chapters: [
    {
      id: 'chapter-1',
      number: 1,
      title: 'Chapter 1: The Storm',
      content: [
        "The rain hammered relentlessly against the grimy windowpane, each drop a tiny, frantic drumbeat against the glass. Elara sat in the dimly lit room, the glow of the holographic display casting sharp shadows across her face. She adjusted the neural link resting against her temple, ignoring the dull throb it always produced after hours of deep-dive data sifting.",
        "\"There has to be something,\" she muttered to herself, her voice barely a whisper against the storm outside.",
        "She had been following the ghost signal for three days now. It was a chaotic, fragmented burst of code that appeared and vanished within the city's under-grid, a digital phantom that defied all tracking algorithms. Her employer, a shadowy syndicate known only as 'The Obsidian Order', was paying a small fortune for its capture. But Elara wasn't just in it for the credits. The code felt familiar, like a half-remembered dream.",
        "With a sigh, she leaned back, closing her eyes. The interface shifted, interpreting her brainwaves and displaying a sprawling, three-dimensional representation of the sector's data flows. It was a beautiful, terrifying maze of light and shadow, representing millions of lives, secrets, and transactions.",
        "Suddenly, a flicker. A disturbance in the deep net.",
        "Her eyes snapped open. It wasn't the ghost signal. It was something else. A massive, coordinated breach tearing through the Outer Sector's firewalls. The sheer volume of data being exfiltrated was staggering.",
        "Elara's fingers flew across the tactile interface, bringing up security feeds. The Outer Sector was a slum, a forgotten zone where the city's poorest lived in the shadows of the towering corporate spires. But right now, it was the epicenter of a massive cyber-attack."
      ]
    },
    {
      id: 'chapter-2',
      number: 2,
      title: 'Chapter 2: The Breach',
      content: [
        "\"What are they after?\" she wondered, a cold knot of dread tightening in her stomach.",
        "The feeds showed chaotic scenes. Automated defense drones were spinning wildly out of control, targeting civilian structures. The local enforcer units were paralyzed, their systems locked down by the unknown attackers.",
        "She had a choice. Ignore it, focus on her highly paid contract, or intervene. It wasn't her sector. It wasn't her problem. But as she watched the feeds, she saw a child crying in the street, an automated drone hovering menacingly above him.",
        "Elara cursed softly. \"Alright,\" she said, her voice hard. \"Let's see what you've got.\"",
        "She shifted her focus, diving headfirst into the chaotic data stream. The interface dissolved around her, replaced by a swirling vortex of code and light. She was no longer sitting in her grimy apartment; she was a digital entity, slicing through firewalls and bypassing security protocols with practiced ease.",
        "The attackers were good, their code elegant and brutal. But Elara was better. She was a legend in the under-grid, a phantom hacker known as 'Cipher'. And right now, she was pissed off.",
        "She deployed counter-measures, a series of viral algorithms designed to disrupt the attackers' command and control structures. It was a risky move, one that could expose her own position, but she didn't care.",
        "The impact was immediate. The attackers' code shuddered, their exfiltration stalling. The automated drones in the Outer Sector hesitated, their targeting systems confused by the sudden influx of junk data."
      ]
    },
    {
      id: 'chapter-3',
      number: 3,
      title: 'Chapter 3: The Leviathan',
      content: [
        "Elara pushed harder, riding the chaotic currents of the network, searching for the source of the attack. And then, she saw it. A massive, shadowy construct hovering at the edge of the network, a digital leviathan orchestrating the chaos.",
        "It was The Obsidian Order.",
        "The realization hit her like a physical blow. Her employers were the ones attacking the Outer Sector. But why?",
        "Before she could process the betrayal, the construct turned its attention towards her. A massive, overwhelming wave of malicious code crashed against her defenses, threatening to tear her digital avatar apart.",
        "Elara fought back, her mind racing as she deployed every trick she knew. The battle was fought in microseconds, a silent, deadly clash of code and willpower.",
        "In the end, she had to retreat, severing the connection before her neural link overloaded. She slammed back into her physical body, gasping for air, her head throbbing with a blinding pain.",
        "The room was silent, the storm outside seeming muted in comparison to the digital war she had just experienced. She had survived, but she had made a powerful enemy. The Obsidian Order would not forget this.",
        "She looked out the window, at the towering spires of the city, and made a decision. She was no longer just a hacker for hire. She was a target. And she was going to find out why."
      ]
    }
  ]
};

export const mockNovels: Novel[] = [
  mockNovel,
  {
    slug: 'cybernetic-dawn',
    title: 'Cybernetic Dawn',
    chapters: [
      {
        id: 'cd-chapter-1',
        number: 1,
        title: 'Chapter 1: The Wires',
        content: ["Neon lights reflected in the puddles...", "It was a cold night in Neo-Tokyo."]
      }
    ]
  },
  {
    slug: 'obsidian-echoes',
    title: 'Obsidian Echoes',
    chapters: [
      {
        id: 'oe-chapter-1',
        number: 1,
        title: 'Chapter 1: The Void',
        content: ["Space was never truly silent...", "The hum of the engines was a constant companion."]
      }
    ]
  }
];

export function getNovel(slug: string): Novel | null {
  return mockNovels.find(n => n.slug === slug) || null;
}

export function getAllNovels(): Novel[] {
  return mockNovels;
}

export function getChapter(slug: string, chapterNumber: number): Chapter | null {
  const novel = getNovel(slug);
  if (!novel) return null;
  return novel.chapters.find(c => c.number === chapterNumber) || null;
}

export function getAdjacentChapters(slug: string, chapterNumber: number) {
  const novel = getNovel(slug);
  if (!novel) return { prev: null, next: null };
  
  return {
    prev: novel.chapters.find(c => c.number === chapterNumber - 1) || null,
    next: novel.chapters.find(c => c.number === chapterNumber + 1) || null,
  };
}
