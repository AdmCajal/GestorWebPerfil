import jsPDF from "jspdf";
import { UserOptions } from "jspdf-autotable";

export interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}
