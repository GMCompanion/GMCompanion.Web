"use client";

import { Button, Card, CardHeader, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "../state";

type Item = {
  id: Number;
  name: string;
  type: string;
  quantity: Number;
};

export default function Item({ params }) {
  const characterId = params.inventoryId;
  const [allItems, setAllItems] = useState<Item[]>([]);

  const { items, item, itemToUpdate } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    fetch("https://localhost:7164/items", {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json: any[]) => {
        let inventory = items;
        const allItemsResponse: Item[] = json.map((j) => {
          const fountItem = inventory.find((i) => i.Item.Id === j.id);
          return {
            id: j.id,
            name: j.name,
            type: j.type,
            quantity: fountItem?.Quantity ?? 0,
          };
        });

        setAllItems(allItemsResponse);
        console.log(allItemsResponse);
      });
  }, []);

  useEffect(() => {
    if (itemToUpdate === undefined) return;
    setAllItems((prevAllItems) =>
      prevAllItems.map((i) => {
        if (i.id === itemToUpdate.ItemId) {
          i.quantity = itemToUpdate.Quantity;
        }
        return i;
      })
    );
  }, [itemToUpdate]);

  if (allItems.length == 0) {
    return (
      <div>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {allItems.map((i) => (
        <Card
          shadow="sm"
          key={i.id}
          isPressable
          className="w-64 p-2 m-4"
          onPress={() => router.push(`../inventory/item?id=${item.id}`)}
        >
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">{i.name}</p>
              <p className="text-small text-default-500">{i.type}</p>
            </div>
            <div>
              <Button
                isIconOnly
                color="warning"
                variant="faded"
                aria-label="Take a photo"
                onClick={() => DeleteOne(i.id)}
              >
                -
              </Button>
              <p>{i.quantity}</p>
              <Button
                isIconOnly
                color="danger"
                aria-label="Like"
                onClick={() => AddOne(i.id)}
              >
                +
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  function AddOne(id: Number) {
    fetch(`https://localhost:7164/characters/${characterId}/inventory`, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: id,
        quantity: 1,
      }),
    });
  }

  function DeleteOne(id: Number) {
    fetch(`https://localhost:7164/characters/${characterId}/inventory`, {
      method: "DELETE",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: id,
        quantity: 1,
      }),
    });
  }
}
