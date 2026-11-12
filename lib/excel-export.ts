import * as XLSX from "xlsx";

export function exportTransfersToExcel(history: any[], filename = "transfer_history") {
  const data = history.map((h) => ({
    "Transfer ID": h.id,
    "Date & Time": h.created_at,
    "Destination Bank": h.destination_account_details?.bank_name || "N/A",
    "Account Name": h.destination_account_details?.account_name || "N/A",
    "Account Number": h.destination_account_details?.account_number || "N/A",
    "Amount (KES)": h.amount,
    Status: h.status,
    "Initiated By": h.initiated_by_name || "System Admin",
    Reference: h.transaction_reference || "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transfers");
  XLSX.writeFile(workbook, `${filename}_${Date.now()}.xlsx`);
}

