"use client";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSortByDate } from "@/hooks/use-sort-data";

import RemovedItemsTableBody from "./table-body";

import { Button } from "../../ui/button";
import { RemovedItem } from "@/lib/interfaces";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

const RemovedItemsTable: React.FC<{ items: RemovedItem[] }> = ({ items }) => {
  const sortByDate = useSortByDate();

  const handleSortClick = (id: string) => {
    id === sortByDate.selected
      ? sortByDate.onSelected("")
      : sortByDate.onSelected(id);
  };

  return (
    <div>
      <p className="text-center my-3 font-bold text-3xl">Removed Items</p>
      <Table>
        <TableCaption>Removed Items Table</TableCaption>
        <TableHeader className="bg-slate-200">
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>
              CreateAt
              <Button
                id="SortUpCreate"
                variant={
                  sortByDate.selected === "SortUpCreate" ? "default" : "ghost"
                }
                size="icon"
                className="w-5 ml-1"
                onClick={() => handleSortClick("SortUpCreate")}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                id="SortDownCreate"
                variant={
                  sortByDate.selected === "SortDownCreate" ? "default" : "ghost"
                }
                size="icon"
                className="w-5"
                onClick={() => handleSortClick("SortDownCreate")}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              RemovedAt
              <Button
                id="SortUpUpdate"
                variant={
                  sortByDate.selected === "SortUpUpdate" ? "default" : "ghost"
                }
                size="icon"
                className="w-5 ml-1"
                onClick={() => handleSortClick("SortUpUpdate")}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                id="SortDownUpdate"
                variant={
                  sortByDate.selected === "SortDownUpdate" ? "default" : "ghost"
                }
                size="icon"
                className="w-5"
                onClick={() => handleSortClick("SortDownUpdate")}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Tools Bar</TableHead>
          </TableRow>
        </TableHeader>

        <RemovedItemsTableBody items={items} />
      </Table>
    </div>
  );
};

export default RemovedItemsTable;
