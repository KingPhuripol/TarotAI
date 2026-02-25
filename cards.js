const TAROT_CARDS = [
  // MAJOR ARCANA
  {
    id: 0,
    name: "The Fool",
    arcana: "Major",
    element: "Air",
    suit: null,
    number: 0,
    keywords: ["beginnings", "spontaneity", "innocence", "freedom"],
    upright:
      "A new journey begins. Embrace the unknown with an open heart and trust in the universe.",
    reversed:
      "Recklessness and naivety. Pause before leaping into the unknown.",
  },
  {
    id: 1,
    name: "The Magician",
    arcana: "Major",
    element: "Air",
    suit: null,
    number: 1,
    keywords: ["willpower", "skill", "manifestation", "resourcefulness"],
    upright:
      "You have all the tools you need. Channel your will and manifest your desires into reality.",
    reversed: "Manipulation and deceit. Hidden talents remain untapped.",
  },
  {
    id: 2,
    name: "The High Priestess",
    arcana: "Major",
    element: "Water",
    suit: null,
    number: 2,
    keywords: ["intuition", "mystery", "subconscious", "inner voice"],
    upright:
      "Trust your intuition. Hidden knowledge awaits those who look inward.",
    reversed:
      "Secrets withheld. Your inner voice is being suppressed or ignored.",
  },
  {
    id: 3,
    name: "The Empress",
    arcana: "Major",
    element: "Earth",
    suit: null,
    number: 3,
    keywords: ["abundance", "femininity", "nature", "nurturing"],
    upright:
      "Abundance and fertility surround you. A time of creation, beauty, and growth.",
    reversed: "Creative block or dependence. Nurture yourself before others.",
  },
  {
    id: 4,
    name: "The Emperor",
    arcana: "Major",
    element: "Fire",
    suit: null,
    number: 4,
    keywords: ["authority", "structure", "stability", "control"],
    upright:
      "Structure and discipline lead to success. Assert your authority with wisdom.",
    reversed: "Tyranny and rigidity. Excessive control stifles growth.",
  },
  {
    id: 5,
    name: "The Hierophant",
    arcana: "Major",
    element: "Earth",
    suit: null,
    number: 5,
    keywords: ["tradition", "conformity", "morality", "ethics"],
    upright:
      "Seek guidance from tradition and established wisdom. A mentor may appear.",
    reversed: "Dogma and restriction. Challenge outdated beliefs.",
  },
  {
    id: 6,
    name: "The Lovers",
    arcana: "Major",
    element: "Air",
    suit: null,
    number: 6,
    keywords: ["love", "harmony", "relationships", "choices"],
    upright:
      "A meaningful connection deepens. Alignment of values brings harmony and union.",
    reversed:
      "Disharmony and misaligned values. A difficult choice must be made.",
  },
  {
    id: 7,
    name: "The Chariot",
    arcana: "Major",
    element: "Water",
    suit: null,
    number: 7,
    keywords: ["control", "willpower", "victory", "assertion"],
    upright:
      "Victory through determination. Harness opposing forces and drive forward with confidence.",
    reversed: "Lack of control and aggression. Direction is lost.",
  },
  {
    id: 8,
    name: "Strength",
    arcana: "Major",
    element: "Fire",
    suit: null,
    number: 8,
    keywords: ["courage", "patience", "inner strength", "compassion"],
    upright:
      "True strength comes from within. Face your fears with compassion and quiet courage.",
    reversed: "Self-doubt and inner weakness. Courage must be rekindled.",
  },
  {
    id: 9,
    name: "The Hermit",
    arcana: "Major",
    element: "Earth",
    suit: null,
    number: 9,
    keywords: ["soul-searching", "introspection", "solitude", "guidance"],
    upright:
      "Withdraw from the noise. Solitary reflection illuminates the path forward.",
    reversed: "Isolation and loneliness. Withdrawal becomes unhealthy.",
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    arcana: "Major",
    element: "Fire",
    suit: null,
    number: 10,
    keywords: ["good luck", "karma", "life cycles", "destiny"],
    upright:
      "The wheel turns in your favor. Cycles of change bring new opportunities.",
    reversed: "Bad luck and resistance to change. The cycle feels endless.",
  },
  {
    id: 11,
    name: "Justice",
    arcana: "Major",
    element: "Air",
    suit: null,
    number: 11,
    keywords: ["fairness", "truth", "cause and effect", "law"],
    upright:
      "Truth prevails. Actions and consequences are perfectly balanced by the universe.",
    reversed: "Injustice and dishonesty. Accountability is avoided.",
  },
  {
    id: 12,
    name: "The Hanged Man",
    arcana: "Major",
    element: "Water",
    suit: null,
    number: 12,
    keywords: ["suspension", "restriction", "letting go", "new perspectives"],
    upright:
      "Surrender to the moment. Pause and see the world from a different angle.",
    reversed: "Needless sacrifice and stalling. Martyrdom serves no purpose.",
  },
  {
    id: 13,
    name: "Death",
    arcana: "Major",
    element: "Water",
    suit: null,
    number: 13,
    keywords: ["endings", "change", "transformation", "transition"],
    upright:
      "An ending paves the way for a profound new beginning. Embrace the transformation.",
    reversed: "Resistance to change. Fear of endings keeps you stagnant.",
  },
  {
    id: 14,
    name: "Temperance",
    arcana: "Major",
    element: "Fire",
    suit: null,
    number: 14,
    keywords: ["balance", "moderation", "patience", "purpose"],
    upright:
      "Find the middle path. Patience and moderation bring everything into perfect balance.",
    reversed: "Imbalance and excess. Extremes in behavior create disharmony.",
  },
  {
    id: 15,
    name: "The Devil",
    arcana: "Major",
    element: "Earth",
    suit: null,
    number: 15,
    keywords: ["shadow self", "attachment", "addiction", "restriction"],
    upright:
      "You are bound only by what you believe. Examine the chains that hold you.",
    reversed:
      "Detachment and freedom. The bonds that once held you begin to loosen.",
  },
  {
    id: 16,
    name: "The Tower",
    arcana: "Major",
    element: "Fire",
    suit: null,
    number: 16,
    keywords: ["sudden change", "upheaval", "chaos", "revelation"],
    upright:
      "Sudden upheaval shatters illusions. What falls was never meant to last.",
    reversed:
      "Avoiding disaster. Fear of necessary change delays the inevitable.",
  },
  {
    id: 17,
    name: "The Star",
    arcana: "Major",
    element: "Air",
    suit: null,
    number: 17,
    keywords: ["hope", "inspiration", "serenity", "renewal"],
    upright:
      "Hope and renewal shine after darkness. The universe offers healing and guidance.",
    reversed: "Hopelessness and despair. Disconnection from faith.",
  },
  {
    id: 18,
    name: "The Moon",
    arcana: "Major",
    element: "Water",
    suit: null,
    number: 18,
    keywords: ["illusion", "fear", "unconscious", "confusion"],
    upright:
      "Nothing is what it seems. Navigate the shadow of the unconscious with caution.",
    reversed: "Releasing fear. The fog of confusion begins to lift.",
  },
  {
    id: 19,
    name: "The Sun",
    arcana: "Major",
    element: "Fire",
    suit: null,
    number: 19,
    keywords: ["positivity", "fun", "warmth", "success"],
    upright:
      "Joy, success, and vitality radiate outward. Clarity and happiness illuminate your path.",
    reversed:
      "Temporary depression and pessimism. The light is briefly obscured.",
  },
  {
    id: 20,
    name: "Judgement",
    arcana: "Major",
    element: "Fire",
    suit: null,
    number: 20,
    keywords: ["judgement", "rebirth", "inner calling", "absolution"],
    upright:
      "A calling to reflect and rise. Heed the higher voice and step into your true purpose.",
    reversed:
      "Self-doubt and ignoring the inner call. Fear of judgement stifles growth.",
  },
  {
    id: 21,
    name: "The World",
    arcana: "Major",
    element: "Earth",
    suit: null,
    number: 21,
    keywords: ["completion", "integration", "accomplishment", "travel"],
    upright:
      "A cycle reaches wholeness. You stand at the pinnacle of a great achievement.",
    reversed:
      "Incompletion and stagnation. Loose ends prevent forward movement.",
  },

  // MINOR ARCANA – WANDS (Fire)
  {
    id: 22,
    name: "Ace of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 1,
    keywords: ["inspiration", "new ideas", "passion", "creation"],
    upright: "A spark of inspiration ignites a bold new venture.",
    reversed: "Delays and lack of direction. Creative energy is blocked.",
  },
  {
    id: 23,
    name: "Two of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 2,
    keywords: ["planning", "future vision", "discovery", "boldness"],
    upright:
      "Stand tall and look ahead. A grand plan takes its first bold steps.",
    reversed: "Indecision and fear of the unknown. Plans remain on paper.",
  },
  {
    id: 24,
    name: "Three of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 3,
    keywords: ["expansion", "opportunities", "foresight", "trade"],
    upright:
      "Your efforts expand beyond the horizon. Opportunity arrives from afar.",
    reversed: "Obstacles abroad and delays. Results take longer than expected.",
  },
  {
    id: 25,
    name: "Four of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 4,
    keywords: ["celebration", "harmony", "homecoming", "community"],
    upright:
      "A joyful gathering and a moment of celebration. Home and community bring harmony.",
    reversed: "Lack of support and instability at home. Joy is delayed.",
  },
  {
    id: 26,
    name: "Five of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 5,
    keywords: ["conflict", "competition", "disagreements", "chaos"],
    upright:
      "Competing forces surround you. Channel conflict into productive energy.",
    reversed: "Avoiding conflict. Inner tensions need to be resolved.",
  },
  {
    id: 27,
    name: "Six of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 6,
    keywords: ["victory", "success", "public reward", "progress"],
    upright:
      "Recognition and triumph are at hand. Your efforts are seen and celebrated.",
    reversed:
      "Egotism and failure after initial success. Pride comes before a fall.",
  },
  {
    id: 28,
    name: "Seven of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 7,
    keywords: ["perseverance", "defiance", "conviction", "challenge"],
    upright:
      "Stand your ground. Your position is worth defending against all challengers.",
    reversed: "Giving up and overwhelm. The battle feels impossible to win.",
  },
  {
    id: 29,
    name: "Eight of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 8,
    keywords: ["speed", "action", "swift change", "news"],
    upright:
      "Events accelerate rapidly. A swift resolution or an important message arrives.",
    reversed: "Delays and losing momentum. Movement suddenly stops.",
  },
  {
    id: 30,
    name: "Nine of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 9,
    keywords: ["resilience", "last stand", "persistence", "test"],
    upright:
      "You are close to the end. One last push with perseverance secures victory.",
    reversed: "Exhaustion and refusal to move forward. Paranoia takes hold.",
  },
  {
    id: 31,
    name: "Ten of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 10,
    keywords: ["burden", "responsibility", "stress", "hard work"],
    upright:
      "Heavy obligations weigh you down. Delegate and let go of what is not yours to carry.",
    reversed: "Inability to delegate. The burden crushes what you built.",
  },
  {
    id: 32,
    name: "Page of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 11,
    keywords: ["enthusiasm", "exploration", "discovery", "youthfulness"],
    upright: "An enthusiastic spirit eager to explore new creative territory.",
    reversed:
      "Lack of direction and immaturity. Enthusiasm without follow-through.",
  },
  {
    id: 33,
    name: "Knight of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 12,
    keywords: ["energy", "action", "adventure", "impulsiveness"],
    upright:
      "Charge forward with fierce energy and lust for adventure. Act boldly.",
    reversed:
      "Recklessness and volatility. Passion without a plan causes havoc.",
  },
  {
    id: 34,
    name: "Queen of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 13,
    keywords: ["vivacity", "courage", "confidence", "boldness"],
    upright:
      "A magnetic, confident presence. Lead with courage and inspire those around you.",
    reversed:
      "Jealousy and insecurity. Power is used to intimidate rather than inspire.",
  },
  {
    id: 35,
    name: "King of Wands",
    arcana: "Minor",
    element: "Fire",
    suit: "Wands",
    number: 14,
    keywords: ["leadership", "vision", "entrepreneur", "honour"],
    upright:
      "A visionary leader with the will to transform ideas into reality.",
    reversed: "Impulsiveness and arrogance. Leadership becomes self-serving.",
  },

  // MINOR ARCANA – CUPS (Water)
  {
    id: 36,
    name: "Ace of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 1,
    keywords: ["love", "new feelings", "compassion", "creativity"],
    upright:
      "A wellspring of emotion and love overflows. A new relationship or creative awakening begins.",
    reversed: "Emotional blockage and emptiness. Love is offered but rejected.",
  },
  {
    id: 37,
    name: "Two of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 2,
    keywords: ["unity", "partnership", "attraction", "connection"],
    upright:
      "A deep mutual connection forms. Partnership, whether romantic or professional, flourishes.",
    reversed:
      "Imbalance and broken connection. A partnership loses its harmony.",
  },
  {
    id: 38,
    name: "Three of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 3,
    keywords: ["friendship", "celebration", "esteem", "community"],
    upright:
      "Joyful reunion and celebration with cherished friends. Community lifts your spirit.",
    reversed: "Overindulgence and superficiality. Social circles feel hollow.",
  },
  {
    id: 39,
    name: "Four of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 4,
    keywords: ["boredom", "contemplation", "apathy", "reevaluation"],
    upright:
      "Withdraw and reassess. An opportunity is being missed while you gaze inward.",
    reversed:
      "Apathy lifts. A sudden willingness to re-engage with life emerges.",
  },
  {
    id: 40,
    name: "Five of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 5,
    keywords: ["loss", "grief", "regret", "despair"],
    upright:
      "Grief over what has been lost. Yet two cups still stand full behind you.",
    reversed: "Acceptance of loss. Moving forward from grief toward healing.",
  },
  {
    id: 41,
    name: "Six of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 6,
    keywords: ["nostalgia", "childhood memories", "reunion", "innocence"],
    upright:
      "A return to innocence. Nostalgic memories bring warmth and comfort.",
    reversed:
      "Stuck in the past and refusing to grow. Idealism clouds judgment.",
  },
  {
    id: 42,
    name: "Seven of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 7,
    keywords: ["fantasy", "choices", "illusion", "wishful thinking"],
    upright:
      "Many paths appear before you. Discern carefully between illusion and reality.",
    reversed:
      "Clarity emerges after confusion. Illusions dissolve to reveal truth.",
  },
  {
    id: 43,
    name: "Eight of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 8,
    keywords: ["withdrawal", "disappointment", "leaving", "walking away"],
    upright:
      "Leave behind what no longer serves you in search of deeper meaning.",
    reversed:
      "Fear of moving on. Staying in an unfulfilling situation out of habit.",
  },
  {
    id: 44,
    name: "Nine of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 9,
    keywords: ["contentment", "satisfaction", "wishes", "luxury"],
    upright:
      "The wish card. Emotional and material contentment are within your grasp.",
    reversed:
      "Greed and dissatisfaction. Inner discontent despite outward success.",
  },
  {
    id: 45,
    name: "Ten of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 10,
    keywords: ["harmony", "marriage", "happiness", "alignment"],
    upright:
      "Complete emotional fulfillment. A loving, harmonious family and home.",
    reversed:
      "Shattered happiness. Dysfunctional relationships disturb the peace.",
  },
  {
    id: 46,
    name: "Page of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 11,
    keywords: ["creativity", "idealism", "sensitivity", "romanticism"],
    upright:
      "An emotionally intuitive messenger. Creative inspiration arrives unexpectedly.",
    reversed:
      "Emotional immaturity and escapism. Feelings are poorly expressed.",
  },
  {
    id: 47,
    name: "Knight of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 12,
    keywords: ["romance", "charm", "imagination", "idealism"],
    upright:
      "A romantic and imaginative pursuit. Follow your heart with grace.",
    reversed: "Moodiness and emotional manipulation. Unrealistic expectations.",
  },
  {
    id: 48,
    name: "Queen of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 13,
    keywords: ["compassion", "calm", "empathy", "inner voice"],
    upright:
      "Lead with empathy and deep emotional intuition. Your compassion heals others.",
    reversed:
      "Emotional insecurity and martyrdom. Boundaries must be established.",
  },
  {
    id: 49,
    name: "King of Cups",
    arcana: "Minor",
    element: "Water",
    suit: "Cups",
    number: 14,
    keywords: ["maturity", "calmness", "wisdom", "authority"],
    upright:
      "Emotional mastery and diplomacy. Lead with a compassionate and steady hand.",
    reversed:
      "Emotional manipulation and moodiness. Feelings become overwhelming.",
  },

  // MINOR ARCANA – SWORDS (Air)
  {
    id: 50,
    name: "Ace of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 1,
    keywords: ["clarity", "truth", "breakthrough", "new ideas"],
    upright:
      "A breakthrough of clarity and truth cuts through confusion. Mental power is at its peak.",
    reversed: "Clouded thinking and miscommunication. Confusion reigns.",
  },
  {
    id: 51,
    name: "Two of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 2,
    keywords: ["indecision", "stalemate", "blocked emotions", "choices"],
    upright:
      "A difficult choice demands honest reflection. Gather your thoughts before deciding.",
    reversed:
      "Heightened anxiety and information overload. A decision is long overdue.",
  },
  {
    id: 52,
    name: "Three of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 3,
    keywords: ["heartbreak", "grief", "sorrow", "separation"],
    upright:
      "Painful truths and heartbreak must be acknowledged to begin healing.",
    reversed: "Recovery from grief begins. Sorrow releases its grip.",
  },
  {
    id: 53,
    name: "Four of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 4,
    keywords: ["rest", "restoration", "contemplation", "recovery"],
    upright:
      "Step back and rest. Stillness restores the mind and prepares for the next battle.",
    reversed:
      "Restlessness prevents recovery. Burning out from relentless action.",
  },
  {
    id: 54,
    name: "Five of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 5,
    keywords: ["conflict", "defeat", "win at all costs", "dishonour"],
    upright:
      "A battle won at great cost. Consider whether victory was truly worth the price.",
    reversed: "Reconciliation and moving past conflict. Egos are set aside.",
  },
  {
    id: 55,
    name: "Six of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 6,
    keywords: ["transition", "change", "moving on", "rite of passage"],
    upright:
      "A calm passage to calmer waters. Leave turbulence behind and move forward.",
    reversed:
      "Unfinished business prevents forward motion. The journey is resisted.",
  },
  {
    id: 56,
    name: "Seven of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 7,
    keywords: ["deception", "strategy", "betrayal", "resourcefulness"],
    upright:
      "Caution is warranted. Not everything and everyone is as they appear.",
    reversed: "Confession and conscience. A deception is brought to light.",
  },
  {
    id: 57,
    name: "Eight of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 8,
    keywords: ["trapped", "restriction", "victimhood", "self-limitation"],
    upright:
      "You feel trapped, yet the binds are of your own making. The way out lies within.",
    reversed:
      "Freedom from self-imposed restriction. Reclaiming personal power.",
  },
  {
    id: 58,
    name: "Nine of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 9,
    keywords: ["anxiety", "nightmares", "despair", "mental anguish"],
    upright:
      "Anxiety consumes the night. Confront your fears — they are far larger in the dark.",
    reversed: "Releasing anxiety. Worst fears do not come to pass.",
  },
  {
    id: 59,
    name: "Ten of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 10,
    keywords: ["painful endings", "deep wounds", "betrayal", "crisis"],
    upright:
      "A painful ending reaches its lowest point. Dawn is imminent after this dark hour.",
    reversed: "Recovery and survival. Rising again from a crushing defeat.",
  },
  {
    id: 60,
    name: "Page of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 11,
    keywords: ["curiosity", "restlessness", "communication", "mental agility"],
    upright:
      "A sharp, curious mind investigates truth. Ideas are plentiful, though unformed.",
    reversed: "Haste and scattered thinking. All talk and no action.",
  },
  {
    id: 61,
    name: "Knight of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 12,
    keywords: ["assertive", "direct", "sharp-witted", "authoritative"],
    upright:
      "Charge forward with decisive, cutting clarity. Speed and intellect are your weapons.",
    reversed:
      "Recklessness and aggression. Action without thought leads to regret.",
  },
  {
    id: 62,
    name: "Queen of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 13,
    keywords: ["complexity", "quick thinking", "independence", "perception"],
    upright:
      "Clear perception and independent judgment guide you. Communicate with precision.",
    reversed: "Cold and cruel judgment. Bitterness clouds clear thinking.",
  },
  {
    id: 63,
    name: "King of Swords",
    arcana: "Minor",
    element: "Air",
    suit: "Swords",
    number: 14,
    keywords: ["authority", "truth", "integrity", "ethics"],
    upright:
      "Command through intellect and unwavering ethical authority. Truth is your standard.",
    reversed: "Abuse of power and manipulation. Intellect serves selfish ends.",
  },

  // MINOR ARCANA – PENTACLES (Earth)
  {
    id: 64,
    name: "Ace of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 1,
    keywords: [
      "new financial opportunity",
      "abundance",
      "security",
      "manifestation",
    ],
    upright:
      "A golden opportunity for material growth and prosperity. Seize it with both hands.",
    reversed:
      "Missed opportunities and poor financial planning. Lost potential.",
  },
  {
    id: 65,
    name: "Two of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 2,
    keywords: ["balance", "adaptability", "time management", "prioritize"],
    upright:
      "Juggle your responsibilities with agility and grace. Adaptability is your greatest asset.",
    reversed: "Overwhelmed by demands. Poor time management creates chaos.",
  },
  {
    id: 66,
    name: "Three of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 3,
    keywords: ["teamwork", "collaboration", "building", "skill"],
    upright:
      "Mastery through collaboration. Your skills and those of others combine for great results.",
    reversed: "Lack of teamwork and poor planning. Egos disrupt collaboration.",
  },
  {
    id: 67,
    name: "Four of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 4,
    keywords: ["control", "stability", "security", "frugality"],
    upright:
      "Protect what you have built, but do not let fear of loss prevent growth.",
    reversed:
      "Greed and excessive materialism. Hoarding creates spiritual poverty.",
  },
  {
    id: 68,
    name: "Five of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 5,
    keywords: ["financial loss", "poverty", "lack", "isolation"],
    upright:
      "A difficult period of hardship. Yet help and warmth are closer than you think.",
    reversed:
      "Recovery from financial hardship. Spiritual wealth replenishes the spirit.",
  },
  {
    id: 69,
    name: "Six of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 6,
    keywords: ["generosity", "charity", "giving", "prosperity"],
    upright:
      "Generosity flows in abundance. Give freely, and prosperity shall return to you.",
    reversed:
      "Charity with hidden motives. Gifts come with invisible strings attached.",
  },
  {
    id: 70,
    name: "Seven of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 7,
    keywords: ["long-term vision", "harvest", "patience", "reward"],
    upright:
      "Pause and assess your progress. Patient cultivation brings a rewarding harvest.",
    reversed:
      "Impatience and lack of long-term vision. Rewards are squandered.",
  },
  {
    id: 71,
    name: "Eight of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 8,
    keywords: ["diligence", "skill development", "detail", "craftsmanship"],
    upright:
      "Master your craft through focused, dedicated practice. Excellence is earned.",
    reversed:
      "Lack of focus and poor quality work. Skills remain underdeveloped.",
  },
  {
    id: 72,
    name: "Nine of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 9,
    keywords: ["luxury", "self-sufficiency", "abundance", "refinement"],
    upright:
      "Hard work blossoms into elegant abundance. Enjoy the fruits of your own making.",
    reversed: "Overinvestment in work and financial dependency on others.",
  },
  {
    id: 73,
    name: "Ten of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 10,
    keywords: ["wealth", "family", "legacy", "permanence"],
    upright:
      "Lasting wealth and a lasting legacy. Family, home, and heritage are your foundation.",
    reversed:
      "Family conflict and financial instability disrupt the legacy you built.",
  },
  {
    id: 74,
    name: "Page of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 11,
    keywords: ["opportunity", "ambition", "desire", "diligence"],
    upright:
      "A studious and grounded apprentice. Great potential begins to take shape.",
    reversed:
      "Lack of ambition and procrastination. Opportunities pass unnoticed.",
  },
  {
    id: 75,
    name: "Knight of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 12,
    keywords: ["hard work", "productivity", "routine", "conservatism"],
    upright:
      "Steady, reliable effort produces lasting results. Trust the slow and certain path.",
    reversed:
      "Perfectionism and boredom. Stubborn resistance to necessary change.",
  },
  {
    id: 76,
    name: "Queen of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 13,
    keywords: ["nurturing", "practical", "financial", "down-to-earth"],
    upright:
      "Practical nurturing that creates a warm, prosperous, and secure home.",
    reversed: "Self-care neglected. Financial anxieties undermine security.",
  },
  {
    id: 77,
    name: "King of Pentacles",
    arcana: "Minor",
    element: "Earth",
    suit: "Pentacles",
    number: 14,
    keywords: ["wealth", "business", "leadership", "security"],
    upright:
      "A grounded, prosperous leader. Security and ambition build an enduring empire.",
    reversed:
      "Stubbornness and materialism override wisdom. Corruption of values.",
  },
];

