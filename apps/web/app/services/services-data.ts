export interface ServicePriceOption {
  duration: number; // in minutes
  price: number;
}

export interface ServiceDetail {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  price: number; // base price
  duration: number; // base duration
  priceOptions?: ServicePriceOption[];
  image: string;
  benefits?: string[];
  steps?: string[];
}

export const FALLBACK_SERVICES: ServiceDetail[] = [
  // Massage Therapy
  {
    id: "aura-swedish",
    name: "Aura Signature Swedish",
    category: "Massage Therapy",
    description: "A classic, deeply relaxing treatment utilizing long, flowing strokes to improve circulation and melt away everyday stress.",
    longDescription: "Our Signature Swedish massage is the ultimate therapeutic escape. Designed to soothe muscles and calm the mind, this treatment uses custom organic aromatherapy oils combined with classic, flowing effleurage strokes, kneading, and gentle friction to stimulate lymphatic flow and reduce emotional stress.",
    price: 150,
    duration: 60,
    priceOptions: [
      { duration: 60, price: 150 },
      { duration: 90, price: 210 }
    ],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
    benefits: [
      "Deeply relaxes the nervous system",
      "Increases blood flow and oxygenation",
      "Reduces physical tension and muscle tightness",
      "Improves joint flexibility and range of motion"
    ],
    steps: [
      "Initial sensory consultation and organic essential oil selection",
      "Full body classic Swedish massage with long, rhythmic strokes",
      "Focused neck and shoulder release with warmed luxury compresses",
      "Closing mindfulness ritual and warm herbal tea infusion"
    ]
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue Restoration",
    category: "Massage Therapy",
    description: "Intensive therapy focusing on deeper muscle layers to relieve chronic tension and facilitate recovery.",
    longDescription: "Reclaim structural balance and release deep-seated physical strain. Our Deep Tissue Restoration utilizes slow, deliberate strokes and deep finger pressure to target the inner layers of your muscles, tendons, and fascia. It is especially beneficial for chronic aches, stiffness, and athletic recovery.",
    price: 165,
    duration: 60,
    priceOptions: [
      { duration: 60, price: 165 },
      { duration: 90, price: 230 }
    ],
    image: "https://images.unsplash.com/photo-1600428842901-83b51bbd01a1?auto=format&fit=crop&q=80&w=1000",
    benefits: [
      "Releases chronic muscle tension and adhesions",
      "Promotes faster athletic and injury recovery",
      "Improves posture and muscular alignment",
      "Reduces chronic back, neck, and shoulder discomfort"
    ],
    steps: [
      "Physical tension assessment and pressure-preference discussion",
      "Gradual muscle warming using organic base oils",
      "Targeted deep tissue manipulation and trigger point therapy",
      "Restorative cooling botanical balm application"
    ]
  },
  {
    id: "warm-stone",
    name: "Warm Basalt Stone",
    category: "Massage Therapy",
    description: "Smooth, heated stones are gently glided over the body to warm musculature and induce a state of profound relaxation.",
    longDescription: "An ancient therapeutic treatment that harnesses the grounding energy of the earth. Smooth, water-heated volcanic basalt stones are placed on key energy centers of the body and used as an extension of the therapist's hands. The deep, penetrating heat melts muscle stiffness and encourages a deep sense of peace.",
    price: 240,
    duration: 90,
    image: "https://images.unsplash.com/photo-1519697841567-ae09e574ec92?auto=format&fit=crop&q=80&w=1000",
    benefits: [
      "Melts muscle tension without intense pressure",
      "Promotes deep emotional grounding and calm",
      "Improves sleep quality and combats insomnia",
      "Boosts blood circulation and metabolic processes"
    ],
    steps: [
      "Earth connection and breathing exercise with warm stone holding",
      "Strategic placement of warm stones along energy meridians",
      "Heated stone full body gliding massage with premium jojoba oil",
      "Closing grounding ritual and warm botanical compress"
    ]
  },

  // Skin Care
  {
    id: "radiance-facial",
    name: "Radiance Renewal Facial",
    category: "Skin Care",
    description: "A tailored treatment designed to hydrate, brighten, and refine your complexion, leaving you with a lasting, healthy glow.",
    longDescription: "Unveil your skin's natural luminosity. This premium botanical facial is custom-blended using seasonal active botanical extracts, natural enzymes, and high-potency antioxidants. It gently exfoliates, deeply hydrates, and triggers cellular renewal for a visibly bright, fresh, and hydrated complexion.",
    price: 175,
    duration: 60,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1000",
    benefits: [
      "Instantly brightens and clarifies dull skin",
      "Replenishes cellular moisture barriers",
      "Refines skin texture and minimizes pores",
      "Protects skin from environmental stressors"
    ],
    steps: [
      "Double botanical oil cleanse and detailed skin analysis",
      "Gentle enzymatic exfoliation under warm herbal steam",
      "Hydrating active mask with customized face & neck massage",
      "Application of custom facial serums and rich botanical moisturizers"
    ]
  },
  {
    id: "cellular-therapy",
    name: "Age-Defying Cellular Therapy",
    category: "Skin Care",
    description: "An intensive facial targeting fine lines and loss of elasticity, incorporating lymphatic drainage and potent active serums.",
    longDescription: "The ultimate skin-rejuvenating ritual. This advanced age-defying treatment combines high-potency marine collagen, natural peptides, and active serums with specialized lymphatic massage and lifting techniques. It sculpts, firms, and smooths fine lines, promoting youthfulness at a cellular level.",
    price: 260,
    duration: 90,
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000",
    benefits: [
      "Visibly reduces fine lines and wrinkles",
      "Improves skin firmness, elasticity, and volume",
      "Stimulates lymphatic drainage to depuff",
      "Increases cellular renewal and collagen synthesis"
    ],
    steps: [
      "Deep purifying cleanse and preparation",
      "Gentle fruit-acid peel for profound resurfacing",
      "Specialized facial sculpting and lymphatic drainage massage",
      "Premium peptide mask application followed by gold-infused active serums"
    ]
  },

  // Holistic Wellness
  {
    id: "reflexology",
    name: "Reflexology Foot Ritual",
    category: "Holistic Wellness",
    description: "Ancient pressure-point techniques applied to the feet to stimulate energy flow and encourage healing throughout the entire body.",
    longDescription: "Re-center your energy from the ground up. This holistic therapeutic ritual focuses on the feet, where hundreds of nerve endings and reflex zones correspond to your organs and body systems. Using precise thumb and finger techniques, we release blockages and promote natural self-healing.",
    price: 120,
    duration: 45,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000",
    benefits: [
      "Balances total body energy systems (Qi)",
      "Relieves foot fatigue and lower leg swelling",
      "Promotes deep full body relaxation and stress relief",
      "Stimulates local circulation and nerve function"
    ],
    steps: [
      "Purifying foot bath with dead sea salts and seasonal herbs",
      "Soothing lower-leg warm compression",
      "Targeted precision reflexology point stimulation",
      "Moisturizing calf and foot massage with organic peppermint balm"
    ]
  },
  {
    id: "aromatherapy",
    name: "Aromatherapy Balancing",
    category: "Holistic Wellness",
    description: "A sensory journey utilizing custom-blended essential oils to elevate mood, reduce anxiety, and harmonize your spirit.",
    longDescription: "A fully immersive aromatherapy sensory ritual designed to restore emotional, mental, and physical equilibrium. We begin with a customized aromatic profile selection, utilizing 100% pure organic botanical essences to tailor a restorative light-to-medium touch full body oil massage.",
    price: 160,
    duration: 60,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000",
    benefits: [
      "Reduces emotional anxiety and mental fatigue",
      "Harmonizes mood and supports emotional well-being",
      "Soothes physical tension with gentle touch",
      "Improves sleep and enhances general vitality"
    ],
    steps: [
      "Aroma-profile discovery and mindfulness breathing exercises",
      "Full body gentle Swedish and acupressure massage flow",
      "Warm herbal pack application to the spine and solar plexus",
      "Facial pressure point touch with pure floral hydrosols"
    ]
  }
];

// Helper to support matching older IDs or newly designed IDs
export function getServiceById(id: string): ServiceDetail | undefined {
  // Try normal lookup
  const found = FALLBACK_SERVICES.find(s => s.id === id);
  if (found) return found;

  // Try mapping common standard IDs
  if (id === "s1" || id === "Therapeutic Massage") {
    return FALLBACK_SERVICES.find(s => s.id === "aura-swedish");
  }
  if (id === "s4" || id === "Rejuvenating Facial") {
    return FALLBACK_SERVICES.find(s => s.id === "radiance-facial");
  }
  if (id === "s3" || id === "Wellness Consultation") {
    return FALLBACK_SERVICES.find(s => s.id === "aromatherapy");
  }
  if (id === "s2" || id === "Aromatherapy Ritual") {
    return FALLBACK_SERVICES.find(s => s.id === "aromatherapy");
  }

  // Final loose string-matching fallback
  const lowerId = id.toLowerCase();
  return FALLBACK_SERVICES.find(s =>
    s.id.toLowerCase().includes(lowerId) ||
    s.name.toLowerCase().includes(lowerId) ||
    lowerId.includes(s.id.toLowerCase())
  );
}
