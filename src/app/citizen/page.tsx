"use client";
import { Nav } from "@/components/Nav";
import { useState } from "react";
import { useInfrastructureStore } from "@/store/infrastructure";
import { CitizenQuestion, Donation } from "@/types/infrastructure";

export default function CitizenPage() {
  const infrastructures = useInfrastructureStore((s) => s.infrastructures);
  const [activeTab, setActiveTab] = useState<"questions" | "donations">(
    "questions"
  );
  const [questions, setQuestions] = useState<CitizenQuestion[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  const [newQuestion, setNewQuestion] = useState({
    infrastructureId: "",
    question: "",
    askedBy: "",
    email: "",
  });

  const [newDonation, setNewDonation] = useState({
    infrastructureId: "",
    amount: "",
    donorName: "",
    donorEmail: "",
    message: "",
    isAnonymous: false,
  });

  const submitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const question: CitizenQuestion = {
      id: crypto.randomUUID(),
      infrastructureId: newQuestion.infrastructureId,
      question: newQuestion.question,
      askedBy: newQuestion.askedBy,
      askedAt: new Date().toISOString(),
    };
    setQuestions([...questions, question]);
    setNewQuestion({
      infrastructureId: "",
      question: "",
      askedBy: "",
      email: "",
    });
  };

  const submitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const donation: Donation = {
      id: crypto.randomUUID(),
      infrastructureId: newDonation.infrastructureId,
      amount: parseFloat(newDonation.amount),
      currency: "USD",
      donorName: newDonation.donorName,
      donorEmail: newDonation.donorEmail,
      message: newDonation.message,
      donatedAt: new Date().toISOString(),
      isAnonymous: newDonation.isAnonymous,
    };
    setDonations([...donations, donation]);
    setNewDonation({
      infrastructureId: "",
      amount: "",
      donorName: "",
      donorEmail: "",
      message: "",
      isAnonymous: false,
    });
  };

  return (
    <div>
      <Nav />
      <main className="container py-6 space-y-6">
        <h1 className="text-2xl font-semibold">Participation Citoyenne</h1>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 ${
              activeTab === "questions" ? "border-b-2 border-blue-600" : ""
            }`}
          >
            Questions & Transparence
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={`px-4 py-2 ${
              activeTab === "donations" ? "border-b-2 border-blue-600" : ""
            }`}
          >
            Dons
          </button>
        </div>

        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Poser une question</h2>
              <form onSubmit={submitQuestion} className="space-y-4">
                <select
                  value={newQuestion.infrastructureId}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      infrastructureId: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Sélectionner une infrastructure</option>
                  {infrastructures.map((infra) => (
                    <option key={infra.id} value={infra.id}>
                      {infra.name} - {infra.commune}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={newQuestion.askedBy}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, askedBy: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
                <input
                  type="email"
                  placeholder="Email (optionnel)"
                  value={newQuestion.email}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, email: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
                <textarea
                  placeholder="Votre question..."
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question: e.target.value })
                  }
                  className="w-full border rounded p-2 h-24"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Envoyer la question
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Questions récentes</h2>
              <div className="space-y-4">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="font-medium">{q.question}</div>
                    <div className="text-sm text-gray-500">
                      Par {q.askedBy} •{" "}
                      {new Date(q.askedAt).toLocaleDateString()}
                    </div>
                    {q.answer && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <strong>Réponse:</strong> {q.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "donations" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Faire un don</h2>
              <form onSubmit={submitDonation} className="space-y-4">
                <select
                  value={newDonation.infrastructureId}
                  onChange={(e) =>
                    setNewDonation({
                      ...newDonation,
                      infrastructureId: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Sélectionner une infrastructure</option>
                  {infrastructures.map((infra) => (
                    <option key={infra.id} value={infra.id}>
                      {infra.name} - {infra.commune}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Montant (USD)"
                    value={newDonation.amount}
                    onChange={(e) =>
                      setNewDonation({ ...newDonation, amount: e.target.value })
                    }
                    className="border rounded p-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Nom du donateur"
                    value={newDonation.donorName}
                    onChange={(e) =>
                      setNewDonation({
                        ...newDonation,
                        donorName: e.target.value,
                      })
                    }
                    className="border rounded p-2"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email (optionnel)"
                  value={newDonation.donorEmail}
                  onChange={(e) =>
                    setNewDonation({
                      ...newDonation,
                      donorEmail: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2"
                />
                <textarea
                  placeholder="Message (optionnel)"
                  value={newDonation.message}
                  onChange={(e) =>
                    setNewDonation({ ...newDonation, message: e.target.value })
                  }
                  className="w-full border rounded p-2 h-24"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newDonation.isAnonymous}
                    onChange={(e) =>
                      setNewDonation({
                        ...newDonation,
                        isAnonymous: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  Don anonyme
                </label>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Faire le don
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Dons récents</h2>
              <div className="space-y-4">
                {donations.map((d) => (
                  <div
                    key={d.id}
                    className="border-l-4 border-green-500 pl-4 py-2"
                  >
                    <div className="font-medium">${d.amount} USD</div>
                    <div className="text-sm text-gray-500">
                      Par {d.isAnonymous ? "Don anonyme" : d.donorName} •{" "}
                      {new Date(d.donatedAt).toLocaleDateString()}
                    </div>
                    {d.message && (
                      <div className="mt-1 text-sm">{d.message}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
