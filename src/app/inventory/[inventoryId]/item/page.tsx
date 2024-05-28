"use client";

import { useSearchParams } from "next/navigation";
import { useAppContext } from "./../state";
import {
  Button,
  Chip,
  Image,
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Item({ params }) {
  const characterId = params.inventoryId;
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (id == null) return "error";

  const [item, setItem] = useState<any>();
  const { items, itemToUpdate } = useAppContext();

  useEffect(() => {
    let itemCached = items.find((itemCached) => itemCached.ItemId == id);

    fetch(`https://localhost:7164/items/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        itemCached.Type = json.Type;
        setItem(itemCached);
      });
  }, [items]);

  useEffect(() => {
    if (item != null && item.ItemId == itemToUpdate.ItemId) {
      setItem({ ...item, Quantity: itemToUpdate.Quantity });
    }
  }, [itemToUpdate]);

  if (item == undefined) {
    return "loading";
  }


  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      <Card className="max-w-96	">
        <CardHeader className="pb-0 pt-2 flex-col items-start">
          <h1 className="font-bold text-large">{item.Item.Name}</h1>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <div className="inline m-2">
            <span className="mr-2">Type</span>
            <Chip radius="sm">
              {item.Item.Type.length == 0
                ? item.Item.FilterType
                : item.Item.Type}
            </Chip>
          </div>
          <div className="inline m-2">
            <span className="mr-2">Properties</span>
            {item.Item.Tags.$values.map((tag: string) => (
              <Chip className="m-1" radius="sm">
                {tag}
              </Chip>
            ))}
          </div>
          <div className="inline m-2">
            <span className="mr-2">Rarity</span>
            <Chip radius="sm">{item.Item.Rarity}</Chip>
          </div>
          <div className="flex flex-col justify-center items-center">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={item.Item.Image.length === 0 ? "/images/ItemDefaultImage.png" : item.Item.Image}
            width={270}
          />
          </div>

          <div className="flex flex-col justify-center items-center">
            <span>Quantity</span>
            <div className="inline">
              <Button
                isIconOnly
                color="warning"
                variant="faded"
                radius="full"
                size="sm"
                aria-label="Take a photo"
                onClick={() => DeleteOne()}
              >
                -
              </Button>

              <span className="m-1">{item.Quantity}</span>

              <Button
                isIconOnly
                color="danger"
                aria-label="Like"
                radius="full"
                size="sm"
                onClick={() => AddOne()}
              >
                +
              </Button>
            </div>
          </div>

          <div>
            {item.Item.Description}
          </div>
        </CardBody>
      </Card>
    </div>
  );

  function AddOne() {
    fetch(`https://localhost:7164/characters/${characterId}/inventory`, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: item.Item.Id,
        quantity: 1,
      }),
    });
  }

  function DeleteOne() {
    fetch(`https://localhost:7164/characters/${characterId}/inventory`, {
      method: "DELETE",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: item.Item.Id,
        quantity: 1,
      }),
    });
  }
}
