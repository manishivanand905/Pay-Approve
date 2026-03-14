import React from "react";
import { formatCurrency, formatDate, formatDateTime, formatStatusLabel } from "../../utils/formatters";
import {
  DataCell,
  DataRow,
  DataTable,
  DataTableHead,
  EllipsisText,
  HeaderCell,
  StatusPill,
  StrongText,
  TableCard,
  TableScroll,
  getStatusTone,
} from "../admin/Admin.styles";

const PaymentsTable = ({ payments, onSelect, dateLabel = "Date", dateKey = "createdAt" }) => (
  <TableCard>
    <TableScroll>
      <DataTable>
        <DataTableHead>
          <tr>
            <HeaderCell>Request #</HeaderCell>
            <HeaderCell>Requester</HeaderCell>
            <HeaderCell>Project</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Status</HeaderCell>
            <HeaderCell>{dateLabel}</HeaderCell>
          </tr>
        </DataTableHead>
        <tbody>
          {payments.map((payment) => (
            <DataRow
              key={payment._id}
              $interactive
              onClick={() => onSelect(payment)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(payment);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <DataCell data-label="Request #">
                <StrongText>{payment.requestNo}</StrongText>
              </DataCell>
              <DataCell data-label="Requester">{payment.requester?.name || "-"}</DataCell>
              <DataCell data-label="Project">{payment.project?.name || "-"}</DataCell>
              <DataCell data-label="Description">
                <EllipsisText>{payment.description || "-"}</EllipsisText>
              </DataCell>
              <DataCell data-label="Amount">
                <StrongText>{formatCurrency(payment.amount || 0)}</StrongText>
              </DataCell>
              <DataCell data-label="Status">
                <StatusPill $tone={getStatusTone(payment.status)}>
                  {formatStatusLabel(payment.status)}
                </StatusPill>
              </DataCell>
              <DataCell data-label={dateLabel}>
                {dateKey === "updatedAt"
                  ? formatDateTime(payment[dateKey])
                  : formatDate(payment[dateKey])}
              </DataCell>
            </DataRow>
          ))}
        </tbody>
      </DataTable>
    </TableScroll>
  </TableCard>
);

export default PaymentsTable;
