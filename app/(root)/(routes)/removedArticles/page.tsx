import React from "react";
import prismadb from "@/lib/prismadb";
import RemovedItemsTable from "@/components/tables/removed-items-table/removed-items-table";
import { RemovedItem } from "@/lib/interfaces";

export default async function Page() {
  const items = await prismadb.trash.findMany();

  return (
    <>{items ? <RemovedItemsTable items={items} /> : <p>Items not found</p>}</>
  );
}
