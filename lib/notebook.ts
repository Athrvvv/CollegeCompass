
export interface NoteData {
  [key: string]: any;
}

export interface Note {
  note_id: string;
  note_name: string;
  data: NoteData[];
  remark: string;
}

export interface GenerateReportRequest {
  user_id: string;
  notebook: Note[];
  user_query: string;
}

export interface DownloadPdfRequest {
  html: string;
}
