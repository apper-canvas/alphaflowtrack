import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const InvoiceTable = ({ invoices, clients, projects, onEdit, onDelete, onMarkAsSent, onMarkAsPaid }) => {
  if (!invoices || invoices.length === 0) {
    return null;
  }

  const getClientName = (clientId) => {
    const client = clients?.find(c => c.Id === clientId);
    return client?.name || "Unknown Client";
  };

  const getProjectName = (projectId) => {
    const project = projects?.find(p => p.Id === projectId);
    return project?.name || "Unknown Project";
  };

  const getStatusVariant = (status) => {
    const variants = {
      "Draft": "info",
      "Sent": "warning",
      "Paid": "success",
      "Overdue": "error"
    };
    return variants[status] || "default";
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 dark:border-slate-700/50">
              <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Invoice
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Client
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Project
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Amount
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Status
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Due Date
              </th>
              <th className="text-right p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <motion.tr
                key={invoice.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-white/5 dark:border-slate-700/30 hover:bg-white/5 dark:hover:bg-slate-700/20 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-primary-500 rounded-lg flex items-center justify-center shadow-lg">
                      <ApperIcon name="FileText" className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        INV-{String(invoice.Id).padStart(4, "0")}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {getClientName(invoice.clientId)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-slate-700 dark:text-slate-300">
                    {getProjectName(invoice.projectId)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    ${invoice.amount?.toLocaleString()}
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={getStatusVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="text-slate-700 dark:text-slate-300">
                    {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                  </div>
                </td>
<td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    {invoice.status === "Draft" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsSent && onMarkAsSent(invoice)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Mark as Sent"
                      >
                        <ApperIcon name="Send" className="h-4 w-4" />
                      </Button>
                    )}
                    {invoice.status === "Sent" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsPaid && onMarkAsPaid(invoice)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                        title="Mark as Paid"
                      >
                        <ApperIcon name="DollarSign" className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit && onEdit(invoice)}
                    >
                      <ApperIcon name="Edit2" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete && onDelete(invoice)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;