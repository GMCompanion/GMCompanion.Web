"use client";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext<any>(undefined);

type Item = {
  id : Number
  name : string;
  type : string;
  quantity : Number;
}

export function State({ children, params }: { children: React.ReactNode, params: any }) {
  const [connection, setConnection] = useState<HubConnection>();
  const [items, setItems] = useState<any[]>([]);
  const [itemToUpdate, setItemToUpdate] = useState<any>();
  const characterId = params.inventoryId;

  useEffect(() => {
    if (connection != null) {
      connection.stop();
    }

    let connectionBuilder = new HubConnectionBuilder()
      .withUrl("https://localhost:7164/characters/inventory")
      .build();

    connectionBuilder.start().then(() => setConnection(connectionBuilder));
  }, []);

  useEffect(() => {
    if(connection == undefined || characterId == undefined) return;
    connection.on("SendItemsUpdate", (message) => {
      setItems(JSON.parse(message)["$values"]);
    });

    connection.on("SendItemUpdate", (message) => {
      let item = JSON.parse(message);
      setItemToUpdate(item)
    });

    connection.send("ConnectToInventory", Number(characterId));

  }, [connection])

  useEffect(() => {
      if ( items.some((i) => i.ItemId === itemToUpdate.ItemId)) {
        setItems(prevItems => prevItems.map((i) =>
        i.ItemId === itemToUpdate.ItemId ? { ...i, Quantity: itemToUpdate.Quantity } : i
        ));
      } else {
        setItems((prevItems) => [...prevItems, itemToUpdate]);
      }
  }, [itemToUpdate]);

  return (
    <AppContext.Provider
      value={{
        items,
        connection,
        itemToUpdate
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
