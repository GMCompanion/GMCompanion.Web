"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "./state";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function InventoryPage({params}) {

  const router = useRouter()

  const { items } = useAppContext();

  return (
    <div>
      <Button
        isIconOnly
        color="danger"
        aria-label="Like"
        onClick={() => router.push(`${params.inventoryId}/item-list`)}
      >
        +
      </Button>
      <Table
        color="default"
        selectionMode="single"
        selectionBehavior="replace"
        defaultSelectedKeys={["2"]}
        aria-label="Example static collection table"
        onRowAction={(key) => router.push(`${params.inventoryId}/item?id=${key}`)}
        suppressHydrationWarning
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Weight</TableColumn>
          <TableColumn>Qty</TableColumn>
        </TableHeader>
        <TableBody items={items} emptyContent={"No Items."}>
          {(item) => (
            <TableRow key={item.ItemId}>
              <TableCell>{item.Item.Name}</TableCell>
              <TableCell>{item.Item.Weigth}</TableCell>
              <TableCell>{item.Quantity}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}