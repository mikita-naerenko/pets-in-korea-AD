"use client";
import CreateNewCurrentPhrase from "@/components/buttons/create-new-current-phrase";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Theme } from "@/lib/interfaces";
import SingleThemeTableBody from "./table-body";
import Image from "next/image";
import EditButton from "@/components/buttons/edit-button";

export default function SingleThemeTable({ theme }: { theme: Theme }) {
  return (
    <div className="relative">
      <div className="absolute top-0 right-10">
        <CreateNewCurrentPhrase />
      </div>

      <h2 className="text-center my-3 font-bold text-3xl">
        {theme.label}
        <EditButton article={theme} type="theme" />
      </h2>
      <div>
        <p>label: {theme.label}</p>
        <p>rusLabel: {theme.rusLabel}</p>
        <p>description: {theme.description}</p>
        <p>
          image:{" "}
          {theme.images && theme.images.length > 0 ? (
            <Image src={theme.images[0].url} width={40} height={30} alt="ff" />
          ) : (
            "none"
          )}
        </p>
        <p>
          tags:{" "}
          {theme.tags.length > 0
            ? theme.tags.map((tag) => <b key={tag.id}>#{tag.label} </b>)
            : "none"}
        </p>
      </div>
      <Table>
        <TableHeader className="bg-slate-200">
          <TableRow>
            <TableHead>Phrase</TableHead>
            <TableHead>Rus </TableHead>
            <TableHead>Eng</TableHead>
            <TableHead>Dev Tools</TableHead>
          </TableRow>
        </TableHeader>
        <SingleThemeTableBody theme={theme} />
      </Table>
    </div>
  );
}
