"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio} from "@nextui-org/react";

export default function Inventory() {
  const params = useSearchParams();
  const id = params.get('id');
  if(id == null) return("error");

  const [character, setCharacter] = useState<any>(null);
  const router = useRouter()
  const items = [
    {
      "id":"1",
      "name": "testitem",
      "weigth" : "1",
      "quantity" : "5"
    }
  ]

  useEffect(() => {
    fetch(`https://localhost:7164/characters/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => setCharacter(json));
  }, []);

  if (!character) {
    return (
      <div>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
  <div className="m-8">
    <h1 className="font-bold m-2">{character.name}</h1>
    <Table 
        color="default"
        selectionMode="single" 
        defaultSelectedKeys={["2"]} 
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Weight</TableColumn>
          <TableColumn>Qty</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No Items."}>
          {items.map((item) => (
            <TableRow key="">
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.weigth}</TableCell>
            <TableCell>{item.quantity}</TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
  </div>);
}
