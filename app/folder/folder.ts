import { Note } from '../note/note';

export class Folder {
  id: string;
  name: string;
  noteIds: string[];
  notes: Note[];
}