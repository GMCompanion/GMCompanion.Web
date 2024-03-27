"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { Card, CardHeader } from "@nextui-org/react";
import { useRouter } from 'next/navigation'

export default function Home() {
  const [characters, setCharacters] = useState<any[]>([]);
  const router = useRouter()

  useEffect(() => {
    fetch("https://localhost:7164/characters", {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => setCharacters(json));
  }, []);

  if (!characters) {
    return (
      <div>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex items-center min-h-screen flex-col items-start">
      {characters.map((character) => (
        <Card shadow="sm" key={character.id} isPressable className="w-64 p-2 m-4" onPress={() => router.push(`../inventory?id=${character.id}`)}>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">{character.name}</p>
              <p className="text-small text-default-500">{character.player}</p>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
