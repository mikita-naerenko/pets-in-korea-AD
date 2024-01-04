"use client";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSortByDate } from "@/hooks/use-sort-data";

import ArticlesTableBody from "./table-body";

import { Button } from "../../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const ArticlesTable = () => {
  const sortByDate = useSortByDate();

  const handleSortClick = (id: string) => {
    id === sortByDate.selected
      ? sortByDate.onSelected("")
      : sortByDate.onSelected(id);
  };

  return (
    <div>
      <p className="text-center my-3 font-bold text-3xl">Article's table</p>
      <Table>
        <TableHeader className="bg-slate-200">
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>IMG</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Link To Source</TableHead>
            <TableHead>Name of Source</TableHead>
            <TableHead>Author's name</TableHead>
            <TableHead>Link to Author</TableHead>
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
              UpdateAt
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

        <ArticlesTableBody />
      </Table>
    </div>
  );
};

export default ArticlesTable;