const SPREADS = {
  "three-card": {
    name: "อดีต · ปัจจุบัน · อนาคต",
    positions: ["อดีต", "ปัจจุบัน", "อนาคต"],
    description: "การปูไพ่สามใบแบบคลาสสิกที่สะท้อนเส้นทางชีวิตผ่านกาลเวลา",
  },
  "celtic-cross": {
    name: "Celtic Cross",
    positions: [
      "ปัจจุบัน",
      "อุปสรรค",
      "อดีตไกล",
      "อดีตใกล้",
      "อนาคตที่เป็นไปได้",
      "อนาคตอันใกล้",
      "แนวทางของคุณ",
      "สภาพแวดล้อม",
      "ความหวัง & ความกลัว",
      "ผลลัพธ์",
    ],
    description:
      "การปูไพ่สิบใบแบบดั้งเดิมที่ให้ข้อมูลเชิงลึกสำหรับสถานการณ์ซับซ้อน",
  },
  single: {
    name: "ไพ่ประจำวัน",
    positions: ["คำแนะนำ"],
    description: "ไพ่หนึ่งใบเพื่อชี้แนะวันของคุณหรือตอบคำถามโดยตรง",
  },
};

function drawCards(count) {
  const deck = [...TAROT_CARDS];
  const drawn = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * deck.length);
    const card = { ...deck.splice(idx, 1)[0] };
    card.reversed = Math.random() < 0.35;
    drawn.push(card);
  }
  return drawn;
}

function getElementColor(element) {
  const colors = {
    Fire: {
      primary: "#c8440a",
      secondary: "#f4a220",
      glow: "rgba(244, 162, 32, 0.5)",
    },
    Water: {
      primary: "#0d5fa8",
      secondary: "#5ab3e8",
      glow: "rgba(90, 179, 232, 0.5)",
    },
    Earth: {
      primary: "#2e6b2e",
      secondary: "#8dbd5a",
      glow: "rgba(141, 189, 90, 0.5)",
    },
    Air: {
      primary: "#7b4fa8",
      secondary: "#c89fe0",
      glow: "rgba(200, 159, 224, 0.5)",
    },
  };
  return colors[element] || colors["Air"];
}

function getDominantElement(cards) {
  const counts = { Fire: 0, Water: 0, Earth: 0, Air: 0 };
  cards.forEach((c) => {
    if (counts[c.element] !== undefined) counts[c.element]++;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}
