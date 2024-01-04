import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Return random ids set, for arguments need counter - positive number from client side and itemsId - array containing { id: 'id'}

export const getRandom = (
  counter: number,
  itemsId: { id: string }[]
): string[] => {
  if (!Number.isInteger(counter) || counter <= 0) {
    throw new Error("Counter must be a positive integer.");
  }
  const amount = itemsId.length;
  counter = counter > amount ? amount : counter;
  const result: string[] = [];

  for (let i = 0; i < counter; i++) {
    const random = Math.floor(Math.random() * amount);
    if (!result.includes(itemsId[random].id)) {
      result.push(itemsId[random].id);
    } else {
      i--;
    }
  }

  return result;
};
