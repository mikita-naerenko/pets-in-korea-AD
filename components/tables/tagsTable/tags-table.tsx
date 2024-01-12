"use client";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tag } from "@/lib/interfaces";
import TagsTableBody from "./table-body";

const TagsTable = ({ tagsList }: { tagsList: Tag[] }) => {
  return (
    <div>
      <p className="text-center my-3 font-bold text-3xl">All Tags</p>
      <Table>
        <TableHeader className="bg-slate-200">
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead>RusTitle</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Count of relations</TableHead>
            <TableHead>View all Related Article</TableHead>
            <TableHead>Tools Bar</TableHead>
          </TableRow>
        </TableHeader>
        <TagsTableBody tagsList={tagsList} />
      </Table>
    </div>
  );
};

export default TagsTable;
