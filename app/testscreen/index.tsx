import { COLORS } from "@/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

import Option from "@/components/Test/Option";
import ProgressBar from "@/components/Test/ProgressBar";
import Question from "@/components/Test/Question";
import Score from "@/components/Test/Score";
import { questions } from "@/utils/phrasalVerbs";

export default function TestScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Sorular yüklenemedi veya hiç soru yok.</Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text>Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const question = questions[currentIndex];

  const onSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === question.answerIndex) {
      setScore(score + 1);
    }
  };

  const onNext = () => {
    if (selectedOption === null) return;
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setShowScore(true);
    }
  };

  const onRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowScore(false);
  };

  return (
    <View style={styles.container}>
      {showScore ? (
        <Score
          score={score}
          total={questions.length}
          onRestart={onRestart}
          onExit={() => router.push("/home")}
        />
      ) : (
        <>
          <Question
            question={question.question}
            currentIndex={currentIndex + 1}
            total={questions.length}
          />
          {question.options.map((option, idx) => (
            <Option
              key={idx}
              text={option}
              isSelected={selectedOption === idx}
              isCorrect={question.answerIndex === idx}
              isDisabled={selectedOption !== null}
              onPress={() => onSelectOption(idx)}
            />
          ))}
          <ProgressBar
            progress={
              (currentIndex + (selectedOption !== null ? 1 : 0)) /
              questions.length
            }
          />
          <TouchableOpacity
            style={[
              styles.button,
              { opacity: selectedOption === null ? 0.5 : 1 },
            ]}
            disabled={selectedOption === null}
            onPress={onNext}
          >
            <View>
              <Text style={styles.buttonText}>Sonraki</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 18,
  },
});
