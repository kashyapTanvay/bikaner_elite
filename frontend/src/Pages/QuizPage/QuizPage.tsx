import { useState } from "react";

// pages/Quiz.tsx
export default function Quiz({ quiz }: any) {
  const [answers, setAnswers] = useState([]);

  return (
    <div className="card">
      {quiz.map((q: any, i: any) => (
        <div key={i}>
          <h4>{q.question}</h4>
          {q.options.map((opt: any, idx: any) => (
            <label key={idx}>
              <input
                type="radio"
                name={`q${i}`}
                onChange={() => {
                  const a = [...answers];
                  // @ts-ignore
                  a[i] = idx;
                  setAnswers(a);
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button className="btn btn-primary">Submit</button>
    </div>
  );
}
