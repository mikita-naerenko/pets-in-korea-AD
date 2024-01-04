"use client";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import NewsTableBody from "./table-body";

import { News } from "@/lib/interfaces";

const NewsTable = ({ newsList }: { newsList: News[] }) => {
  return (
    <div>
      <p className="text-center my-3 font-bold text-3xl">News' table</p>
      <Table>
        <TableHeader className="bg-slate-200">
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>IMG</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Link To Source</TableHead>
            <TableHead>Name of Source</TableHead>
            <TableHead>CreateAt</TableHead>
            <TableHead>UpdateAt</TableHead>
            <TableHead>Tools Bar</TableHead>
          </TableRow>
        </TableHeader>
        <NewsTableBody newsList={newsList} />
      </Table>
    </div>
  );
};

export default NewsTable;
