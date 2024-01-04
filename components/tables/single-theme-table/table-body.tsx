"use client";
import { Theme } from "@/lib/interfaces";
import { TableCell, TableRow, TableBody } from "@/components/ui/table";
import MoveToTrashButton from "@/components/buttons/move-to-trash-button";
import EditDictionaryButton from "@/components/buttons/edit-dictionary-button";
import RemoveTranslateButton from "@/components/buttons/remove-translate-button";
import AddTranslateButton from "@/components/buttons/add-translate-button";

export default function SingleThemeTableBody({ theme }: { theme: Theme }) {
  return (
    <TableBody>
      {theme.phrases.map((phrase) => {
        return (
          <TableRow key={phrase.id}>
            <TableCell>
              {phrase.phrase}{" "}
              <EditDictionaryButton
                item={{
                  id: phrase.id,
                  type: "phrase",
                  content: { phrase: phrase.phrase },
                }}
              />
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap">
                <div className="flex flex-col px-2 mr-3 border rounded-md">
                  <span className="text-center text-xs text-slate-400">
                    Translate
                  </span>
                  {phrase.rusTranslates[0].translate}
                </div>
                <div className="flex flex-col px-2 mr-3 border rounded-md">
                  <span className="text-center text-xs text-slate-400">
                    Transcription
                  </span>
                  {phrase.rusTranslates[0].transcription}
                </div>

                <EditDictionaryButton
                  item={{
                    id: phrase.rusTranslates[0].id,
                    type: "rusTranslate",
                    content: {
                      translate: phrase.rusTranslates[0].translate,
                      transcription: phrase.rusTranslates[0].transcription,
                    },
                  }}
                />
                <RemoveTranslateButton
                  item={{
                    itemId: phrase.rusTranslates[0].id,
                    itemName: phrase.rusTranslates[0].translate,
                    typeOfItem: "rusTranslate",
                  }}
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap">
                <div className="flex flex-col px-2 mr-3 border rounded-md">
                  <span className="text-center text-xs text-slate-400">
                    Translate
                  </span>
                  {phrase.engTranslates[0] ? (
                    phrase.engTranslates[0].translate
                  ) : (
                    <AddTranslateButton
                      item={{
                        phraseId: phrase.id,
                        type: "engTranslate",
                        theme: theme.label,
                      }}
                    />
                  )}{" "}
                </div>
                <div className="flex flex-col px-2 mr-3 border rounded-md">
                  <span className="text-center text-xs text-slate-400">
                    Transcription
                  </span>
                  {phrase.engTranslates[0]
                    ? phrase.engTranslates[0].transcription
                    : ""}
                </div>
                {phrase.engTranslates[0] && (
                  <EditDictionaryButton
                    item={{
                      id: phrase.engTranslates[0].id,
                      type: "engTranslate",
                      content: {
                        translate: phrase.engTranslates[0].translate,
                        transcription: phrase.engTranslates[0].transcription,
                      },
                    }}
                  />
                )}
                {phrase.engTranslates[0] && (
                  <RemoveTranslateButton
                    item={{
                      itemId: phrase.engTranslates[0].id,
                      itemName: phrase.engTranslates[0].translate,
                      typeOfItem: "engTranslate",
                    }}
                  />
                )}
              </div>
            </TableCell>
            <TableCell>
              <MoveToTrashButton
                itemId={phrase.id}
                itemName={phrase.phrase}
                typeOfItem={"phrase"}
              />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
