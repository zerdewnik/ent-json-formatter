"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";

export default function EntJsonFormatterApp() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const parseInput = () => {
    const blocks = input.trim().split(/\n(?=\d+\.)/); // разделение по номерам
    const parsed = blocks
      .map((block, index) => {
        const lines = block.trim().split(/\n+/);
        if (lines.length < 2) return null;

        const questionLine = lines[0].replace(/^\d+\.\s*/, "").trim();
        const answers = lines.slice(1).map((line) => {
          const isCorrect = /[*✓]/.test(line);
          const cleanedLine = line.replace(/[*✓]/g, "").trim();
          const answerText = cleanedLine.replace(/^[A-D]\)\s*/, "");
          return {
            answer: answerText,
            is_correct: isCorrect ? 1 : 0,
          };
        });

        return {
          html: `<p>${questionLine}</p>`,
          answers,
          number: index + 1,
        };
      })
      .filter(Boolean);

    setResults(parsed);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">ENT JSON Formatter</h1>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Вставьте задания: каждый с номером и вариантами ответов"
        className="min-h-[200px]"
      />
      <Button onClick={parseInput} className="mt-2">Форматировать</Button>

      {results.map((res: any) => (

        <div key={res.number} className="space-y-4">
          <h2 className="text-lg font-semibold">Вопрос {res.number}</h2>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">HTML блок</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(res.html)}
                >
                  <Copy className="w-4 h-4 mr-1" /> Копировать
                </Button>
              </div>
              <pre className="bg-muted p-2 rounded text-sm overflow-auto">
                {res.html}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">JSON массив ответов</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(res.answers, null, 2))}
                >
                  <Copy className="w-4 h-4 mr-1" /> Копировать
                </Button>
              </div>
              <pre className="bg-muted p-2 rounded text-sm overflow-auto">
                {JSON.stringify(res.answers, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
