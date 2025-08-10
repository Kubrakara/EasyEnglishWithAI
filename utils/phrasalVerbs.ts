export type PhrasalVerbType = {
  id: string;
  verb: string;
  meaning: string;
  example: string;
};

export const PHRASAL_VERBS_DATA: PhrasalVerbType[] = [
  {
    id: "1",
    verb: "Ask out",
    meaning: "Birine çıkma teklif etmek",
    example: "He finally asked her out to dinner.",
  },
  {
    id: "2",
    verb: "Back down",
    meaning: "Geri adım atmak, iddiasından vazgeçmek",
    example: "She refused to back down in the argument.",
  },
  {
    id: "3",
    verb: "Break down",
    meaning: "Arızalanmak; kendini tutamayıp ağlamak",
    example: "The car broke down on the highway.",
  },
  {
    id: "4",
    verb: "Bring up",
    meaning: "Bir konuyu açmak; çocuk yetiştirmek",
    example: "Don't bring up politics at the family dinner.",
  },
  {
    id: "5",
    verb: "Call off",
    meaning: "İptal etmek",
    example: "They had to call off the meeting due to the storm.",
  },
  {
    id: "6",
    verb: "Carry on",
    meaning: "Devam etmek",
    example: "Please carry on with your work.",
  },
  {
    id: "7",
    verb: "Check in",
    meaning: "Otele veya havalimanına kayıt yaptırmak",
    example: "You need to check in at least two hours before your flight.",
  },
  {
    id: "8",
    verb: "Come across",
    meaning: "Tesadüfen bulmak, karşılaşmak",
    example: "I came across an old photo while cleaning my room.",
  },
  {
    id: "9",
    verb: "Count on",
    meaning: "Güvenmek, bel bağlamak",
    example: "You can always count on me for help.",
  },
  {
    id: "10",
    verb: "Cut back on",
    meaning: "Azaltmak, kısmak",
    example: "I'm trying to cut back on sugary drinks.",
  },
  {
    id: "11",
    verb: "Do over",
    meaning: "Yeniden yapmak, baştan yapmak",
    example: "The teacher told him to do the assignment over.",
  },
  {
    id: "12",
    verb: "Drop out",
    meaning: "Okulu veya bir yarışı bırakmak",
    example: "He dropped out of college after just one semester.",
  },
  {
    id: "13",
    verb: "Figure out",
    meaning: "Anlamak, çözmek",
    example: "I can't figure out how to solve this puzzle.",
  },
  {
    id: "14",
    verb: "Find out",
    meaning: "Öğrenmek, keşfetmek",
    example: "I need to find out what time the movie starts.",
  },
  {
    id: "15",
    verb: "Get along",
    meaning: "İyi geçinmek, anlaşmak",
    example: "My sister and I get along really well.",
  },
  {
    id: "16",
    verb: "Get away",
    meaning: "Kaçmak, bir yerden ayrılmak",
    example: "We're hoping to get away for a few days next month.",
  },
  {
    id: "17",
    verb: "Get over",
    meaning: "Bir hastalığı veya kötü bir durumu atlatmak",
    example: "It took him a long time to get over the flu.",
  },
  {
    id: "18",
    verb: "Give up",
    meaning: "Vazgeçmek, pes etmek",
    example: "Don't give up on your dreams.",
  },
  {
    id: "19",
    verb: "Go on",
    meaning: "Devam etmek",
    example: "The show must go on.",
  },
  {
    id: "20",
    verb: "Hold on",
    meaning: "Beklemek; sıkı tutunmak",
    example: "Hold on a minute, I'll be right back.",
  },
  {
    id: "21",
    verb: "Look after",
    meaning: "Bakmak, ilgilenmek",
    example: "Can you look after my cat while I'm on vacation?",
  },
  {
    id: "22",
    verb: "Look for",
    meaning: "Aramak",
    example: "I'm looking for my keys, have you seen them?",
  },
  {
    id: "23",
    verb: "Make up",
    meaning: "Uydurmak; barışmak; makyaj yapmak",
    example: "They had an argument, but they made up quickly.",
  },
  {
    id: "24",
    verb: "Pass out",
    meaning: "Bayılmak",
    example: "He passed out from the heat.",
  },
  {
    id: "25",
    verb: "Put off",
    meaning: "Ertelemek",
    example: "Never put off until tomorrow what you can do today.",
  },
  {
    id: "26",
    verb: "Run out of",
    meaning: "Tüketmek, bitirmek",
    example: "We've run out of milk, I need to go to the store.",
  },
  {
    id: "27",
    verb: "Set up",
    meaning: "Kurmak, ayarlamak",
    example: "We need to set up a new Wi-Fi router.",
  },
  {
    id: "28",
    verb: "Take off",
    meaning: "Elbiseyi çıkarmak; uçağın havalanması",
    example: "The plane is scheduled to take off at 8:00 AM.",
  },
  {
    id: "29",
    verb: "Turn down",
    meaning: "Reddetmek; sesi kısmak",
    example: "She turned down the job offer because the salary was too low.",
  },
  {
    id: "30",
    verb: "Work out",
    meaning: "Anlamak, çözmek; spor yapmak",
    example: "I like to work out at the gym three times a week.",
  },
];

// Helper function to shuffle an array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Generate questions from the phrasal verbs data
const generateQuestions = () => {
  const allVerbs = [...PHRASAL_VERBS_DATA];
  const shuffledVerbs = shuffleArray(allVerbs);

  return shuffledVerbs.map((verbData) => {
    const correctAnswer = verbData.meaning;
    
    // Get 3 other random meanings
    const wrongAnswers = PHRASAL_VERBS_DATA
      .filter(v => v.id !== verbData.id) // Exclude the correct verb
      .map(v => v.meaning);
    
    const shuffledWrongAnswers = shuffleArray(wrongAnswers).slice(0, 3);

    const options = shuffleArray([correctAnswer, ...shuffledWrongAnswers]);
    const answerIndex = options.findIndex(option => option === correctAnswer);

    return {
      question: `"${verbData.verb}" ne anlama geliyor?`,
      options: options,
      answerIndex: answerIndex,
    };
  });
};

export const questions = generateQuestions();
